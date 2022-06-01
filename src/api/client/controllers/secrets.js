'use strict';

/**
 * A set of functions called "actions" for `secrets`
 */
const { mkGetSecrets } = require('../../../mikrotik/mkGetSecrets')
module.exports = {
  async getSecrets(ctx) {
    try {
      return await mkGetSecrets(ctx.query.mikrotikHost)
    } catch (error) {
      return error;
    }
  }
};
