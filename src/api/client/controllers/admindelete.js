'use strict';

/**
 * A set of functions called "actions" for `admincreate`
 */
const { mkDeleteClient } = require('../../../mikrotik/mkDeleteClient');
module.exports = {
  async adminDelete(ctx) {
    const client = ctx.request.body.data
    await strapi.service('api::client.client').update(client.id, { data: { 'active': false }});
    const searchCity = await strapi.service('api::city.city').findOne(client.city.id, {populate: 'mikrotiks'})
    if (searchCity.mikrotiks.length > 1) {
      const successfulMikrotikResponses = []
      for (let i = 0; i < searchCity.mikrotiks.length; i++) {
        const mikrotikHost = searchCity.mikrotiks[i].ip
        const res = await mkDeleteClient(mikrotikHost, client)
        successfulMikrotikResponses.push(res)
      }
    } else {
      const mikrotikHost = searchCity.mikrotiks[0].ip
      await mkDeleteClient(mikrotikHost, client)
      return true
    }
    return true
  }
};