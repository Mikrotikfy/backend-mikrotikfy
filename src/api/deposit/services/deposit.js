'use strict';

/**
 * deposit service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::deposit.deposit');
