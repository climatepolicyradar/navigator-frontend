from dataclasses import dataclass
from typing import Any, Dict, List, Optional, cast

import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore

from .util import tag_name


@dataclass
class DNSConfig:
    """Configuration for DNS setup.

    :param domain: Full domain name for the service
    :type domain: str
    :param zone_id: Route53 hosted zone ID
    :type zone_id: str
    :param environment: Environment name (e.g., 'staging', 'prod')
    :type environment: str
    :param certificate_type: Type of certificate to create
    :type certificate_type: str
    :param subject_alternative_names: Subject alternative names for the certificate
    :type subject_alternative_names: Optional[List[str]]
    """

    domain: str
    environment: str
    certificate_type: str = "CLOUDFRONT"  # "CLOUDFRONT" or "SSL"
    zone_id: Optional[str] = None
    subject_alternative_names: Optional[List[str]] = None


class DNS(pulumi.ComponentResource):
    """
    A component resource for creating DNS configuration for any service.

    :param name: Unique name for the component
    :type name: str
    :param config: DNS configuration
    :type config: DNSConfig
    :param load_balancer: Load Balancer to associate with DNS
    :type load_balancer: aws.lb.LoadBalancer
    :param target_group: Target group for the ALB listener
    :type target_group: aws.lb.TargetGroup
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        name: str,
        config: DNSConfig,
        load_balancer: Optional[aws.lb.LoadBalancer] = None,
        target_group: Optional[aws.lb.TargetGroup] = None,
        tags: Optional[Dict[str, Any]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("pkg:index:DNS", name, None, opts)

        self.config = config
        self._name_prefix = tag_name()
        self.opts = self._get_opts(opts)

        # Set default tags first, then extend/override with user tags if provided
        # If user provided tags, update defaults with them (user tags take precedence)
        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": self._name_prefix,
            "Environment": self.config.environment,
            "Service": self._name,
        }
        self.tags = default_tags | (tags or {})

        self.zone_id = self.config.zone_id

        # Create and validate certificate
        provider = None
        if self.config.certificate_type == "CLOUDFRONT":
            provider = aws.Provider(f"{self._name}-useast1", region="us-east-1")

        self.certificate = self._create_certificate(provider)
        self.cert_validation_records = self._create_validation_records(provider)
        self.cert_validation = self._validate_certificate(provider)

        outputs = {
            "domain": self.config.domain,
            "certificate_arn": self.certificate.arn,
            "hosted_zone_id": self.zone_id,
        }
        # Create DNS record & HTTPS listener
        if load_balancer and target_group:
            # Get ALB hosted zone ID dynamically
            alb_zone_id = aws.elb.get_hosted_zone_id()
            self.domain_record = self.create_alias_record(
                name=self.config.domain,
                target_zone_id=alb_zone_id.id,
                target_dns_name=cast(str, load_balancer.dns_name),
                evaluate_target_health=False,
            )

            if target_group:
                self.https_listener = self._create_https_listener(
                    load_balancer, target_group
                )
                outputs = outputs | {
                    "https_listener_arn": self.https_listener.arn,
                }

        self.register_outputs(outputs)

    def _get_opts(
        self, opts: Optional[pulumi.ResourceOptions] = None
    ) -> pulumi.ResourceOptions:
        return pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )

    def create_record(
        self, name: str, record_type: str, records: List[str], ttl: int = 300
    ) -> aws.route53.Record:
        """Create a DNS record in the zone.

        :param name: The name for the DNS record
        :type name: str
        :param record_type: The type of DNS record (A, CNAME, etc)
        :type record_type: str
        :param records: List of values for the record
        :type records: List[str]
        :param ttl: Time to live in seconds, defaults to 300
        :type ttl: int
        :return: The created Route53 record
        :rtype: aws.route53.Record
        """
        return aws.route53.Record(
            f"{self.config.domain}-{name}",
            zone_id=cast(str, self.zone_id),
            name=name,
            type=record_type,
            ttl=ttl,
            records=records,
            opts=self.opts,
        )

    def create_alias_record(
        self,
        name: str,
        target_zone_id: str,
        target_dns_name: str,
        record_type: str = "A",
        evaluate_target_health: bool = True,
    ) -> aws.route53.Record:
        """Create an alias record (e.g. for CloudFront).

        :param name: The name for the DNS record
        :type name: str
        :param target_zone_id: The zone ID of the target service
        :type target_zone_id: str
        :param target_dns_name: The DNS name of the target service
        :type target_dns_name: str
        :param record_type: The type of DNS record, defaults to "A"
        :type record_type: str
        :param evaluate_target_health: Whether to evaluate target health, defaults to True
        :type evaluate_target_health: bool
        :return: The created Route53 record
        :rtype: aws.route53.Record
        """
        return aws.route53.Record(
            f"{name}-alias",
            zone_id=cast(str, self.zone_id),
            name=name,
            type=record_type,
            aliases=[
                aws.route53.RecordAliasArgs(
                    name=target_dns_name,
                    zone_id=target_zone_id,
                    evaluate_target_health=evaluate_target_health,
                )
            ],
            opts=self.opts,
        )

    def _create_certificate(
        self, provider: Optional[aws.Provider] = None
    ) -> aws.acm.Certificate:
        """Create ACM certificate for the domain."""
        opts = self.opts
        if self.config.certificate_type == "CLOUDFRONT":
            opts = opts.merge(pulumi.ResourceOptions(provider=provider))

        certificate_args = {
            "domain_name": self.config.domain,
            "validation_method": "DNS",
            "tags": self.tags,
            "opts": opts,
        }

        # Add subject alternative names if provided
        if self.config.subject_alternative_names:
            certificate_args["subject_alternative_names"] = (
                self.config.subject_alternative_names
            )

        return aws.acm.Certificate(f"{self._name}-cert", **certificate_args)

    def _create_validation_records(
        self, provider: Optional[aws.Provider] = None
    ) -> pulumi.Output:
        """Create DNS validation records for the certificate."""

        def create_records(dvos):
            opts = self.opts
            if self.config.certificate_type == "CLOUDFRONT":
                opts = opts.merge(pulumi.ResourceOptions(provider=provider))

            records = []
            for count, dvo in enumerate(dvos):
                records.append(
                    aws.route53.Record(
                        f"{self._name}-validation-{count}",
                        zone_id=cast(str, self.zone_id),
                        name=dvo.resource_record_name,
                        records=[dvo.resource_record_value],
                        type=dvo.resource_record_type,
                        ttl=60,
                        opts=opts,
                    )
                )
            return records

        # When the certificate's domain_validation_options becomes available, Pulumi
        # will automatically call our create_records function with those options as the
        # dvos parameter. This is necessary because the certificate validation options
        # aren't immediately available - they're only known after the certificate is
        # created.
        return self.certificate.domain_validation_options.apply(create_records)

    def _validate_certificate(
        self, provider: Optional[aws.Provider] = None
    ) -> aws.acm.CertificateValidation:
        """Create certificate validation."""
        opts = self.opts
        if self.config.certificate_type == "CLOUDFRONT":
            opts = opts.merge(pulumi.ResourceOptions(provider=provider))

        return aws.acm.CertificateValidation(
            f"{self._name}-cert-validation",
            certificate_arn=self.certificate.arn,
            validation_record_fqdns=self.cert_validation_records.apply(
                lambda cvr: [record.fqdn for record in cvr]
            ),
            opts=pulumi.ResourceOptions.merge(
                opts,
                pulumi.ResourceOptions(depends_on=[self.certificate]),
            ),
        )

    def _create_https_listener(
        self,
        load_balancer: aws.lb.LoadBalancer,
        target_group: aws.lb.TargetGroup,
    ) -> aws.lb.Listener:
        """Create HTTPS listener for the load balancer."""
        return aws.lb.Listener(
            f"{self._name}-https-listener",
            load_balancer_arn=load_balancer.arn,
            port=443,
            protocol="HTTPS",
            ssl_policy="ELBSecurityPolicy-2016-08",
            certificate_arn=self.certificate.arn,
            default_actions=[
                aws.lb.ListenerDefaultActionArgs(
                    type="forward",
                    target_group_arn=target_group.arn,
                )
            ],
            tags=self.tags,
            opts=pulumi.ResourceOptions.merge(
                self.opts,
                pulumi.ResourceOptions(
                    depends_on=[load_balancer, target_group, self.cert_validation]
                ),
            ),
        )
