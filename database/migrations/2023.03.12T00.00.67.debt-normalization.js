module.exports = {
  async up(knex) {
    try {
      strapi.log.info('Beginning debt normalization...');

      
      const rows = await knex.select(
        'clients.id',
        knex.raw('COALESCE(EXISTS (SELECT 1 FROM debtmovements_client_links WHERE client_id = clients.id), 0) AS has_debtmovement'),
        knex.raw('COALESCE((SELECT isindebt FROM debtmovements WHERE id = (SELECT MAX(id) FROM debtmovements WHERE id IN (SELECT debtmovement_id FROM debtmovements_client_links WHERE client_id = clients.id))), 0) AS last_debtmovement_isindebt'),
        knex.raw('COALESCE((SELECT isretired FROM debtmovements WHERE id = (SELECT MAX(id) FROM debtmovements WHERE id IN (SELECT debtmovement_id FROM debtmovements_client_links WHERE client_id = clients.id))), 0) AS last_debtmovement_isretired'),
        knex.raw('(SELECT plan_id FROM clients_plan_links WHERE client_id = clients.id LIMIT 1) AS plan_id')
      )
      .from('clients')
      .join('clients_clienttype_links', 'clients.id', '=', 'clients_clienttype_links.client_id')
      .join('clienttypes', 'clients_clienttype_links.clienttype_id', '=', 'clienttypes.id')
      .where('clienttypes.name', '=', 'INTERNET')
      .orderBy('clients.id', 'asc')

      const clients = rows.map(row => ({
        id: row.id,
        hasDebtMovement: parseInt(row.has_debtmovement),
        lastDebtMovementIsInDebt: parseInt(row.last_debtmovement_isindebt),
        lastDebtMovementIsRetired: parseInt(row.last_debtmovement_isretired),
        plan_id: parseInt(row.plan_id),
      }));
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].hasDebtMovement === 1) {
          strapi.log.info(`Client have offer, applying isindebt: ${clients[i].lastDebtMovementIsInDebt} and isretired: ${clients[i].lastDebtMovementIsRetired} to ID ${clients[i].id}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: clients[i].lastDebtMovementIsInDebt === 1 ? true : false,
            active: clients[i].lastDebtMovementIsRetired === 1 ? false : true,
          })
          .catch((error) => {
            strapi.log.error(error);
          })
        }
        else {
          strapi.log.info(`Client ${clients[i].id} has no offer, Set indebt and active one from a plan. isindebt: ${clients[i].plan_id === 7 ? '1' : '0'} and isretired: ${clients[i].plan_id === 8 ? '1' : '0'}...`);
          await knex('clients')
          .where({ id: clients[i].id })
          .update({
            indebt: clients[i].plan_id === 7 ? true : false,
            active: clients[i].plan_id === 8 ? false : true
          })
          await knex.from('clients_offer_links').insert({
            client_id: clients[i].id,
            offer_id: getOfferByPlan(clients[i].plan_id),
            client_order: null
          }).onConflict('offer_id')
          .ignore()
          .catch((error) => {
            strapi.log.error(error);
          })
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