'use strict';

/**
 * neighborhood service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::neighborhood.neighborhood');
