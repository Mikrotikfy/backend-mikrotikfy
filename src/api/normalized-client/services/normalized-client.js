'use strict';

/**
 * normalized-client service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::normalized-client.normalized-client');
