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
      strapi.log.info('Beginning extra info for services migration...');
      const servicesObject = {};
      createServiceObject = (row) => {
        const serviceId = row.id;
        if (!servicesObject[serviceId]) {
          servicesObject[serviceId] = {
            id: row.id,
            dni: row.dni,
            client_name: row.client_name,
            phone: row.phone
          };
        }
        strapi.log.info(`Creando objeto para ID: ${serviceId}...`);
      }

      await knex('services')
      .select(
        'services.id',
        'normalized_clients.name as client_name',
        'normalized_clients.dni as dni',
        'normalized_clients.phone as phone',
      )
      .leftJoin('services_normalized_client_links', 'services.id', '=', 'services_normalized_client_links.service_id')
      .leftJoin('normalized_clients', 'services_normalized_client_links.normalized_client_id', '=', 'normalized_clients.id')
      .stream()
      .on('data', createServiceObject)
      .on('end', async () => {
        strapi.log.info('Updating services...');
        for (const service of Object.values(servicesObject)) {
          if (service.client_name === null) { 
            strapi.log.info(`Skiping service ${service.id}...`);
            continue
          }
          strapi.log.info(`Updating service ${service.id}...`);
          await knex2('services')
            .where({ id: service.id })
            .update({
              dni: service.dni,
              phone: service.phone,
              client_name: service.client_name
            })
        }
        strapi.log.info('Hierarchy migration complete.');
      })
    } catch (error) {
      strapi.log.error(error);
    }
  },
};