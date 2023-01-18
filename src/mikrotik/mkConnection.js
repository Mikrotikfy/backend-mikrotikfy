const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.APIARNOP = async function (
  mikrotikHost
  ) {
  const ip = mikrotikHost.split(":")[0]
  const port = mikrotikHost.split(":")[1]
  const mkobj = new RouterOSAPI({
    host: ip,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: port,
  });
  return mkobj
}