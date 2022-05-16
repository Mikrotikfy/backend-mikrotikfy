'use strict';

/**
 *  mikrotik controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mikrotik.mikrotik');
