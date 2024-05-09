# Project Description

CDK for a little computer vision project that generates labels for images in an S3 bucket for now. Plans to expand further to include more computer vision tasks.

The actual lambda function can be found in another repo within the account called `ImageLabelGeneratorLambda`. https://github.com/sushmullur/ImageLabelGeneratorLambda

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
