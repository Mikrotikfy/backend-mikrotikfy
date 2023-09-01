const APIARNOP = require("./mkConnection").APIARNOP;
module.exports.mkSetComment = async function (payload) {
  const conn = await APIARNOP(payload.mikrotikHost)
  await conn.connect();
  if (payload.model === 1) {
    // eslint-disable-next-line no-unused-vars
    try {
      var com1 = await conn
        .write("/ppp/secret/set", ["=.id=" + payload.code, "=comment=" + payload.comment])
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err.message);
          return false;
        });
    } catch (error) {
      conn.close();
      return error.message;
    }
  } else {
    try {
      // eslint-disable-next-line no-redeclare
      var com1 = await conn
        .write("/ppp/secret/set", ["=.id=" + payload.dni, "=comment=" + payload.comment])
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err.message);
          return false;
        });
    } catch (error) {
      conn.close();
      return error.message;
    }
  }
  conn.close();
  if (com1.length > 0) {
    return true;
  } else {
    return true;
  }
};