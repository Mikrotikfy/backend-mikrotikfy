const APIARNOP = require("./mkConnection").APIARNOP;
module.exports.mkDeleteClient = async function (
  mikrotikHost,
  client
) {
  const conn = await APIARNOP(mikrotikHost)
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