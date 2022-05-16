'use strict';

/**
 * appcfg service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::appcfg.appcfg');
