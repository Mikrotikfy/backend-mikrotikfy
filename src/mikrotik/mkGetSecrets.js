const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkGetSecrets = async function (mikrotikHost) {
  console.log(mikrotikHost)
  try {
    const conn = new RouterOSAPI({
      host: mikrotikHost,
      user: "API_ARNOP",
      password: process.env.MIKROTIK_API_SECRET,
      port: 8087,
    });
    await conn.connect();
    // eslint-disable-next-line no-unused-vars
    var com1 = await conn.write("/ppp/secret/getall", [
      "=.proplist=last-caller-id,name",
    ]);
    conn.close();
    return com1;
  } catch (error) {
    conn.close();
    return error;
  }
};