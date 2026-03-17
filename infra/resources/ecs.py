import json
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore

from .util import tag_name


@dataclass
class NetworkConfig:
    """Configuration for VPC and network setup.

    :param vpc_cidr: CIDR block for the VPC
    :type vpc_cidr: str
    :param subnet_cidrs: List of CIDR blocks for subnets
    :type subnet_cidrs: List[str]
    :param availability_zones: List of availability zones for subnets
    :type availability_zones: List[str]
    """

    vpc_cidr: str = "10.0.0.0/16"
    subnet_cidrs: List[str] = field(
        default_factory=lambda: ["10.0.1.0/24", "10.0.2.0/24"]
    )
    availability_zones: List[str] = field(
        default_factory=lambda: ["eu-west-1a", "eu-west-1b"]
    )


@dataclass
class SecurityGroupRule:
    """Configuration for a security group rule.

    :param description: Description of the rule
    :type description: str
    :param from_port: Starting port
    :type from_port: int
    :param to_port: Ending port
    :type to_port: int
    :param protocol: Protocol (tcp, udp, etc)
    :type protocol: str
    :param cidr_blocks: List of CIDR blocks
    :type cidr_blocks: List[str]
    """

    description: str
    from_port: int
    to_port: int
    protocol: str = "tcp"
    cidr_blocks: List[str] = field(default_factory=lambda: ["0.0.0.0/0"])


@dataclass
class LoadBalancerConfig:
    """Configuration for Application Load Balancer.

    :param port_mappings: List of port mappings (ingress port, egress port, protocol)
    :type port_mappings: List[Tuple[int, int, str]]
    :param health_check_port: Port for health checks
    :type health_check_port: int
    :param health_check_path: Path for health checks
    :type health_check_path: str
    """

    port_mappings: List[Tuple[int, int, str]]
    health_check_port: int = 8080
    health_check_path: str = "/health"


@dataclass
class TaskConfig:
    """Configuration for ECS Task.

    :param cpu: CPU units
    :type cpu: str
    :param memory: Memory in MB
    :type memory: str
    :param container_ports: Container ports
    :type container_ports: List[int]
    :param container_name: Container name
    :type container_name: str
    :param repo_uri: ECR repository URI
    :type repo_uri: str
    :param repo_tag: ECR repository tag
    :type repo_tag: str
    :param environment: Environment variables
    :type environment: Optional[Dict[str, str]]
    :param secrets: SSM parameter mappings
    :type secrets: Optional[Dict[str, str]]
    """

    cpu: str
    memory: str
    container_ports: List[int]
    container_name: str
    repo_uri: str
    repo_tag: str
    environment: Optional[Dict[str, str]] = None
    secrets: Optional[Dict[str, str]] = None


