const APIARNOP = require("./mkConnection").APIARNOP;
module.exports.mkGetSecrets = async function (mikrotikHost) {
  console.log(mikrotikHost)
  try {
    const conn = await APIARNOP(mikrotikHost)
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