const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkDeleteClient = async function (
  mikrotikHost,
  client
) {
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: 8087,
  });
  try {
    await conn.connect();
    if (client.newModel === 1) {
      var com1 = await conn.write("/ppp/secret/getall", [
        "=.proplist=.id",
        "?=name=" + client.code,
      ]);
      await conn.write("/ppp/secret/remove", ["=.id=" + com1[0][".id"]]);
      conn.close();
      return true;
    } else {
      var com1 = await conn.write("/ppp/secret/getall", [
        "=.proplist=.id",
        "?=name=" + client.dni,
      ]);
      await conn.write("/ppp/secret/remove", ["=.id=" + com1[0][".id"]]);
      conn.close();
      return true;
    }
  } catch (error) {
    conn.close();
    return false;
  }
};