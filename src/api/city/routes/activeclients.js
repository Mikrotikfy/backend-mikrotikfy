module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/activeclients',
      handler: 'activeclients.getActiveClients',
    }
  ]
}
