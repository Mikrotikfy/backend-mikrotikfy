'use strict';

/**
 * A set of functions called "actions" for `activeclients`
 */
const RouterOSAPI = require('node-routeros').RouterOSAPI
module.exports = {
  async getActiveClients(ctx) {
    const id = ctx.query.city
    const cityQuery = await strapi.service('api::city.city').findOne(id, { populate: 'mikrotiks' });
    const cityIpArray = cityQuery.mikrotiks
    if (cityIpArray.length > 1) {
      const cityActiveClients = []
      for (let i = 0; i < cityIpArray.length; i++) {
        const conn = new RouterOSAPI({
          host: cityIpArray[i].ip,
          user: 'API_ARNOP',
          password: process.env.MIKROTIK_API_SECRET,
          port: 8087
        })
        await conn.connect()
        const result = await conn.write('/ppp/active/print', [
          '=.proplist=name',
        ])
        conn.close()
        cityActiveClients.push(result)
      }
      return cityActiveClients[0].concat(cityActiveClients[1])
    } else {
      const conn = new RouterOSAPI({
        host: cityIpArray[0].ip,
        user: 'API_ARNOP',
        password: process.env.MIKROTIK_API_SECRET,
        port: 8087
      })
      await conn.connect()
      const result2 = await conn.write('/ppp/active/print', [
        '=.proplist=name',
      ])
      conn.close()
      return result2
    }

  },
};
