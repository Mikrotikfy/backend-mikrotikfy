'use strict';

/**
 * vlan service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vlan.vlan');
