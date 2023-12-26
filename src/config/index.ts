import 'dotenv/config'
export const dev = {
  app: {
    port: process.env.SERVER_PORT,
    jwtUserActivationKey: String(process.env.JWT_USER_ACTIVATION_KEY),
    jwtAccessKey: String(process.env.JWT_ACCESS_KEY),
    smtpUserName: String(process.env.SMTP_USERNAME),
    smtpPassword: String(process.env.SMTP_PASSWORD),
    jwtResetKey: String(process.env.JWT_RESET_KEY),
    braintreeMerchantId: String(process.env.BRAINTREE_MERCHANT_ID),
    braintreePublicKey: String(process.env.BRAINTREE_PUBLIC_KEY),
    braintreePrivateKey: String(process.env.BRAINTREE_PRIVATE_KEY),
  },
  db: {
    url: String(process.env.MONGO_URL),
  },
  cloud: {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryAPISecretKey: process.env.CLOUDINARY_API_SECRET_KEY,
  },
}
