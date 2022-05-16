'use strict';

/**
 * A set of functions called "actions" for `editclientplan`
 */
const { mkSetClientPlanInformation } = require('../../../mikrotik/mkSetClientPlanInformation')
module.exports = {
  async editclientplan(ctx) {
    const {id, plan} = ctx.request.body.data
    const searchPlan = await strapi.service('api::plan.plan').findOne(plan)
    const newClientPlan = searchPlan.mikrotik_name
    const clientObj = await strapi.service('api::client.client').findOne(id, {populate: ['city', 'city.mikrotiks']})
    const removeActive = true
    const successfulMikrotikResponses = []
    await strapi.service('api::client.client').update(id, { data: { plan }})
    // await strapi.services.history.create(clientObj);
    if (clientObj.city.mikrotiks.length > 1) {
      //for loop
      for (let i = 0; i < clientObj.city.mikrotiks.length; i++) {
        const mikrotikHost = clientObj.city.mikrotiks[i].ip
        const res = await mkSetClientPlanInformation(mikrotikHost, { newClientPlan, dni: clientObj.dni, code: clientObj.code, model: clientObj.newModel, removeActive })
        successfulMikrotikResponses.push(res)
      }
      //INPROVE: detect if the array elements are true or false
      if (successfulMikrotikResponses.length === clientObj.city.mikrotiks.length) {
        return true
      } else {
        return false
      }
    } else {
      //normal req
      const mikrotikHost = clientObj.city.mikrotiks[0].ip
      const res = await mkSetClientPlanInformation(mikrotikHost, { newClientPlan, dni: clientObj.dni, code: clientObj.code, model: clientObj.newModel, removeActive })
      if (res) {
        return true
      } else {
        return false
      }
    }
  },
};
