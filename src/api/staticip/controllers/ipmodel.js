'use strict';

/**
 * A set of functions called "actions" for `ipmodel`
 */
const {createAddressList} = require('../../../mikrotik/mkIpModel')
module.exports = {
  async ipmodelCreate (ctx) {
    const ipmodel = ctx.request.body.data
    const cityQuery = await strapi.service('api::city.city').findOne(ipmodel.city, { populate: 'mikrotiks' });
    const mikrotiks = cityQuery.mikrotiks
    if (mikrotiks.length > 1) { // Si hay dos mikrotiks o mas
      for(let i = 0; i < mikrotiks.length; i++) {
        const mikrotik = mikrotiks[i]
        createAddressList({ mikrotik, ipmodel })
      }
    } else { // Si solo hay una mikrotik
      const mikrotik = mikrotiks[0]
      createAddressList({ mikrotik, ipmodel })
    }
    return ipmodel
  }
};
