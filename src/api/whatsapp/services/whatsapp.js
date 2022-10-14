'use strict';

/**
 * whatsapp service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::whatsapp.whatsapp');
