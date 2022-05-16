'use strict';

/**
 * passwordchange service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::passwordchange.passwordchange');
