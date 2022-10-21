module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  meta_token: env('META_TOKEN', ''),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
