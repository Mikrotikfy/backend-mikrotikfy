'use strict';

/**
 * A set of functions called "actions" for `notification`
 */

module.exports = {
  listOfBills: async (ctx) => {
    const { city, clienttype, month, year } = ctx.request.query
    const fs = require('fs')
    // directory path
    const dir = `./public/fac/${year}/${month}/${city.toLowerCase()}/${clienttype.toLowerCase()}/`

    try {
      const files = fs.readdirSync(dir)
      
      return {
        status: 200,
        data: files
      }
    } catch (err) {
      return {
        status: 404,
        data: null
      }
    }
  }
};
