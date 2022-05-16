'use strict';

/**
 * A set of functions called "actions" for `refreshclientdata`
 */
const RouterOSAPI = require('node-routeros').RouterOSAPI
module.exports = {
  async refreshclientdata (ctx) {
    const cityQuery = await strapi.service('api::city.city').findOne(ctx.query.city,{ populate: ['mikrotiks'] });
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
      var active = cityActiveClients[0].concat(cityActiveClients[1])
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
      var active = result2
    }
    const count = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        }
      }
    });
    const mb3 = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: '3 MEGAS CORTESIAS'
          }
        }
      }
    })
    const mb4 = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: '4 MEGAS'
          }
        }
      }
    })
    const mb6 = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: '6 MEGAS'
          }
        }
      }
    })
    const mb8 = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: '8 MEGAS'
          }
        }
      }
    })
    const mb10 = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: '10 MEGAS'
          }
        }
      }
    })
    const mb100 = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: '100 MEGAS'
          }
        }
      }
    })
    const countActive = mb3.length + mb4.length + mb6.length + mb8.length + mb10.length + mb100.length
    const countDisable = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: 'EN MORA'
          }
        }
      }
    })
    const countRetired = await strapi.service('api::client.client').find({
      filters: {
        city: {
          name: {
            $eq: cityQuery.name
          }
        },
        plan: {
          name: {
            $eq: 'RETIRADO'
          }
        }
      }
    })
    const activeRes = await strapi.service('api::city.city').update(cityQuery.id, { data: {'active': String(active.length) }})
    const countRes = await strapi.service('api::city.city').update(cityQuery.id, { data: {'count': String(count.length) }})
    const countActiveRes = await strapi.service('api::city.city').update(cityQuery.id, { data: {'countActive': String(countActive) }})
    const countDisableRes = await strapi.service('api::city.city').update(cityQuery.id, { data: {'countDisable': String(countDisable.length) }})
    const countRetiredRes = await strapi.service('api::city.city').update(cityQuery.id, { data: {'countRetired': String(countRetired.length) }})
    return activeRes + countRes + countActiveRes + countDisableRes + countRetiredRes
  }
};
