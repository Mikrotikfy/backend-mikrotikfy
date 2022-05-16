'use strict';

/**
 * telegrambot service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::telegrambot.telegrambot');
