'use strict';

/**
 * A set of functions called "actions" for `searchclient`
 */
const { sanitize } = require('@strapi/utils');
module.exports = {


  /* BUSCAR CLIENTE CUSTOM ACTION */
  async searchclient(ctx) {
    const {city, search, clienttype, pagination } = ctx.query;
    if (search) { // SI LA BUSQUEDA NO ES NULA
          const res = await strapi.service('api::client.client').find({
            pagination,
            filters: {
              $and: [
                {
                  city: {
                    name: {
                      $eq: city
                    }
                  },
                },
                {
                  clienttype: {
                    name: {
                      $eq: clienttype
                    }
                  },
                },
                {
                  $or: [
                    {
                      code: {
                        $contains: search
                      }
                    },
                    {
                      neighborhood: {
                        name: search
                      }
                    },
                    {
                      name: {
                        $contains: search
                      }
                    },
                    {
                      address: {
                        $contains: search
                      }
                    },
                    {
                      technology: {
                        name: search
                      }
                    },
                    {
                      plan: {
                        name: search
                      }
                    },
                    {
                      dni: search
                    },
                    {
                      phone: search
                    }
                  ],
                }
              ],  
            },
            populate: ['city', 'plan', 'addresses', 'addresses.neighborhood', 'neighborhood', 'technology', 'clienttype', 'vlan'],
            orderBy: { code: 'asc' }
          })
          const sanitizedEntity = await sanitize.contentAPI.output(res);
          return { data: sanitizedEntity };
    } else {
      return [{ init: 'initial request' }]
    }
  }
};
