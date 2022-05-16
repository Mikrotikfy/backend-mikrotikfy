const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkDxClient = async function (input) {
  const conn = new RouterOSAPI({
    host: input.cityIp,
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
      if (input.kick === 2) {
        var removeActive = await conn.write("/ppp/active/getall", [
          "=.proplist=.id",
          "?=name=" + input.code,
        ]);
      }
    } else {
      // eslint-disable-next-line no-redeclare
      var com1 = await conn.write("/ppp/secret/getall", [
        "=.proplist=.id",
        "?=name=" + input.dni,
      ]);
      if (input.kick === 2) {
        // eslint-disable-next-line no-redeclare
        var removeActive = await conn.write("/ppp/active/getall", [
          "=.proplist=.id",
          "?=name=" + input.dni,
        ]);
      }
    }
    if (com1.length > 0) {
      await conn.write("/ppp/secret/set", [
        "=.id=" + com1[0][".id"],
        "=profile=" + input.planDxMk,
      ]);
      if (input.kick === 2) {
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