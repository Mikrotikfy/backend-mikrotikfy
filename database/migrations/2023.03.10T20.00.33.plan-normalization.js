module.exports = {
  async up(knex) {
    try {
      strapi.log.info('Beginning plan normalization...');

      const subquery = knex('clients_offer_links')
        .select('client_id')
        .whereRaw('clients_offer_links.client_id = clients.id')
        .limit(1)
        .toString();
      const clients = await knex
      .select('clients.id', 'clients.code', 'clients.indebt', 'clients.active', 'clienttypes.name AS clienttype_name', knex.raw(`EXISTS(${subquery}) AS has_offer`))
      .from('clients')
      .join('clients_plan_links', 'clients.id', '=', 'clients_plan_links.client_id')
      .join('plans', 'clients_plan_links.plan_id', '=', 'plans.id')
      .leftJoin('clients_clienttype_links', 'clients.id', '=', 'clients_clienttype_links.client_id')
      .leftJoin('clienttypes', 'clients_clienttype_links.clienttype_id', '=', 'clienttypes.id')
      .leftJoin('clients_offer_links', 'clients.id', '=', 'clients_offer_links.client_id')
      .leftJoin('offers', 'clients_offer_links.offer_id', '=', 'offers.id')
      .where({ 'clienttypes.name': 'INTERNET'})
      strapi.log.info(`Found ${clients.length} clients to normalize...`);
      strapi.log.info(JSON.stringify(clients[0]))
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].plan_id === 7 && clients[i].has_offer === '0') {
          strapi.log.info(`Apply DX and Offer ${clients[i].code}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: true,
            active: true
          })
          await knex.from('clients_offer_links').insert({
            client_id: clients[i].id,
            offer_id: 14,
            client_order: null
          })
          .catch((error) => {
            strapi.log.error(error);
          })
        }
        else if (clients[i].plan_id === 7 &&  clients[i].has_offer === '1') {
          strapi.log.info(`Apply DX only ${clients[i].code}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: true,
            active: true
          })
          await knex.from('clients_offer_links').update({
            offer_id: 14,
            client_order: null
          }).where({ client_id: clients[i].id })
          .catch((error) => {
            strapi.log.error(error);
          })
        }
        else if (clients[i].plan_id === 8 && clients[i].has_offer === '0') {
          strapi.log.info(`Apply R and Offer ${clients[i].code}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: false,
            active: false
          })
          await knex.from('clients_offer_links').insert({
            client_id: clients[i].id,
            offer_id: 15,
            client_order: null
          })
          .catch((error) => {
            strapi.log.error(error);
          })
        }
        else if (clients[i].plan_id === 8 && clients[i].has_offer === '1') {
          strapi.log.info(`Apply R for ${clients[i].code}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: false,
            active: false
          })
          await knex.from('clients_offer_links').update({
            offer_id: 15,
            client_order: null
          }).where({ client_id: clients[i].id })
          .catch((error) => {
            strapi.log.error(error);
          })
        }
        else if ((clients[i].plan_id !== 7 && clients[i].plan_id !== 8) && clients[i].has_offer === '0') {
          strapi.log.info(`Apply offer for ${clients[i].code}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: false,
            active: true,
          })
          await knex.from('clients_offer_links').insert({
            client_id: clients[i].id,
            offer_id: getOfferByPlan(clients[i].plan_id),
            client_order: null
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

getOfferByPlan = (planId) => {
  switch (planId) {
    case 1:
      return 9;
    case 2:
      return 5;
    case 3:
      return 10;
    case 4:
      return 11;
    case 5:
      return 3;
    case 6:
      return 4;
    case 10:
      return 12;
    case 11:
      return 13;
    case 12:
      return 1;
    case 13:
      return 22;
    default:
      return 1;
  }
}