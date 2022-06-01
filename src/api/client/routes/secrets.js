module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/secrets',
      handler: 'secrets.getSecrets',
    }
  ]
}
