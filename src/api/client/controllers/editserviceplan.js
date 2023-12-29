'use strict';

/**
 * A set of functions called "actions" for `editserviceplan`
 */
const { mkSetClientPlanInformation } = require('../../../mikrotik/mkSetClientPlanInformation')
module.exports = {
  async editserviceplan(ctx) {
    const {id, plan, kick} = ctx.request.body.data
    const searchPlan = await strapi.service('api::plan.plan').findOne(plan)
    const newClientPlan = searchPlan.mikrotik_name
    const clientObj = await strapi.service('api::service.service').findOne(id, {populate: ['city', 'city.mikrotiks', 'normalized_client']})
    const removeActive = kick
    const successfulMikrotikResponses = []
    if (clientObj.city.mikrotiks.length > 1) {
      for (let i = 0; i < clientObj.city.mikrotiks.length; i++) {
        const mikrotikHost = clientObj.city.mikrotiks[i].ip
        const res = await mkSetClientPlanInformation(mikrotikHost, { newClientPlan, dni: clientObj.normalized_client.dni, code: clientObj.code, model: clientObj.newModel, removeActive })
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
      const res = await mkSetClientPlanInformation(mikrotikHost, { newClientPlan, dni: clientObj.normalized_client.dni, code: clientObj.code, model: clientObj.newModel, removeActive })
      if (res) {
        return true
      } else {
        return false
      }
    }
  },
};
