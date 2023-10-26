module.exports = {
  async up(knex) {
    var knex2 = require('knex')({
      client: 'mysql',
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'strapi4',
      },
    })
    try {
      strapi.log.info('Beginning address for services migration...');
      const servicesObject = {};
      createServiceObject = (row) => {
        console.log(row)
        const serviceId = row.id;
        if (!servicesObject[serviceId]) {
          servicesObject[serviceId] = {
            id: row.id,
            dni: row.dni,
            name: row.name,
            code: row.code,
            active: row.active,
            indebt: row.indebt,
            service_addresses: []
          };
        }
        if (row.service_address_address) {
          servicesObject[serviceId].service_addresses.push({
            id: row.address_id,
            address: row.service_address_address,
            neighborhood: row.neighborhood_name,
            created_at: row.created_at,
          });
        }        
        // Order desc addresses
        servicesObject[serviceId].service_addresses.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        // remove all addresses but the first one
        servicesObject[serviceId].service_addresses = servicesObject[serviceId].service_addresses.slice(0, 1);
        strapi.log.info(`Creando objeto para ID: ${serviceId}...`);
      }

      await knex('services')
      .select(
        'services.id',
        'service_addresses.address as service_address_address',
        'neighborhoods.name as neighborhood_name',
      )
      .leftJoin('service_addresses_service_links', 'services.id', '=', 'service_addresses_service_links.service_id')
      .leftJoin('service_addresses', 'service_addresses_service_links.service_address_id', '=', 'service_addresses.id')
      .leftJoin('service_addresses_neighborhood_links', 'service_addresses.id', '=', 'service_addresses_neighborhood_links.service_address_id')
      .leftJoin('neighborhoods', 'service_addresses_neighborhood_links.neighborhood_id', '=', 'neighborhoods.id')
      .stream()
      .on('data', createServiceObject)
      .on('end', async () => {
        // loop through the clientsOServiceObject and update the services on the database
        strapi.log.info('Updating services...');
        let totalDatabaseHits = 0;
        let totalClients = 0;
        let relationalClients = 0;
        let fallbackClients = 0;
        for (const service of Object.values(servicesObject)) {
          if (service.service_addresses.length === 0) { 
            strapi.log.info(`Skiping service ${service.id}...`);
            continue
          }
          strapi.log.info(`Updating service ${service.id}...`);
          await knex2('services')
            .where({ id: service.id })
            .update({
              address: service.service_addresses[0].address,
              neighborhood: service.service_addresses[0].neighborhood
            })
        }
        strapi.log.info('Hierarchy migration complete.');
        strapi.log.info(`Total database hits: ${totalDatabaseHits}`);
        strapi.log.info(`Total clients: ${totalClients}`);
        strapi.log.info(`Relational clients: ${relationalClients}`);
        strapi.log.info(`Fallback clients: ${fallbackClients}`);
        console.log('Streaming completado. Total de hits de base de datos: ', totalDatabaseHits);  
      })
    } catch (error) {
      strapi.log.error(error);
    }
  },
};