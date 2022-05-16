'use strict';

/**
 * mikrotik service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mikrotik.mikrotik');
