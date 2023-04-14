'use strict';

/**
 * invoice-movement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::invoice-movement.invoice-movement');
