module.exports = {
  secret: process.env.JWT_SECRET || 'votre_secret_jwt',
  otpExpires: 10 * 60 * 1000, // 10 minutes
  jwtExpires: '30d'
};