class ECSService(pulumi.ComponentResource):
    """
    A component resource for creating an ECS service with associated resources.

    :param name: Unique name for the component
    :type name: str
    :param environment: Environment name (e.g., 'staging', 'prod')
    :type environment: str
    :param network_config: Network configuration
    :type network_config: NetworkConfig
    :param security_rules: List of security group rules
    :type security_rules: List[SecurityGroupRule]
    :param lb_config: Load balancer configuration
    :type lb_config: LoadBalancerConfig
    :param task_config: Task configuration
    :type task_config: TaskConfig
    :param tags: Resource tags
    :type tags: Optional[Dict[str, str]]
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    _ECS_TASK_EXECUTION_ROLE = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "sts:AssumeRole",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Effect": "Allow",
                "Sid": "",
            }
        ],
    }

    _ECS_SECRETS_POLICY = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "secretsmanager:GetSecretValue",
                    "ssm:GetParameters",
                ],
                "Resource": "*",
            }
        ],
    }

    _ECS_TASK_ROLE_POLICY = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "sts:AssumeRole",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Effect": "Allow",
                "Sid": "",
            }
        ],
    }

    def __init__(
        self,
        name: str,
        environment: str,
        network_config: NetworkConfig,
        security_rules: List[SecurityGroupRule],
        lb_config: LoadBalancerConfig,
        task_config: TaskConfig,
        tags: Optional[Dict[str, str]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("pkg:index:ECSService", name, None, opts)

        self._name = name
        self._name_prefix = tag_name()
        self.environment = environment

        # Set default tags first, then extend/override with user tags if provided
        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": self._name_prefix,
            "Environment": environment,
            "Service": name,
        }
        self.tags = default_tags | (tags or {})

        # Create network infrastructure
        self.vpc, self.subnets, self.security_group = self._create_network(
            network_config, security_rules
        )

        # Create ECS cluster and roles
        self.cluster, self.execution_role, self.task_role = self._create_cluster()

        # Create load balancer and target groups
        self.load_balancer, self.target_groups = self._create_load_balancer(lb_config)

        # Create task definition
        self.task_definition = self._create_task_definition(task_config)

        # Create service
        self.service = self._create_service(task_config)

        self.register_outputs(
            {
                "cluster_name": self.cluster.name,
                "service_name": self.service.name,
                "load_balancer_dns": self.load_balancer.dns_name,
                "vpc_id": self.vpc.id,
                "subnet_ids": [subnet.id for subnet in self.subnets],
            }
        )

    def _create_network(
        self, config: NetworkConfig, security_rules: List[SecurityGroupRule]
    ) -> Tuple[aws.ec2.Vpc, List[aws.ec2.Subnet], aws.ec2.SecurityGroup]:
        """Create VPC, subnets, and security group.

        :param config: Network configuration parameters
        :type config: NetworkConfig
        :param security_rules: List of security group rules to apply
        :type security_rules: List[SecurityGroupRule]
        :return: Created VPC, subnets, and security group
        :rtype: Tuple[aws.ec2.Vpc, List[aws.ec2.Subnet], aws.ec2.SecurityGroup]
        """
        vpc = self._create_vpc(config)
        gateway = self._create_internet_gateway(vpc)
        route_table = self._create_route_table(vpc, gateway)
        subnets = self._create_subnets(config, vpc, route_table)
        security_group = self._create_security_group(vpc, security_rules)
        return vpc, subnets, security_group

    def _create_vpc(self, config: NetworkConfig) -> aws.ec2.Vpc:
        """Create VPC with DNS support.

        :param config: Network configuration containing VPC CIDR
        :type config: NetworkConfig
        :return: Created VPC
        :rtype: aws.ec2.Vpc
        """
        return aws.ec2.Vpc(
            f"{self._name}-vpc",
            cidr_block=config.vpc_cidr,
            enable_dns_hostnames=True,
            enable_dns_support=True,
            tags={**self.tags, "Name": f"{self._name}-vpc"},
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_internet_gateway(self, vpc: aws.ec2.Vpc) -> aws.ec2.InternetGateway:
        """Create Internet Gateway for VPC.

        :param vpc: VPC to attach gateway to
        :type vpc: aws.ec2.Vpc
        :return: Created Internet Gateway
        :rtype: aws.ec2.InternetGateway
        """
        return aws.ec2.InternetGateway(
            f"{self._name}-igw",
            vpc_id=vpc.id,
            tags={**self.tags, "Name": f"{self._name}-igw"},
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_route_table(
        self, vpc: aws.ec2.Vpc, gateway: aws.ec2.InternetGateway
    ) -> aws.ec2.RouteTable:
        """Create route table with internet access.

        :param vpc: VPC for route table
        :type vpc: aws.ec2.Vpc
        :param gateway: Internet Gateway for default route
        :type gateway: aws.ec2.InternetGateway
        :return: Created route table
        :rtype: aws.ec2.RouteTable
        """
        return aws.ec2.RouteTable(
            f"{self._name}-rt",
            vpc_id=vpc.id,
            routes=[
                aws.ec2.RouteTableRouteArgs(
                    cidr_block="0.0.0.0/0",
                    gateway_id=gateway.id,
                ),
            ],
            tags={**self.tags, "Name": f"{self._name}-rt"},
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_subnets(
        self, config: NetworkConfig, vpc: aws.ec2.Vpc, route_table: aws.ec2.RouteTable
    ) -> List[aws.ec2.Subnet]:
        """Create subnets and associate with route table.

        :param config: Network configuration with subnet details
        :type config: NetworkConfig
        :param vpc: VPC for subnets
        :type vpc: aws.ec2.Vpc
        :param route_table: Route table to associate with subnets
        :type route_table: aws.ec2.RouteTable
        :return: List of created subnets
        :rtype: List[aws.ec2.Subnet]
        """
        subnets = []
        for idx, (cidr, az) in enumerate(
            zip(config.subnet_cidrs, config.availability_zones)
        ):
            subnet = self._create_subnet(vpc, cidr, az, idx)
            self._associate_route_table(route_table, subnet, idx)
            subnets.append(subnet)
        return subnets

    def _create_subnet(
        self, vpc: aws.ec2.Vpc, cidr: str, az: str, idx: int
    ) -> aws.ec2.Subnet:
        """Create single subnet in VPC.

        :param vpc: VPC for subnet
        :type vpc: aws.ec2.Vpc
        :param cidr: CIDR block for subnet
        :type cidr: str
        :param az: Availability zone for subnet
        :type az: str
        :param idx: Index for naming
        :type idx: int
        :return: Created subnet
        :rtype: aws.ec2.Subnet
        """
        return aws.ec2.Subnet(
            f"{self._name}-subnet-{idx}",
            vpc_id=vpc.id,
            cidr_block=cidr,
            availability_zone=az,
            map_public_ip_on_launch=True,
            tags={**self.tags, "Name": f"{self._name}-subnet-{idx}"},
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _associate_route_table(
        self, route_table: aws.ec2.RouteTable, subnet: aws.ec2.Subnet, idx: int
    ) -> aws.ec2.RouteTableAssociation:
        """Associate subnet with route table.

        :param route_table: Route table to associate
        :type route_table: aws.ec2.RouteTable
        :param subnet: Subnet to associate
        :type subnet: aws.ec2.Subnet
        :param idx: Index for naming
        :type idx: int
        :return: Created route table association
        :rtype: aws.ec2.RouteTableAssociation
        """
        return aws.ec2.RouteTableAssociation(
            f"{self._name}-rt-assoc-{idx}",
            subnet_id=subnet.id,
            route_table_id=route_table.id,
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_security_group(
        self, vpc: aws.ec2.Vpc, security_rules: List[SecurityGroupRule]
    ) -> aws.ec2.SecurityGroup:
        """Create security group with rules.

        :param vpc: VPC for security group
        :type vpc: aws.ec2.Vpc
        :param security_rules: List of security rules to apply
        :type security_rules: List[SecurityGroupRule]
        :return: Created security group
        :rtype: aws.ec2.SecurityGroup
        """
        return aws.ec2.SecurityGroup(
            f"{self._name}-sg",
            vpc_id=vpc.id,
            description=f"Security group for {self._name}",
            ingress=self._create_ingress_rules(security_rules),
            egress=self._create_egress_rules(),
            tags={**self.tags, "Name": f"{self._name}-sg"},
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_ingress_rules(
        self, security_rules: List[SecurityGroupRule]
    ) -> List[aws.ec2.SecurityGroupIngressArgs]:
        """Create ingress rules from security rules.

        :param security_rules: List of security rules to convert
        :type security_rules: List[SecurityGroupRule]
        :return: List of ingress rule arguments
        :rtype: List[aws.ec2.SecurityGroupIngressArgs]
        """
        return [
            aws.ec2.SecurityGroupIngressArgs(
                description=rule.description,
                from_port=rule.from_port,
                to_port=rule.to_port,
                protocol=rule.protocol,
                cidr_blocks=rule.cidr_blocks,
            )
            for rule in security_rules
        ]

    def _create_egress_rules(self) -> List[aws.ec2.SecurityGroupEgressArgs]:
        """Create default egress rules.

        :return: List of egress rule arguments
        :rtype: List[aws.ec2.SecurityGroupEgressArgs]
        """
        return [
            aws.ec2.SecurityGroupEgressArgs(
                from_port=0,
                to_port=0,
                protocol="-1",
                cidr_blocks=["0.0.0.0/0"],
            ),
        ]

    def _create_cluster(self) -> Tuple[aws.ecs.Cluster, aws.iam.Role, aws.iam.Role]:
        """Create ECS cluster and roles.

        :return: Created cluster, execution role, and task role
        :rtype: Tuple[aws.ecs.Cluster, aws.iam.Role, aws.iam.Role]
        """
        cluster = self._create_ecs_cluster()
        execution_role = self._create_execution_role()
        task_role = self._create_task_role()
        return cluster, execution_role, task_role

    def _create_ecs_cluster(self) -> aws.ecs.Cluster:
        """Create ECS cluster with container insights.

        :return: Created ECS cluster
        :rtype: aws.ecs.Cluster
        """
        return aws.ecs.Cluster(
            f"{self._name}-cluster",
            tags=self.tags,
            settings=[
                aws.ecs.ClusterSettingArgs(name="containerInsights", value="enabled")
            ],
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_execution_role(self) -> aws.iam.Role:
        """Create task execution role with policies.

        :return: Created execution role with attached policies
        :rtype: aws.iam.Role
        """
        role = aws.iam.Role(
            f"{self._name}-task-execution-role",
            assume_role_policy=json.dumps(self._ECS_TASK_EXECUTION_ROLE),
            tags=self.tags,
            opts=pulumi.ResourceOptions(parent=self),
        )
        self._attach_execution_role_policies(role)
        return role

    def _attach_execution_role_policies(self, role: aws.iam.Role) -> None:
        """Attach required policies to execution role.

        :param role: Role to attach policies to
        :type role: aws.iam.Role
        """
        self._attach_ssm_policy(role)
        self._attach_ecs_policy(role)
        self._attach_secrets_policy(role)

    def _attach_ssm_policy(self, role: aws.iam.Role) -> aws.iam.RolePolicyAttachment:
        """Attach SSM read policy to role.

        :param role: Role to attach policy to
        :type role: aws.iam.Role
        :return: Created policy attachment
        :rtype: aws.iam.RolePolicyAttachment
        """
        return aws.iam.RolePolicyAttachment(
            f"{self._name}-task-exec-ssm-policy",
            role=role.name,
            policy_arn="arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess",
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _attach_ecs_policy(self, role: aws.iam.Role) -> aws.iam.RolePolicyAttachment:
        """Attach ECS execution policy to role.

        :param role: Role to attach policy to
        :type role: aws.iam.Role
        :return: Created policy attachment
        :rtype: aws.iam.RolePolicyAttachment
        """
        return aws.iam.RolePolicyAttachment(
            f"{self._name}-task-exec-policy",
            role=role.name,
            policy_arn="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _attach_secrets_policy(self, role: aws.iam.Role) -> None:
        """Create and attach secrets policy to role.

        :param role: Role to attach policy to
        :type role: aws.iam.Role
        """
        policy = self._create_secrets_policy()
        aws.iam.RolePolicyAttachment(
            f"{self._name}-secrets-policy-attachment",
            role=role.name,
            policy_arn=policy.arn,
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_secrets_policy(self) -> aws.iam.Policy:
        """Create secrets access policy.

        :return: Created secrets policy
        :rtype: aws.iam.Policy
        """
        return aws.iam.Policy(
            f"{self._name}-secrets-policy",
            policy=json.dumps(self._ECS_SECRETS_POLICY),
            tags=self.tags,
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_task_role(self) -> aws.iam.Role:
        """Create task role for ECS tasks.

        :return: Created task role
        :rtype: aws.iam.Role
        """
        return aws.iam.Role(
            f"{self._name}-task-role",
            assume_role_policy=json.dumps(self._ECS_TASK_ROLE_POLICY),
            tags=self.tags,
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_load_balancer(
        self, config: LoadBalancerConfig
    ) -> Tuple[aws.lb.LoadBalancer, List[aws.lb.TargetGroup]]:
        """Create ALB and target groups.

        :param config: Load balancer configuration
        :type config: LoadBalancerConfig
        :return: Tuple of load balancer and list of target groups
        :rtype: Tuple[aws.lb.LoadBalancer, List[aws.lb.TargetGroup]]
        """
        # Create ALB
        alb = aws.lb.LoadBalancer(
            f"{self._name}-alb",
            internal=False,
            load_balancer_type="application",
            security_groups=[self.security_group.id],
            subnets=[subnet.id for subnet in self.subnets],
            tags=self.tags,
            opts=pulumi.ResourceOptions(parent=self),
        )

        # Create target groups
        target_groups = []
        for idx, (ingress_port, egress_port, protocol) in enumerate(
            config.port_mappings
        ):
            pulumi.log.info(
                f"🔍 Target group {idx}: Ingress port: {ingress_port}, Egress port: {egress_port}, Protocol: {protocol}"
            )
            target_group = aws.lb.TargetGroup(
                f"{self._name}-tg-{idx}",
                port=egress_port,
                protocol=protocol,
                vpc_id=self.vpc.id,
                target_type="ip",
                health_check=aws.lb.TargetGroupHealthCheckArgs(
                    enabled=True,
                    path=config.health_check_path,
                    port=str(config.health_check_port),
                    protocol="HTTP",
                    healthy_threshold=3,
                    unhealthy_threshold=3,
                    timeout=5,
                    interval=30,
                ),
                tags=self.tags,
                opts=pulumi.ResourceOptions(parent=self),
            )

            # Create listener
            aws.lb.Listener(
                f"{self._name}-listener-{idx}",
                load_balancer_arn=alb.arn,
                port=ingress_port,
                protocol=protocol,
                default_actions=[
                    aws.lb.ListenerDefaultActionArgs(
                        type="forward",
                        target_group_arn=target_group.arn,
                    )
                ],
                opts=pulumi.ResourceOptions(
                    parent=self,
                    depends_on=[alb, target_group],
                ),
            )

            target_groups.append(target_group)

        return alb, target_groups

    def _create_task_definition(self, config: TaskConfig) -> aws.ecs.TaskDefinition:
        """Create ECS task definition.

        :param config: Task configuration
        :type config: TaskConfig
        :return: Task definition
        :rtype: aws.ecs.TaskDefinition
        """
        # Create log group

        # prepare log_group_name so that we can json.dumps the container_definitions with the log_group_name included
        log_group_name = f"/ecs/{self._name}"

        aws.cloudwatch.LogGroup(
            f"{self._name}-log-group",
            name=log_group_name,
            retention_in_days=30,
            tags=self.tags,
            opts=pulumi.ResourceOptions(parent=self),
        )

        # Prepare environment variables
        environment = []
        if config.environment:
            environment = [
                {"name": k, "value": v} for k, v in config.environment.items()
            ]

        # Prepare secrets
        secrets = []
        if config.secrets:
            secrets = [{"name": k, "valueFrom": v} for k, v in config.secrets.items()]

        container_definitions = [
            {
                "name": config.container_name,
                "image": pulumi.Output.format(
                    "{0}:{1}", config.repo_uri, config.repo_tag
                ),
                "essential": True,
                "portMappings": [
                    {
                        "containerPort": container_port,
                        "hostPort": container_port,
                        "protocol": "tcp",
                    }
                    for container_port in config.container_ports
                ],
                "environment": environment,
                "secrets": secrets,
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-group": log_group_name,
                        "awslogs-region": "eu-west-1",
                        "awslogs-stream-prefix": "ecs",
                    },
                },
            }
        ]

        return aws.ecs.TaskDefinition(
            f"{self._name}-task-definition",
            family=f"{self._name}-task-definition",
            cpu=config.cpu,
            memory=config.memory,
            network_mode="awsvpc",
            requires_compatibilities=["FARGATE"],
            execution_role_arn=self.execution_role.arn,
            task_role_arn=self.task_role.arn,
            container_definitions=pulumi.Output.json_dumps(container_definitions),
            tags=self.tags,
            opts=pulumi.ResourceOptions(parent=self),
        )

    def _create_service(self, config: TaskConfig) -> aws.ecs.Service:
        """Create ECS service.

        :param config: Task configuration
        :type config: TaskConfig
        :return: ECS service
        :rtype: aws.ecs.Service
        """
        load_balancer_configs = []
        for _idx, target_group in enumerate(self.target_groups):

            load_balancer_configs.append(
                aws.ecs.ServiceLoadBalancerArgs(
                    target_group_arn=target_group.arn,
                    container_name=config.container_name,
                    container_port=target_group.port,
                )
            )

        return aws.ecs.Service(
            f"{self._name}-service",
            cluster=self.cluster.name,
            desired_count=1,
            launch_type="FARGATE",
            task_definition=self.task_definition.arn,
            network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
                subnets=[subnet.id for subnet in self.subnets],
                security_groups=[self.security_group.id],
                assign_public_ip=True,
            ),
            load_balancers=load_balancer_configs,
            deployment_controller=aws.ecs.ServiceDeploymentControllerArgs(
                type="ECS",
            ),
            tags=self.tags,
            opts=pulumi.ResourceOptions(
                parent=self,
                depends_on=[*self.target_groups],
            ),
        )
