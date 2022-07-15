'use strict';

/**
 *  staticip controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::staticip.staticip');
