import 'dotenv/config'
export const dev = {
  app: {
    port: process.env.SERVER_PORT,
    jwtUserActivationKey: String(process.env.JWT_USER_ACTIVATION_KEY),
    jwtAccessKey: String(process.env.JWT_ACCESS_KEY),
    smtpUserName: String(process.env.SMTP_USERNAME),
    smtpPassword: String(process.env.SMTP_PASSWORD),
    jwtResetKey: String(process.env.JWT_RESET_KEY),
  },
  db: {
    url: String(process.env.MONGO_URL),
  },
}
