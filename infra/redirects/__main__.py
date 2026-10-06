"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws
import json
from pathlib import Path


stack = pulumi.get_stack()
[theme, environment] = stack.split("-")
us_east_1_provider = aws.Provider("east", region="us-east-1")
config = pulumi.Config()
lambda_js = config.require("lambda_js")
kv_list_json = config.require("kv_list_json")

redirects_cloudfront_key_value_store = aws.cloudfront.KeyValueStore(
    f"{theme}-redirects-kvs",
    name=f"{theme}-redirects-kvs",
    comment=f"Redirects for {theme}",
)

infra_dir = Path(__file__).parent
with open(infra_dir / "lambdas" / kv_list_json) as f:
    redirects: list[dict[str, str]] = json.load(f)["redirects"]

# Get the code as a string for the CloudFront Function
with open(infra_dir / "lambdas" / lambda_js) as f:
    lambda_code = f.read()

for redirect in redirects:
    aws.cloudfront.KeyvaluestoreKey(
        f"{theme}-redirects-kvs-key-{redirect['Key']}",
        key_value_store_arn=redirects_cloudfront_key_value_store.arn,
        key=redirect["Key"],
        value=redirect["Value"],
    )

redirects_lambda = aws.cloudfront.Function(
    f"{theme}-redirects",
    name=f"{theme}-redirects",
    runtime="cloudfront-js-2.0",
    comment="climatecasechart.com redirects function",
    key_value_store_associations=[
        redirects_cloudfront_key_value_store.arn,
    ],
    code=lambda_code,
    opts=pulumi.ResourceOptions(
        provider=us_east_1_provider,
        depends_on=[redirects_cloudfront_key_value_store],
    ),
    publish=True,  # Make the function available to CloudFront.
)

pulumi.export("redirects-lambda-arn", redirects_cloudfront_key_value_store.arn)