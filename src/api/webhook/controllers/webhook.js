'use strict';

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
  }
};