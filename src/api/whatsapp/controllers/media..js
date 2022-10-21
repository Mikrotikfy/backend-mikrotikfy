'use strict';

/**
 * A set of functions called "actions" for `admincreate`
 */
const fetch = require('node-fetch');
module.exports = {
  async getMedia(ctx) {
    const mediaid = ctx.request.query.mediaid

    const res = await fetch(`https://graph.facebook.com/v14.0/${mediaid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.META_TOKEN}`
          }
        })
          .then(response => response.json())
          .then(async (data) => {
            const binaryImg = await fetch(`${data.url}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.META_TOKEN}`
              }
            })
              .then(async (imageData) => {
                const binary = Buffer.from(await imageData.arrayBuffer())
                return binary
              })
            return binaryImg
          })
    console.log(res)
    return res
  }
};
