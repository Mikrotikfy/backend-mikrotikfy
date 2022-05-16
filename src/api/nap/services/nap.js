'use strict';

/**
 * nap service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::nap.nap');
