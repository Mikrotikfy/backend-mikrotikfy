const APIARNOP = require("./mkConnection").APIARNOP;
module.exports.mkSetClientPlanInformation = async function (
  mikrotikHost,
  input
) {
  const conn = await APIARNOP(mikrotikHost)
  try {
    var findSecret = [];
    var removeActive = [];
    await conn.connect();
    findSecret = await conn.write("/ppp/secret/getall", [
      "=.proplist=.id",
      "?=name=" + input.code,
    ]);
    removeActive = await conn.write("/ppp/active/getall", [
      "=.proplist=.id",
      "?=name=" + input.code,
    ]);
    if (findSecret.length > 0) {
      await conn.write("/ppp/secret/set", [
        "=.id=" + findSecret[0][".id"],
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
    } else {
      conn.close();
    }
    if (findSecret.length > 0) {
      return {
        status: "ok",
        message: "Se actualizó el plan correctamente",
      }
    } else {
      return {
        status: "error",
        message: "No se encontró el cliente",
      }
    }
  } catch (error) {
    console.log(error);
  }
};