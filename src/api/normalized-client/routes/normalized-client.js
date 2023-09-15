'use strict';

/**
 * normalized-client router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::normalized-client.normalized-client');
