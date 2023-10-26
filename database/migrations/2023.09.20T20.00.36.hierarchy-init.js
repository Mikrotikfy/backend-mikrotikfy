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
      return
      strapi.log.info('Beginning hierarchy migration...');
      let totalDatabaseHits = 0
      // Organiza los resultados en un objeto
      var relationalClients = 0
      var fallbackClients = 0
      const clientsObject = {};

      createClientObject = (row) => {
        const clientId = row.id;
        if (!clientsObject[clientId]) {
          clientsObject[clientId] = {
            id: row.id,
            dni: row.dni,
            name: row.name,
            code: row.code,
            active: row.active,
            indebt: row.indebt,
            wifi_ssid: row.wifi_ssid,
            wifi_password: row.wifi_password,
            newModel: row.newModel || 0,
            phone: row.phone,
            email: row.email,
            ipmodel: row.ipmodel,
            balance: row.balance,
            billingmonth: row.billingmonth,
            billingyear: row.billingyear,
            stratum: row.stratum,
            opticalpower: row.opticalpower,
            signed: row.signed,
            signature: row.signature,
            corporate: row.corporate,
            fallback_address: row.address,
            fallback_neighborhood: row.fallback_neighborhood,
            client: clientId,
            clienttype: row.clienttype_id,
            city: row.city_id,
            offer: row.offer_id,
            technology: row.technology_id,
            addresses: [], 
            mac_addresses: [],
            naps: [],
            plan: null,
            tickets: [],
            debtmovements: [],
            offermovements: [],
            monthlybills: [],
            tvspecs: [],
            invoices: [],
            legal_notes: [],
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
        if (row.mac_address_id) {
          if (!clientsObject[clientId].mac_addresses.includes(row.mac_address_id)) {
            clientsObject[clientId].mac_addresses.push(row.mac_address_id);
          }
        }
        if (row.nap_id) {
          if (!clientsObject[clientId].naps.includes(row.nap_id)) {
            clientsObject[clientId].naps.push(row.nap_id);
          }
        }
        if (row.plan_id) {
          clientsObject[clientId].plan = row.plan_id;
        }
        if (row.ticket_id) {
          if (!clientsObject[clientId].tickets.includes(row.ticket_id)) {
            clientsObject[clientId].tickets.push(row.ticket_id);
          }
        }
        if (row.debtmovement_id) {
          if (!clientsObject[clientId].debtmovements.includes(row.debtmovement_id)) {
            clientsObject[clientId].debtmovements.push(row.debtmovement_id);
          }
        }
        if (row.offermovement_id) {
          if (!clientsObject[clientId].offermovements.includes(row.offermovement_id)) {
            clientsObject[clientId].offermovements.push(row.offermovement_id);
          }
        }
        if (row.monthlybill_id) {
          if (!clientsObject[clientId].monthlybills.includes(row.monthlybill_id)) {
            clientsObject[clientId].monthlybills.push(row.monthlybill_id);
          }
        }
        if (row.tvspec_id) {
          if (!clientsObject[clientId].tvspecs.includes(row.tvspec_id)) {
            clientsObject[clientId].tvspecs.push(row.tvspec_id);
          }
        }
        if (row.invoice_id) {
          if (!clientsObject[clientId].invoices.includes(row.invoice_id)) {
            clientsObject[clientId].invoices.push(row.invoice_id);
          }
        }
        if (row.legal_note_id) {
          if (!clientsObject[clientId].legal_notes.includes(row.legal_note_id)) {
            clientsObject[clientId].legal_notes.push(row.legal_note_id);
          }
        }
        
        // Order desc addresses
        clientsObject[clientId].addresses.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        // remove all addresses but the first one
        clientsObject[clientId].addresses = clientsObject[clientId].addresses.slice(0, 1);
        strapi.log.info(`Creando objeto para ID: ${clientId}...`);
        totalDatabaseHits++
      }

      await knex('clients')
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
        'addresses.created_at',
        'mac_addresses.id as mac_address_id',
        'naps.id as nap_id',
        'plans.id as plan_id',
        'tickets.id as ticket_id',
        'debtmovements.id as debtmovement_id',
        'offermovements.id as offermovement_id',
        'monthlybills.id as monthlybill_id',
        'tvspecs.id as tvspec_id',
        'invoices.id as invoice_id',
        'legal_notes.id as legal_note_id',
      )
      .leftJoin('clients_city_links', 'clients.id', 'clients_city_links.client_id')
      .leftJoin('cities', 'clients_city_links.city_id', 'cities.id')

      .leftJoin('devices_clients_links', 'clients.id', 'devices_clients_links.client_id')
      .leftJoin('devices as mac_addresses', 'devices_clients_links.device_id', 'mac_addresses.id')
      
      .leftJoin('naps_clients_links', 'clients.id', 'naps_clients_links.client_id')
      .leftJoin('naps', 'naps_clients_links.nap_id', 'naps.id')
      
      .leftJoin('clients_plan_links', 'clients.id', 'clients_plan_links.client_id')
      .leftJoin('plans', 'clients_plan_links.plan_id', 'plans.id')
      
      .leftJoin('tickets_client_links', 'clients.id', 'tickets_client_links.client_id')
      .leftJoin('tickets', 'tickets_client_links.ticket_id', 'tickets.id')
      
      .leftJoin('debtmovements_client_links', 'clients.id', 'debtmovements_client_links.client_id')
      .leftJoin('debtmovements', 'debtmovements_client_links.debtmovement_id', 'debtmovements.id')
      
      .leftJoin('offermovements_client_links', 'clients.id', 'offermovements_client_links.client_id')
      .leftJoin('offermovements', 'offermovements_client_links.offermovement_id', 'offermovements.id')
      
      .leftJoin('monthlybills_client_links', 'clients.id', 'monthlybills_client_links.client_id')
      .leftJoin('monthlybills', 'monthlybills_client_links.monthlybill_id', 'monthlybills.id')
      
      .leftJoin('tvspecs_client_links', 'clients.id', 'tvspecs_client_links.client_id')
      .leftJoin('tvspecs', 'tvspecs_client_links.tvspec_id', 'tvspecs.id')
      
      .leftJoin('invoices_client_links', 'clients.id', 'invoices_client_links.client_id')
      .leftJoin('invoices', 'invoices_client_links.invoice_id', 'invoices.id')
      
      .leftJoin('legal_notes_client_links', 'clients.id', 'legal_notes_client_links.client_id')
      .leftJoin('legal_notes', 'legal_notes_client_links.legal_note_id', 'legal_notes.id')
      
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
      // .where('clients.id', '<', 3)
      // .where('clients.id', '>', 19999)
      .stream()
      .on('data', createClientObject)
      .on('end', async () => {

        const totalClients = clientsObject.length;
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
            clientsObjectByDni[value.dni][value.code] = value
          }
        }
        // loop through the clientsObjectByDni, loop through the subkeys, and loop through the addresses array, create the new addresses, store the new address id. link the address neighborhood. Create a new service on its respective table named services, and link the address. Then, update the client with the new service id.
        for (const [key, value] of Object.entries(clientsObjectByDni)) {
          await knex2.from('normalized_clients').insert({
            dni: value[Object.keys(value)[0]].dni,
            name: value[Object.keys(value)[0]].name,
            phone: value[Object.keys(value)[0]].phone,
            email: value[Object.keys(value)[0]].email,
            created_at: new Date(),
            published_at: new Date()
          })
          const lastInsertedNormalizedClient = await knex2.from('normalized_clients').orderBy('id', 'desc').first().select('id');
          for (const [subkey, subvalue] of Object.entries(value)) {
            await knex2.from('services').insert({
              active: subvalue.active,
              indebt: subvalue.indebt,
              name: subvalue.clienttype === 1 ? 'INTERNET' : 'TELEVISION',
              code: subvalue.code,
              stratum: subvalue.stratum,
              opticalpower: subvalue.opticalpower,
              signed: subvalue.signed,
              signature: subvalue.signature,
              corporate: subvalue.corporate,
              wifi_ssid: subvalue.wifi_ssid,
              wifi_password: subvalue.wifi_password,
              new_model: subvalue.newModel,
              ipmodel: subvalue.ipmodel,
              balance: subvalue.balance,
              billingmonth: subvalue.billingmonth,
              billingyear: subvalue.billingyear,
              created_at: new Date(),
              published_at: new Date(),
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            // insert service relationships, client, clienttype, city, offer, technology
            const lastInsertedService = await knex2.from('services').orderBy('id', 'desc').first().select('id');
            
            await knex2.from('services_normalized_client_links').insert({
              service_id: lastInsertedService.id,
              normalized_client_id: lastInsertedNormalizedClient.id
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex2.from('services_clienttype_links').insert({
              service_id: lastInsertedService.id,
              clienttype_id: subvalue.clienttype
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex2.from('services_city_links').insert({
              service_id: lastInsertedService.id,
              city_id: subvalue.city
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex2.from('services_offer_links').insert({
              service_id: lastInsertedService.id,
              offer_id: subvalue.offer
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            await knex2.from('services_technology_links').insert({
              service_id: lastInsertedService.id,
              technology_id: subvalue.technology
            })
            .catch((error) => {
              strapi.log.error(error);
            })
            if (subvalue.mac_addresses && subvalue.mac_addresses.length > 0) {
              for (let i = 0; i < subvalue.mac_addresses.length; i++) {
                const mac_address_id = subvalue.mac_addresses[i];
                await knex2.from('services_mac_addresses_links').insert({
                  service_id: lastInsertedService.id,
                  device_id: mac_address_id,
                  device_order: null,
                  service_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.naps && subvalue.naps.length > 0) {
              for (let i = 0; i < subvalue.naps.length; i++) {
                const nap_id = subvalue.naps[i];
                await knex2.from('services_naps_links').insert({
                  service_id: lastInsertedService.id,
                  nap_id: nap_id,
                  service_order: null,
                  nap_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.plan) {
              await knex2.from('services_plan_links').insert({
                service_id: lastInsertedService.id,
                plan_id: subvalue.plan,
                service_order: null
              })
              .catch((error) => {
                strapi.log.error(error);
              })
            }
            if (subvalue.tickets && subvalue.tickets.length > 0) {
              for (let i = 0; i < subvalue.tickets.length; i++) {
                const ticket_id = subvalue.tickets[i];
                await knex2.from('tickets_service_links').insert({
                  service_id: lastInsertedService.id,
                  ticket_id: ticket_id,
                  ticket_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.debtmovements && subvalue.debtmovements.length > 0) {
              for (let i = 0; i < subvalue.debtmovements.length; i++) {
                const debtmovement_id = subvalue.debtmovements[i];
                await knex2.from('debtmovements_service_links').insert({
                  service_id: lastInsertedService.id,
                  debtmovement_id: debtmovement_id,
                  debtmovement_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.offermovements && subvalue.offermovements.length > 0) {
              for (let i = 0; i < subvalue.offermovements.length; i++) {
                const offermovement_id = subvalue.offermovements[i];
                await knex2.from('offermovements_service_links').insert({
                  service_id: lastInsertedService.id,
                  offermovement_id: offermovement_id,
                  offermovement_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.monthlybills && subvalue.monthlybills.length > 0) {
              for (let i = 0; i < subvalue.monthlybills.length; i++) {
                const monthlybill_id = subvalue.monthlybills[i];
                await knex2.from('monthlybills_service_links').insert({
                  service_id: lastInsertedService.id,
                  monthlybill_id: monthlybill_id,
                  monthlybill_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.tvspecs && subvalue.tvspecs.length > 0) {
              for (let i = 0; i < subvalue.tvspecs.length; i++) {
                const tvspec_id = subvalue.tvspecs[i];
                await knex2.from('services_tvspec_links').insert({
                  service_id: lastInsertedService.id,
                  tvspec_id: tvspec_id
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.invoices && subvalue.invoices.length > 0) {
              for (let i = 0; i < subvalue.invoices.length; i++) {
                const invoice_id = subvalue.invoices[i];
                await knex2.from('invoices_service_links').insert({
                  service_id: lastInsertedService.id,
                  invoice_id: invoice_id,
                  invoice_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.legal_notes && subvalue.legal_notes.length > 0) {
              for (let i = 0; i < subvalue.legal_notes.length; i++) {
                const legal_note_id = subvalue.legal_notes[i];
                await knex2.from('legal_notes_service_links').insert({
                  service_id: lastInsertedService.id,
                  legal_note_id: legal_note_id,
                  legal_note_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
            }
            if (subvalue.addresses && subvalue.addresses.length > 0) {
              for (let i = 0; i < subvalue.addresses.length; i++) {
                const address = subvalue.addresses[i];
                await knex2.from('service_addresses').insert({
                  address: address.address,
                  created_at: new Date(),
                  published_at: new Date(),
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
                const lastInsertedAddress = await knex2.from('service_addresses').orderBy('id', 'desc').first().select('id');
                await knex2.from('service_addresses_neighborhood_links').insert({
                  service_address_id: lastInsertedAddress.id,
                  neighborhood_id: address.neighborhood,
                  service_address_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
                
                
                await knex2.from('service_addresses_service_links').insert({
                  service_id: lastInsertedService.id,
                  service_address_id: lastInsertedAddress.id,
                  service_address_order: null
                })
                .catch((error) => {
                  strapi.log.error(error);
                })
              }
              relationalClients++
              strapi.log.info(`Migrated with relational address ${key}...`);
            } else {
              await knex2.from('service_addresses').insert({
                address: subvalue.fallback_address,
                created_at: new Date(),
                published_at: new Date(),
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              const lastInsertedAddress = await knex2.from('service_addresses').orderBy('id', 'desc').first().select('id');
              await knex2.from('service_addresses_neighborhood_links').insert({
                service_address_id: lastInsertedAddress.id,
                neighborhood_id: subvalue.fallback_neighborhood,
                service_address_order: null
              })
              .catch((error) => {
                strapi.log.error(error);
              })
              await knex2.from('service_addresses_service_links').insert({
                service_id: lastInsertedService.id,
                service_address_id: lastInsertedAddress.id,
                service_address_order: null
              })
              fallbackClients++
              strapi.log.info(`Migrated with fallback_address ${key}...`);
            }
          }
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