const APIARNOP = require("./mkConnection").APIARNOP;
module.exports.mkCreateClient = async function (
  mikrotikHost,
  client
) {
  const conn = await APIARNOP(mikrotikHost)
  const mkPlan = client.plan ? client.plan.mikrotik_name : client.offer.plan.mikrotik_name
  const comment = `${client.code} FTTH ${client.neighborhood.name} ${client.address} ${client.name} ${client.dni} ${client.city.name} ${client.plan ? client.plan.name : client.offer.plan.name} NAP-ONU: ${client.nap_onu_address} POTENCIA: ${client.opticalPower} ${client.wifi_ssid} ${client.wifi_password}`;
  await conn
    .connect()
    .then(() => {})
    .then(() => {
      conn
        .write("/ppp/secret/add", [
          "=name=" + client.code,
          "=password=MAR" + client.code,
          "=profile=" + mkPlan,
          "=service=pppoe",
          "=comment=" + comment,
        ])
        .then(() => {
          conn.close();
        })
        .catch((err) => {
          conn.close();
          console.log(err);
        });
    })
    .catch((err) => {
      conn.close();
      console.log(err);
    });
};