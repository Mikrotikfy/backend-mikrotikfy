'use strict';

/**
 * staticip router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::staticip.staticip');
