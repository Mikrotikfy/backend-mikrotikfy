'use strict';

/**
 * A set of functions called "actions" for `activeclients`
 */
const APIARNOP = require("../../../mikrotik/mkConnection").APIARNOP;
module.exports = {
  async getActiveClients(ctx) {
    const id = ctx.query.city
    const cityQuery = await strapi.service('api::city.city').findOne(id, { populate: 'mikrotiks' });
    const cityIpArray = cityQuery.mikrotiks
    const ip = cityIpArray[0].ip.split(":")[0]
    const port = cityIpArray[0].ip.split(":")[1]
    if (cityIpArray.length > 1) {
      const cityActiveClients = []
      for (let i = 0; i < cityIpArray.length; i++) {
        const conn = await APIARNOP(`${ip}:${port}`)
        await conn.connect()
        const result = await conn.write('/ppp/active/print', [
          '=.proplist=name',
        ])
        conn.close()
        cityActiveClients.push(result)
      }
      return cityActiveClients[0].concat(cityActiveClients[1])
    } else {
      const conn = APIARNOP(`${ip}:${port}`)
      await conn.connect()
      const result2 = await conn.write('/ppp/active/print', [
        '=.proplist=name',
      ])
      conn.close()
      return result2
    }
  },
};
