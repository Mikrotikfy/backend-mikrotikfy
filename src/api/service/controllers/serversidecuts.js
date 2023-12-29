'use strict';

/**
 * A set of functions called "actions" for `clientcomment`
 */
const { mkSetClientPlanInformation } = require('../../../mikrotik/mkSetClientPlanInformation')
module.exports = {
  async serversidecuts(ctx) {
    const { city, kick, services: codes, currentBillingPeriod } = ctx.request.body.data

    let searchCity = null
    let processCodesSuccess = []
    let processCodesWithErrors = []
    let newClientPlan = 'Desconectados'

    await strapi.service('api::city.city').find({
      filters: {
        name: city
      }, populate: ['mikrotiks']
    })
    .then((searchResult) => {
      if (searchResult.pagination.total === 0) {
        return {
          status: 'error',
          message: 'No existe la ciudad'
        }
      } else if (searchResult.pagination.total === 1) {
        searchCity = searchResult.results[0]
      }
    })



    for (let i = 0; i < codes.length; i++) {
      await strapi.service('api::service.service').find({
        filters: {
          code: codes[i]
        }
      }).then(async (searchResult) => {
        if (searchResult.pagination.total === 0) {
          processCodesWithErrors.push({ code: codes[i], error: 'No existe el código' })
        } else if (searchResult.pagination.total === 1) {
          const service = searchResult.results[0]

          if (searchCity.mikrotiks.length > 1) {
            for (let i = 0; i < searchCity.mikrotiks.length; i++) {
              const mikrotikHost = searchCity.mikrotiks[i].ip
              const response = await mkSetClientPlanInformation(mikrotikHost, { newClientPlan, dni: service.dni, code: service.code, kick })
    
              if (response.status === 'ok') {
                processCodesSuccess.push({ code: codes[i], success: true })
              } else {
                processCodesWithErrors.push({ code: codes[i], error: response.message })
              }
            }
          } else {
            const mikrotikHost = searchCity.mikrotiks[0].ip
            const response = await mkSetClientPlanInformation(mikrotikHost, { newClientPlan, dni: service.dni, code: service.code, kick })
  
            if (response.status === 'ok') {
              processCodesSuccess.push({ code: codes[i], success: true })
            } else {
              processCodesWithErrors.push({ code: codes[i], error: response.message })
            }
          }
        }
      })
      updateBillingPeriod({
        currentBillingPeriod,
        errors: processCodesWithErrors.length,
        errorList: processCodesWithErrors,
        successes: processCodesSuccess.length,
      })
    }
    return {
      status: 'ok'
    }
  },
};
function createComment (client) {
  const newComment = `${client.code} ${client.technology ? client.technology.name : 'No Def.'} ${client.neighborhood} ${client.address} ${client.client_name} ${client.dni} ${client.phone} ${client.offer?.name} ${client.wifi_ssid} ${client.wifi_password}`
  return newComment;
};

async function updateBillingPeriod (payload) {
  const currentBillingPeriod = payload.currentBillingPeriod
  await strapi.service('api::billingperiod.billingperiod').update(currentBillingPeriod, {
    data: {
      errors: payload.errors,
      errorList: JSON.stringify(payload.errorList),
      successes: payload.successes,
    }
  })
}
