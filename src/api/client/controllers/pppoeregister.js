'use strict';

/**
 * A set of functions called "actions" for `admincreate`
 */
module.exports = {
  async createEntry(ctx) {
    const client = ctx.request.query.client
    const type = ctx.request.query.type
    const city = ctx.request.query.city

    const search = await strapi.service('api::service.service').find({ filters: { code: client, city: { name: city } }})
    if (search.results.length > 0) {
      await strapi.service('api::pppoe-event.pppoe-event').create({
        data: {
          type,
          service: search.results[0].id
        }
      })
      return true
    } else {
      const searchdni = await strapi.service('api::service.service').find({ filters: { dni: client, city: { name: city } }})
      if (searchdni.results.length > 0) {
        await strapi.service('api::pppoe-event.pppoe-event').create({
          data: {
            type,
            service: searchdni.results[0].id
          }
        })
        return true
      } else {
        return false
      }
    }
  }
};