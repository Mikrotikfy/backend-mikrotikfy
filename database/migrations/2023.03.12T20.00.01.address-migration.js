module.exports = {
  async up(knex) {
    try {
      strapi.log.info('Beginning address migration...');

      const subquery = knex('addresses_client_links')
        .select('client_id')
        .whereRaw('addresses_client_links.client_id = clients.id')
        .limit(1)
        .toString();
      const clients = await knex
      .select('clients.id', 'clients.code', 'clients.address', 'neighborhoods.id as neighborhood_id', knex.raw(`EXISTS(${subquery}) AS has_address`))
      .from('clients')
      .leftJoin('clients_neighborhood_links', 'clients.id', '=', 'clients_neighborhood_links.client_id')
      .leftJoin('neighborhoods', 'clients_neighborhood_links.neighborhood_id', '=', 'neighborhoods.id')
      strapi.log.info(`Found ${clients.length} clients to migrate addresses...`);
      strapi.log.info(JSON.stringify(clients[0]))
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].has_address === '0') {
          strapi.log.info(`Migrating address for code ${clients[i].code}...`);
          await knex.from('addresses').insert({
            address: clients[i].address,
            created_at: new Date(),
            published_at: new Date(),
          })
          .catch((error) => {
            strapi.log.error(error);
          })
          const lastInsertedAddress = await knex.from('addresses').orderBy('id', 'desc').first().select('id');
          await knex.from('addresses_client_links').insert({
            address_id: lastInsertedAddress.id,
            client_id: clients[i].id,
            address_order: null
          })
          .catch((error) => {
            strapi.log.error(error);
          })
          await knex.from('addresses_neighborhood_links').insert({
            address_id: lastInsertedAddress.id,
            neighborhood_id: clients[i].neighborhood_id,
            address_order: null
          })
          .catch((error) => {
            strapi.log.error(error);
          })
        }
        else {
          strapi.log.info(`Nothing to do with ${clients[i].code}...`);
        }
      }
      strapi.log.info(`Found ${clients.length} clients to normalize...`);
      return {
        success: true
      }
    } catch (error) {
      strapi.log.error(error);
    }
  },
};