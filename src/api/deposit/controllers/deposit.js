'use strict';

/**
 *  deposit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::deposit.deposit');
