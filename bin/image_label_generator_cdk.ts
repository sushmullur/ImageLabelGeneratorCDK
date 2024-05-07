#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { ImageLabelGeneratorStack } from '../lib/image_label_generator_cdk-stack';

const app = new App();
const prefix = process.env.RESOURCE_PREFIX || 'ImageLabelGenerator';
new ImageLabelGeneratorStack(app, `${prefix}-Stack`, prefix, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});