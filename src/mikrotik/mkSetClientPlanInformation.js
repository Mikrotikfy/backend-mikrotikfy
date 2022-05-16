const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkSetClientPlanInformation = async function (
  mikrotikHost,
  input
) {
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: 8087,
  });
  try {
    await conn.connect();
    if (input.model === 1) {
      // eslint-disable-next-line no-unused-vars
      var com1 = await conn.write("/ppp/secret/getall", [
        "=.proplist=.id",
        "?=name=" + input.code,
      ]);
      var removeActive = await conn.write("/ppp/active/getall", [
        "=.proplist=.id",
        "?=name=" + input.code,
      ]);
    } else {
      // eslint-disable-next-line no-redeclare
      var com1 = await conn.write("/ppp/secret/getall", [
        "=.proplist=.id",
        "?=name=" + input.dni,
      ]);
      // eslint-disable-next-line no-redeclare
      var removeActive = await conn.write("/ppp/active/getall", [
        "=.proplist=.id",
        "?=name=" + input.dni,
      ]);
    }
    if (com1.length > 0) {
      await conn.write("/ppp/secret/set", [
        "=.id=" + com1[0][".id"],
        "=profile=" + input.newClientPlan,
      ]);
      if (input.removeActive) {
        if (removeActive.length > 0) {
          // eslint-disable-next-line no-redeclare
          var removeActive = await conn.write("/ppp/active/remove", [
            "=.proplist=.id",
            "=.id=" + removeActive[0][".id"],
          ]);
        }
      }
      conn.close();
      return true;
    } else {
      conn.close();
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};