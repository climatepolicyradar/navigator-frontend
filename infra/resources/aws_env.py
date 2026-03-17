import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore


def get_env():
    alias_prefix = "policyradar-"
    # this values is set in the aws_env stack
    # the coupling here does not feel too intuitive, but it works for now
    account_alias = aws.iam.get_account_alias().account_alias
    env = account_alias.replace(alias_prefix, "")
    return env


def get_root_zone_id():
    env = get_env()
    aws_env_stack = pulumi.StackReference(f"climatepolicyradar/aws_env/{env}")
    return aws_env_stack.get_output("root_zone_id")
