import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Role, ServicePrincipal, ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

const PATH_TO_LAMBDA = '../ImageLabelGeneratorLambda/build/ImageProcessor.zip';

export class ImageLabelGeneratorStack extends Stack {
  constructor(scope: Construct, id: string, prefix: string, props?: StackProps) {
    super(scope, id, props);

    // Bucket to store images
    const inputBucket = new Bucket(this, `${prefix}-InputBucket`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    // Bucket to store labeled images
    const outputBucket = new Bucket(this, `${prefix}-OutputBucket`);

    // Rekognition service role
    const rekognitionRole = new Role(this, `${prefix}-RekognitionServiceRole`, {
      assumedBy: new ServicePrincipal('rekognition.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonRekognitionFullAccess')]
    });

    // Lambda function to process images
    const imageProcessor = new Function(this, `${prefix}-ImageProcessor`, {
      runtime: Runtime.PYTHON_3_8,
      code: Code.fromAsset(PATH_TO_LAMBDA),
      handler: 'index.lambda_handler',
      environment: {
        OUTPUT_BUCKET: outputBucket.bucketName
      }
    });

    // Grant permissions to Lambda function
    inputBucket.grantRead(imageProcessor);
    outputBucket.grantWrite(imageProcessor);
    imageProcessor.addToRolePolicy(new PolicyStatement({
      actions: ['rekognition:DetectLabels'],
      resources: ['*']
    }));

    // S3 event source for Lambda function
    const fileTypes = ['.jpg', '.jpeg', '.png'];
    fileTypes.forEach(suffix => {
      imageProcessor.addEventSource(new S3EventSource(inputBucket, {
        events: [EventType.OBJECT_CREATED_PUT],
        filters: [{ suffix: suffix }]
      }));
    });

    // Output bucket name
    new CfnOutput(this, 'OutputBucketName', {
      value: outputBucket.bucketName
    });

    // Output the input bucket name
    new CfnOutput(this, 'InputBucketName', {
      value: inputBucket.bucketName
    });
  }
}
