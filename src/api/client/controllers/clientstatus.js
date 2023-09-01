'use strict';

/**
 * A set of functions called "actions" for `clientstatus`
 */
const { mkClientStatus} = require('../../../mikrotik/functions')
module.exports = {
  async getClientStatus(ctx) {
    const searchClient = await strapi.service('api::client.client').findOne(ctx.query.id, { populate: 'city' })
    const searchCity = await strapi.service('api::city.city').findOne(searchClient.city.id, { populate: 'mikrotiks' })
    const mikrotiks = searchCity.mikrotiks
    const ipList = await mikrotiks.map((mikrotik) => {
      return mikrotik.ip
    })
    const response = await Promise.all(
      ipList.map(async (ip) => {
        return await mkClientStatus(ip, searchClient.code, searchClient.dni, searchClient.newModel)
      })
    )
    if (response) {
      const mkResponse = response.filter(mikrotik => mikrotik.exists === true)
      const onlineRes = mkResponse.filter(mikrotik => mikrotik.online === true)
      if (onlineRes.length > 0) {
        return { data: onlineRes[0], error: null }
      } else {
        if (ipList.length > 1 ) {
          const goodReponse = mkResponse.filter(client => client.offlineTime !== '1970-01-01 00:00:00')
          console.log(goodReponse)
          let mostRecentDate = new Date(Math.max.apply(null, goodReponse.map( e => {
            return new Date(e.offlineTime);
          })));
          let mostRecentClient = goodReponse.filter( e => { 
              const d = new Date( e.offlineTime ); 
              return d.getTime() == mostRecentDate.getTime();
          })[0];
          return { data: mostRecentClient, error: null }
        } else {
          return { data: response[0], error: null }
        }
      }
    } else {
      return { data: response[0], error: 500 }
    }
  },
};
