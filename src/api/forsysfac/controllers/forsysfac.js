'use strict';

/**
 * A set of functions called "actions" for `forsysfac`
 */

module.exports = {
  get: async (ctx, next) => {
    try {
      ctx.body = 'get';
      console.log(ctx.headers)
      console.log(ctx.body)
    } catch (err) {
      ctx.body = err;
    }
  },
  create: async (ctx, next) => {
    try {
      if (!ctx.headers.authorization) {
        return {
          errors: {
            message: 'Error de autenticación',
            code: 401,
          },
          response: null
        }
      }

      if (!ctx.request.body.type && (ctx.request.body.type !== 'TV' || ctx.request.body.type !== 'INTERNET')) {
        return {
          errors: {
            message: 'El tipo de cliente esta errado',
            code: 400,
          },
          response: null
        }
      }

      if (!ctx.request.body.city || typeof ctx.request.body.city !== 'string') {
        return {
          errors: {
            message: 'La ciudad no esta difinida o el tipo de dato es incorrecto. Debe ser una string',
            code: 400,
          },
          response: null
        }
      }

      if (!ctx.request.body.offer || typeof ctx.request.body.offer !== 'number') {
        return {
          errors: {
            message: 'La tarifa no esta definida o el tipo de dato es incorrecto. Debe ser un entero',
            code: 400,
          },
          response: null
        }
      }
      const type = ctx.request.body.type === 'TV' ? 2 : 1;
      const city = ctx.request.body.city === 'MARIQUITA' ? 1 : 2;
      
      const neighborhood = await strapi.entityService.findMany('api::neighborhood.neighborhood', {
        filters: {
          name: ctx.request.body.neighborhood
        }
      })
      if (!neighborhood) {
        return {
          errors: {
            message: 'El barrio no existe',
            code: 400,
          },
          response: null
        }
      }
      const data = {
        clienttype: type,
        city: city,
        neighborhood: neighborhood[0].id,
        technology: 2,
        active: true,
        code: ctx.request.body.code,
        dni: ctx.request.body.dni,
        name: ctx.request.body.name,
        address: ctx.request.body.address,
        phone: ctx.request.body.phone,
        email: ctx.request.body.email,
        publishedAt: new Date(),
      }
      const entry = await strapi.entityService.create('api::client.client', {
        data
      });
      return {
        errors: null,
        response: {
          message: 'Cliente creado correctamente',
          code: 200,
          data: entry
        }
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  update: async (ctx, next) => {
    try {
      ctx.body = 'update';
    } catch (err) {
      ctx.body = err;
    }
  }
};
