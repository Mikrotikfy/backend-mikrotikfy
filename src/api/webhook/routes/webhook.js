module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/webhook',
      handler: 'webhook.subscribe',
    },
    {
      method: 'POST',
      path: '/webhook',
      handler: 'webhook.notification',
    },
  ],
};
