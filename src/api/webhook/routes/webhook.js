module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/webhook',
      handler: 'webhook.subscribe',
    },
  ],
};
