'use strict';
const fetch = require('node-fetch');
/**
 * A set of functions called "actions" for `webhook`
 */
module.exports = {
  async subscribe(ctx) {
    const TOKEN = process.env.TOKEN

    const data = ctx.query
    const mode = data['hub.mode']
    const token = data['hub.verify_token']
    const challenge = data['hub.challenge']

    if (mode && token) {
      if (mode === 'subscribe' && token === TOKEN) {
        console.log('WEBHOOK_VERIFIED')
        return challenge
      } else {
        return 403
      }
    }
  },
  async notification (ctx) {
    const TOKEN = process.env.TOKEN

    const data = ctx.request.body
    strapi.log.debug(JSON.stringify(data))
    if (data.object) {
      if (
        data.entry &&
        data.entry[0].changes &&
        data.entry[0].changes[0] &&
        data.entry[0].changes[0].value.messages &&
        data.entry[0].changes[0].value.messages[0]
      ) {
        if (data.entry[0].changes[0].value.messages[0].type === 'text') {
          const res = await strapi.service('api::whatsapp.whatsapp').create({
            data: {
              phone: data.entry[0].changes[0].value.messages[0].from,
              payload: data
            }
          })
          strapi.log.debug(`Service says: ${JSON.stringify(res)}`)
          const phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id
          const from = data.entry[0].changes[0].value.messages[0].from
          const msg_body = data.entry[0].changes[0].value.messages[0].text.body
          fetch(`https://graph.facebook.com/v15.0/${phone_number_id}/messages?access_token=${TOKEN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                messaging_product: 'whatsapp',
                to: from,
                text: {
                  body: `Akc: ${msg_body}`
                }
              }
            })
          })
          return 200
        }
      } else {
        return 403
      }
    } else {
      return 403
    }
  }
};
