'use strict';

/**
 * mikrotik router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::mikrotik.mikrotik');
