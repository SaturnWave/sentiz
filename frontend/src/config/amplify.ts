// AWS Amplify configuration
export const amplifyConfig = {
    Auth: {
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      mandatorySignIn: true,
      authenticationFlowType: 'USER_SRP_AUTH',
    },
    API: {
      endpoints: [
        {
          name: 'sentimentApi',
          endpoint: process.env.REACT_APP_API_ENDPOINT || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/api',
          region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
        },
      ],
    },
    Storage: {
      AWSS3: {
        bucket: process.env.REACT_APP_S3_BUCKET,
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      },
    },
  };