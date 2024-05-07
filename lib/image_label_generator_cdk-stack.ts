import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


export class ImageLabelGeneratorStack extends Stack {
  constructor(scope: Construct, id: string, prefix: String, props?: StackProps) {
    super(scope, id, props);

    // Bucket to store images
    const bucket = new Bucket(this, `${prefix}-ImageBucket`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    // Rekognition service role
    const rekognitionRole = new Role(this, `${prefix}-RekognitionServiceRole`, {
      assumedBy: new ServicePrincipal('rekognition.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonRekognitionFullAccess')]
    });

    bucket.grantRead(rekognitionRole);

    // Output the bucket name
    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName
    });
  }
}
