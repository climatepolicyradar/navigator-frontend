from typing import Dict, Optional

import pulumi
import pulumi_aws as aws

from resources.util import tag_name


class FrontendWebAcl(pulumi.ComponentResource):
    """
    A WAFv2 WebACL for attaching to CloudFront distributions.

    Creates its own us-east-1 provider internally because CLOUDFRONT-scoped
    WebACLs must live in us-east-1, regardless of where the rest of the stack
    is deployed. Pattern mirrors `resources/dns.py` for CloudFront ACM certs.

    Exposes `.web_acl` — pass `.web_acl.arn` as `web_acl_id` to
    `aws.cloudfront.Distribution` (CloudFront takes the ARN, not the id).
    """

    def __init__(
        self,
        name: str,
        tags: Optional[Dict[str, str]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("cpr:waf:FrontendWebAcl", name, None, opts)

        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": tag_name(),
        }
        self.tags = default_tags | (tags or {})

        self._useast1 = aws.Provider(
            f"{name}-useast1",
            region="us-east-1",
            opts=pulumi.ResourceOptions(parent=self),
        )

        count_chrome_125 = aws.wafv2.WebAclRuleArgs(
            name="CountChrome125UserAgent",
            priority=0,
            action=aws.wafv2.WebAclRuleActionArgs(
                count=aws.wafv2.WebAclRuleActionCountArgs(),
            ),
            statement=aws.wafv2.WebAclRuleStatementArgs(
                byte_match_statement=aws.wafv2.WebAclRuleStatementByteMatchStatementArgs(
                    field_to_match=aws.wafv2.WebAclRuleStatementByteMatchStatementFieldToMatchArgs(
                        single_header=aws.wafv2.WebAclRuleStatementByteMatchStatementFieldToMatchSingleHeaderArgs(
                            name="user-agent",
                        ),
                    ),
                    positional_constraint="CONTAINS",
                    search_string="Chrome/125.0.0.0",
                    text_transformations=[
                        aws.wafv2.WebAclRuleStatementByteMatchStatementTextTransformationArgs(
                            priority=0,
                            type="NONE",
                        ),
                    ],
                ),
            ),
            visibility_config=aws.wafv2.WebAclRuleVisibilityConfigArgs(
                cloudwatch_metrics_enabled=True,
                metric_name="CountChrome125UserAgent",
                sampled_requests_enabled=True,
            ),
        )

        self.web_acl = aws.wafv2.WebAcl(
            name,
            name=name,
            description=f"Frontend WAF for {name}",
            scope="CLOUDFRONT",
            default_action=aws.wafv2.WebAclDefaultActionArgs(
                allow=aws.wafv2.WebAclDefaultActionAllowArgs(),
            ),
            rules=[count_chrome_125],
            visibility_config=aws.wafv2.WebAclVisibilityConfigArgs(
                cloudwatch_metrics_enabled=True,
                metric_name=f"{name}-web-acl",
                sampled_requests_enabled=True,
            ),
            tags=self.tags,
            opts=pulumi.ResourceOptions(provider=self._useast1, parent=self),
        )

        self.register_outputs(
            {
                "web_acl_arn": self.web_acl.arn,
                "web_acl_id": self.web_acl.id,
            }
        )
