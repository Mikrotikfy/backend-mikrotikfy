'use strict';

/**
 *  telegrambot controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::telegrambot.telegrambot');
