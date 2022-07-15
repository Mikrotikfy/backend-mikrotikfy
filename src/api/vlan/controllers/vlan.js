'use strict';

/**
 *  vlan controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vlan.vlan');
