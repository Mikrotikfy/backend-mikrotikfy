module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'strapi4'),
      user: process.env.SQL_USER,
      password: process.env.SQL_SECRET,
      ssl: env.bool('DATABASE_SSL', false),
    },
    // debug: true
  },
});
