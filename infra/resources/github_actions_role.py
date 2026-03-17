"""Component resource for GitHub Actions IAM role."""

import json
from typing import Optional

import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore


class GitHubActionsRole(pulumi.ComponentResource):
    """A component resource for creating GitHub Actions IAM role.

    :param name: Unique name for the component
    :type name: str
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        name: str,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("pkg:index:GitHubActionsRole", name, None, opts)
        self.name = name

        aws_account = aws.get_caller_identity()

        self.role = aws.iam.Role(
            self.name,
            assume_role_policy=json.dumps(
                {
                    "Statement": [
                        {
                            "Action": "sts:AssumeRoleWithWebIdentity",
                            "Condition": {
                                "StringEquals": {
                                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                                },
                                "StringLike": {
                                    "token.actions.githubusercontent.com:sub": "repo:climatepolicyradar/*"
                                },
                            },
                            "Effect": "Allow",
                            "Principal": {
                                "Federated": f"arn:aws:iam::{aws_account.account_id}:oidc-provider/token.actions.githubusercontent.com"
                            },
                        }
                    ],
                    "Version": "2012-10-17",
                }
            ),
            inline_policies=[
                {
                    "name": self.name,
                    "policy": json.dumps(
                        {
                            "Version": "2012-10-17",
                            "Statement": [
                                {
                                    "Action": [
                                        "ecr:GetAuthorizationToken",
                                        "ecr:InitiateLayerUpload",
                                        "ecr:UploadLayerPart",
                                        "ecr:CompleteLayerUpload",
                                        "ecr:PutImage",
                                        "iam:PassRole",
                                        "ecr:DescribeRepositories",
                                        "ecr:CreateRepository",
                                        "ecr:BatchGetImage",
                                        "ecr:BatchCheckLayerAvailability",
                                        "ecr:DescribeImages",
                                        "ecr:GetDownloadUrlForLayer",
                                        "ecr:ListImages",
                                        "iam:ListAccountAliases",
                                        "iam:GetPolicy",
                                        "iam:GetRole",
                                        "acm:DescribeCertificate",
                                    ],
                                    "Effect": "Allow",
                                    "Resource": "*",
                                }
                            ],
                        }
                    ),
                }
            ],
            name=self.name,
            opts=pulumi.ResourceOptions(parent=self, protect=True),
        )

        self.register_outputs(
            {
                "role_arn": self.role.arn,
                "role_name": self.role.name,
            }
        )
