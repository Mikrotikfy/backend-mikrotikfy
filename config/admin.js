module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bfabe71a0d186651826395c050b9df58'),
  },
  apiToken: {
    salt: '322a07aa2e990496c612d15cfe0be74e'
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
