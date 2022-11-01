module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bfabe71a0d186651826395c050b9df58'),
  },
  apiToken: {
    salt: env('ADMIN_JWT_SECRET')
  }
});
