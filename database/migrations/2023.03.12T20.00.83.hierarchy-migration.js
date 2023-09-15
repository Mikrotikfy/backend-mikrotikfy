module.exports = {
  async up(knex) {
    try {
      strapi.log.info('Beginning hierarchy migration...');

      const clients = await knex('clients')
      .select(
        'clients.*',
        'clienttypes.id as clienttype_id',
        'cities.id as city_id',
        'offers.id as offer_id',
        'technologies.id as technology_id',
        'addresses.id as address_id',
        'neighborhoods.id as neighborhood_id',
        'neighborhoods.name as neighborhood_name',
        'n1.id as fallback_neighborhood',
        'addresses.address as relational_address',
        'addresses.created_at'
      )
      .leftJoin('clients_city_links', 'clients.id', 'clients_city_links.client_id')
      .leftJoin('cities', 'clients_city_links.city_id', 'cities.id')

      .leftJoin('devices_clients_links', 'clients.id', 'devices_clients_links.client_id')
      .leftJoin('devices', 'devices_clients_links.device_id', 'devices.id')
      
      .leftJoin('clients_clienttype_links', 'clients.id', 'clients_clienttype_links.client_id')
      .leftJoin('clienttypes', 'clients_clienttype_links.clienttype_id', 'clienttypes.id')
      
      .leftJoin('clients_neighborhood_links', 'clients.id', 'clients_neighborhood_links.client_id')
      .leftJoin('neighborhoods as n1', 'clients_neighborhood_links.neighborhood_id', 'n1.id')
    
      .leftJoin('clients_offer_links', 'clients.id', 'clients_offer_links.client_id')
      .leftJoin('offers', 'clients_offer_links.offer_id', 'offers.id')
      
      .leftJoin('clients_technology_links', 'clients.id', 'clients_technology_links.client_id')
      .leftJoin('technologies', 'clients_technology_links.technology_id', 'technologies.id')
      
      .leftJoin('addresses_client_links', 'clients.id', 'addresses_client_links.client_id')
      .leftJoin('addresses', 'addresses_client_links.address_id', 'addresses.id')

      .leftJoin('addresses_neighborhood_links', 'addresses.id', 'addresses_neighborhood_links.address_id')
      .leftJoin('neighborhoods', 'addresses_neighborhood_links.neighborhood_id', 'neighborhoods.id')
      .limit(1)
      // Organiza los resultados en un objeto
      const totalClients = clients.length;
      var relationalClients = 0
      var fallbackClients = 0
      const clientsObject = {};
      clients.forEach((row) => {
        const clientId = row.id;
        if (!clientsObject[clientId]) {
          clientsObject[clientId] = {
            dni: row.dni,
            name: row.name,
            code: row.code,
            fallback_address: row.address,
            fallback_neighborhood: row.fallback_neighborhood,
            client: clientId,
            clienttype: row.clienttype_id,
            city: row.city_id,
            offer: row.offer_id,
            technology: row.technology_id,
            addresses: [], // Un array para almacenar las direcciones
          };
        }
        if (row.address_id) {
          clientsObject[clientId].addresses.push({
            id: row.address_id,
            address: row.relational_address,
            neighborhood: row.neighborhood_id,
            neighborhood_name: row.neighborhood_name,
            created_at: row.created_at,
          });
        }
        // Order desc addresses
        clientsObject[clientId].addresses.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        // remove all addresses but the first one
        clientsObject[clientId].addresses = clientsObject[clientId].addresses.slice(0, 1);
      });      
      // loop through the clientsObject, create a object with dni as key, containing a subkey named as the current user field named "code", containing the clientObject of the current index. If another entry is found with an existing dni, add another entry on the curren object named with the "code" of the current clientObject info. If dni is equals to zero, object key will be the client id.

      const clientsObjectByDni = {};
      for (const [key, value] of Object.entries(clientsObject)) {
        if (value.dni === '0') {
          if (value.code === 'C' || value.code === 'c') {
            if (!clientsObjectByDni[value.id]) {
              clientsObjectByDni[value.id] = {};
            }
            clientsObjectByDni[value.id][value.id] = value;
          } else {
            if (!clientsObjectByDni[value.code]) {
              clientsObjectByDni[value.code] = {};
            }
            clientsObjectByDni[value.code][value.code] = value;
          }
        }
        else {
          if (!clientsObjectByDni[value.dni]) {
            clientsObjectByDni[value.dni] = {};
          }
          clientsObjectByDni[value.dni][value.code] = value;
        }
      }
      // loop through the clientsObjectByDni, loop through the subkeys, and loop through the addresses array, create the new addresses, store the new address id. link the address neighborhood. Create a new service on its respective table named services, and link the address. Then, update the client with the new service id.
      for (const [key, value] of Object.entries(clientsObjectByDni)) {
        for (const [subkey, subvalue] of Object.entries(value)) {
          if (subvalue.addresses && subvalue.addresses.length > 0) {
            for (let i = 0; i < subvalue.addresses.length; i++) {
              const address = subvalue.addresses[i];
              await knex.from('service_addresses').insert({
                address: address.address,
                created_at: new Date(),
                published_at: new Date(),
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              const lastInsertedAddress = await knex.from('service_addresses').orderBy('id', 'desc').first().select('id');
              await knex.from('service_addresses_neighborhood_links').insert({
                service_address_id: lastInsertedAddress.id,
                neighborhood_id: address.neighborhood,
                service_address_order: null
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              
              await knex.from('services').insert({
                name: subvalue.clienttypoe === 1 ? 'INTERNET' : 'TELEVISION',
                code: subvalue.code,
                created_at: new Date(),
                published_at: new Date(),
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              // insert service relationships, client, clienttype, city, offer, technology
              const lastInsertedService = await knex.from('services').orderBy('id', 'desc').first().select('id');
              await knex.from('service_addresses_service_links').insert({
                service_id: lastInsertedService.id,
                service_address_id: lastInsertedAddress.id,
                service_address_order: null
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              await knex.from('services_client_links').insert({
                service_id: lastInsertedService.id,
                client_id: subvalue.client
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              await knex.from('services_clienttype_links').insert({
                service_id: lastInsertedService.id,
                clienttype_id: subvalue.clienttype
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              await knex.from('services_city_links').insert({
                service_id: lastInsertedService.id,
                city_id: subvalue.city
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              await knex.from('services_offer_links').insert({
                service_id: lastInsertedService.id,
                offer_id: subvalue.offer
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              await knex.from('services_technology_links').insert({
                service_id: lastInsertedService.id,
                technology_id: subvalue.technology
              })
              .catch((error) => {
                strapi.log.error(error);
              })
            }
            relationalClients++
            strapi.log.info(`Migrated with relational address ${key}...`);
          } else {
            await knex.from('service_addresses').insert({
              address: subvalue.fallback_address,
              created_at: new Date(),
              published_at: new Date(),
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            const lastInsertedAddress = await knex.from('service_addresses').orderBy('id', 'desc').first().select('id');
            await knex.from('service_addresses_neighborhood_links').insert({
              service_address_id: lastInsertedAddress.id,
              neighborhood_id: subvalue.fallback_neighborhood,
              service_address_order: null
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            
            await knex.from('services').insert({
              name: subvalue.clienttypoe === 1 ? 'INTERNET' : 'TELEVISION',
              code: subvalue.code,
              created_at: new Date(),
              published_at: new Date(),
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            // insert service relationships, client, clienttype, city, offer, technology
            const lastInsertedService = await knex.from('services').orderBy('id', 'desc').first().select('id');
            await knex.from('service_addresses_service_links').insert({
              service_id: lastInsertedService.id,
              service_address_id: lastInsertedAddress.id,
              service_address_order: null
            })
            await knex.from('services_client_links').insert({
              service_id: lastInsertedService.id,
              client_id: subvalue.client
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex.from('services_clienttype_links').insert({
              service_id: lastInsertedService.id,
              clienttype_id: subvalue.clienttype
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex.from('services_city_links').insert({
              service_id: lastInsertedService.id,
              city_id: subvalue.city
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex.from('services_offer_links').insert({
              service_id: lastInsertedService.id,
              offer_id: subvalue.offer
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex.from('services_technology_links').insert({
              service_id: lastInsertedService.id,
              technology_id: subvalue.technology
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            fallbackClients++
            strapi.log.info(`Migrated with fallback_address ${key}...`);
          }
        }
      }
      strapi.log.info('Hierarchy migration complete.');
      strapi.log.info(`Total clients: ${totalClients}`);
      strapi.log.info(`Relational clients: ${relationalClients}`);
      strapi.log.info(`Fallback clients: ${fallbackClients}`);
      return
    } catch (error) {
      strapi.log.error(error);
    }
  },
};