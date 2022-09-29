const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkCreateClient = async function (
  mikrotikHost,
  client
) {
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: 8087,
  });
  const mkPlan = client.plan ? client.plan.mikrotik_name : client.offer.plan.mikrotik_name
  const comment = `${client.code} ${client.technology.name} ${client.neighborhood.name} ${client.address} ${client.name} ${client.dni} ${client.city.name} ${client.plan ? client.plan.name : client.offer.plan.name} NAP-ONU: ${client.nap_onu_address} POTENCIA: ${client.opticalPower} ${client.wifi_ssid} ${client.wifi_password}`;
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