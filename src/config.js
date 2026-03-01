const config = {
  port: process.env.PORT || 5000,
  baseUrl: process.env.BASE_URI || "http://localhost",
  mongo: {
    url: process.env.MONGO_URL || "mongodb+srv://Prayansh811:Prayansh811@cluster0.u7jcnaf.mongodb.net/sopyshop",
  },
  jwt: {
    jwtSecretKey: process.env.JWT_SECRET_KEY || 'sopyshop_jwt_secret_key',
    tokenHeaderKey: process.env.TOKEN_HEADER_KEY || 'sopyshop_token_header_key',
    localStorageTokenName: process.env.LOCAL_STORAGE_TOKEN_NAME || "local_storage_token_name",
  },
  mailer: {
    userMail: process.env.SMPT_MAIL,
    passwordMail: process.env.SMPT_PASSWORD,
    serviceMail: process.env.SMPT_SERVICE,
  },

  aws: {
    awsBucketName: process.env.AWS_BUCKET_NAME,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsReasion: process.env.AWS_REASION,
  },
  stripe: {
    stripeKey: process.env.STRIPE_API_KEY,
    stripeSecret: process.env.STRIPE_SECRET_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};

module.exports = { config };
