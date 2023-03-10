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
    if (data.object) {
      if (
        data.entry &&
        data.entry[0].changes &&
        data.entry[0].changes[0] &&
        data.entry[0].changes[0].value.messages &&
        data.entry[0].changes[0].value.messages[0]
      ) {
        const messages = await strapi.service('api::whatsapp.whatsapp').find({
          filters: {
            phone: data.entry[0].changes[0].value.messages[0].from
          }
        })
        if (messages.results.length < 1) {
          await strapi.service('api::whatsappcontact.whatsappcontact').create({
            data: {
              phone: data.entry[0].changes[0].value.messages[0].from,
              name: sanitizeString(data.entry[0].changes[0].value.contacts[0].profile.name),
            }
          })
        }
        
        const contact = await strapi.service('api::whatsappcontact.whatsappcontact').find({
          filters: {
            phone: data.entry[0].changes[0].value.messages[0].from
          }
        })
        const newWhatsappMessage = await strapi.service('api::whatsapp.whatsapp').create({
          data: {
            phone: data.entry[0].changes[0].value.messages[0].from,
            payload: data
          }
        })
        await strapi.service('api::whatsappcontact.whatsappcontact').update(contact.results[0].id, {
          data: {
            'lastwhatsapp': newWhatsappMessage.id,
            'lastmessage': new Date(),
            'pendingmessages': contact.results[0].pendingmessages ? contact.results[0].pendingmessages + 1 : 1,
            'read': false
          }
        })
        await strapi.db.query('api::menu.menu').update({
          where: { name: 'Escritorio' },
          data: {
            alert: true
          }
        })
        const phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id
        const from = data.entry[0].changes[0].value.messages[0].from
        fetch(`https://graph.facebook.com/v15.0/${phone_number_id}/messages?access_token=${TOKEN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              messaging_product: 'whatsapp',
              to: from,
              status: 'delivered',
            }
          })
        })
        return 200
      } else {
        return 403
      }
    } else {
      return 403
    }
  }
};
function sanitizeString(str) {
  const res1 = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const res2 = res1.replace(/[^a-z0-9áéíóúñü \.\n@ñ,_-]/gim, "");
  const res3 = res2.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  const res4 = res3.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
  return res4.trim();
}