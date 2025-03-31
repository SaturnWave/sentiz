// AWS Amplify configuration
export const amplifyConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_abcdefghi',
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'abcdefghijklmnopqrstuvwxyz',
    mandatorySignIn: true,
    authenticationFlowType: 'USER_SRP_AUTH',
  },
  API: {
    endpoints: [
      {
        name: 'sentimentApi',
        endpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.sentimentscope.example.com/api',
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_BUCKET || 'social-media-sentiment-analyzer-bucket',
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    },
  },
};