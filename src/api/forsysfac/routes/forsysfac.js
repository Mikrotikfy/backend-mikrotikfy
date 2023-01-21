module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/forsysfac',
      handler: 'forsysfac.get'
    },
    {
      method: 'POST',
      path: '/forsysfac',
      handler: 'forsysfac.create'
    },
    {
      method: 'PUT',
      path: '/forsysfac',
      handler: 'forsysfac.update'
    },
    // {
    //   method: 'DELETE',
    //   path: '/forsysfac',
    //   handler: 'forsysfac.exampleAction',
    //   config: {
    //     policies: [],
    //     middlewares: [],
    //   },
    // },
  ],
};
