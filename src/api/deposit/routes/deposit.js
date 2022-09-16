'use strict';

/**
 * deposit router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::deposit.deposit');
