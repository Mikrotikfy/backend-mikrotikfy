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
      await sendWhatsApp(id, result2.length)
      await updateCityActive(id, cityActiveClients[0].concat(cityActiveClients[1]).length)
      return {
        activeclients: cityActiveClients[0].concat(cityActiveClients[1]).length
      }
    } else {
      const conn = await APIARNOP(`${ip}:${port}`)
      await conn.connect()
      const result2 = await conn.write('/ppp/active/print', [
        '=.proplist=name',
      ])
      conn.close()
      await sendWhatsApp(id, result2.length)
      await updateCityActive(id, result2.length)
      return {
        activeclients: result2.length
      }
    }
  },
};

function updateCityActive (id, activeClients) {
  return new Promise((resolve, reject) => {
    const cityQuery = strapi.service('api::city.city').update(id, { data: { active: activeClients+'' } });
    resolve(cityQuery)
  })
}

function sendWhatsApp (id, activeClients) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(
      {
        messaging_product: 'whatsapp',
        to: `573125090684`,
        type: 'template',
        template: {
          name: 'sysadmin_active_count',
          language: {
            code: 'es'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: `${activeClients > 0 ? 'ONLINE' : 'OFFLINE' }`
                },
                {
                  type: 'text',
                  text: `${activeClients}`
                }
              ]
            }
          ]
        }
      }
    )
  }
  return new Promise((resolve, reject) => {
    fetch('https://graph.facebook.com/v15.0/100480202798133/messages', options)
      .then(function (response) {
        return resolve(response)
      })
      .catch(function (err) {
        return reject(err)
      })
  })
}