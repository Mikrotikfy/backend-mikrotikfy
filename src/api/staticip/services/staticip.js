'use strict';

/**
 * staticip service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::staticip.staticip');
