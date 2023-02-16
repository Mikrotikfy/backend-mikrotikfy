module.exports = {
  async up(knex) {
    try {
      strapi.log.info('Beginning debt normalization...');

      const query = knex('debtmovements_client_links')
        .select('client_id', knex.raw('MAX(debtmovement_id) as max_debtmovement_id'))
        .groupBy('client_id')
        .as('latest_debtmovements');

      const result = knex('clients')
        .select('clients.id', 'clients.name', knex.raw('CASE WHEN debtmovements.id IS NULL THEN 0 ELSE 1 END AS has_debtmovement'), knex.raw('(SELECT ??, ?? FROM ?? WHERE ?? = ?? ORDER BY ?? DESC LIMIT 1) AS latest_debtmovement', ['id', 'isindebt', 'debtmovements', 'id', 'latest_debtmovements.max_debtmovement_id', 'id']))
        .leftOuterJoin('debtmovements_client_links', 'clients.id', 'debtmovements_client_links.client_id')
        .leftJoin('debtmovements', function() {
          this.on('debtmovements_client_links.debtmovement_id', '=', 'debtmovements.id')
            .andOn('debtmovements_client_links.client_id', '=', 'clients.id');
        })
        .join(query, function() {
          this.on('debtmovements.id', '=', 'latest_debtmovements.max_debtmovement_id');
        })
        .then(rows => {
          const clients = rows.map(row => {
            if (row.has_debtmovement) {
              return {
                id: row.id,
                name: row.name,
                has_debtmovement: row.has_debtmovement,
                latest_debtmovement: {
                  id: row.latest_debtmovement.id,
                  isindebt: row.latest_debtmovement.isindebt
                }
              }
            } else {
              return {
                id: row.id,
                name: row.name,
                has_debtmovement: row.has_debtmovement
              }
            }
          });
          console.log(JSON.stringify(clients[0]));
        })

      
      return
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
        else if (clients[i].plan_id === 7 && clients[i].has_offer === '1') {
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
        else if ((clients[i].plan_id !== 7 && clients[i].plan_id !== 8) && clients[i].has_offer === '1') {
          strapi.log.info(`Update debt from offer ${clients[i].code}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: false,
            active: true,
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