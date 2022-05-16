'use strict';

/**
 * telegrambot router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::telegrambot.telegrambot');
