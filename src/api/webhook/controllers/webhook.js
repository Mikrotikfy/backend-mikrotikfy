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
  notification (ctx) {
    const TOKEN = process.env.TOKEN

    const data = ctx.request.body
    strapi.log.debug(JSON.stringify(data))
    if (
      data.value &&
      data.value.messages &&
      data.value.messages[0]
    ) {
      const phone_number_id = data.value.metadata.phone_number_id
      const from = data.value.messages[0].from
      const msg_body = data.value.messages[0].text.body
      console.log(phone_number_id, from, msg_body)
      fetch(`https://graph.facebook.com/v14.0/${phone_number_id}/messages?access_token=${TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: from,
          text: {
            body: `Akc: ${msg_body}`
          }
        })
      })
      return 200
    } else {
      return 403
    }
  }
};