const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.createAddressList = async function (payload) {
  const { mikrotik, ipmodel } = payload
  const { client } = ipmodel
  const conn = new RouterOSAPI({
    host: mikrotik.ip,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: 8087,
  });
  try {
    console.log(ipmodel)
    await conn.connect();

    await conn.write("/ip/address/add", [
      "=address=" + ipmodel.cidr,
      "=interface=" + ipmodel.vlan.name,
      "=comment=" + client.code,
    ]).catch((err) => {
      conn.close()
      console.log(err)
    })

    await conn.write("/ip/arp/add", [
      "=address=" + ipmodel.host,
      "=interface=" + ipmodel.vlan.name,
      "=comment=" + client.code,
    ]).catch((err) => {
      conn.close()
      console.log(err)
    })

    await conn.write("/queue/simple/add", [
      "=name=" + client.code,
      "=target=" + ipmodel.host,
      "=max-limit=" + `${client.plan.mikrotik_bandwidth}/${client.plan.mikrotik_bandwidth}`,
    ]).catch((err) => {
      conn.close()
      console.log(err)
    })

    await conn.write("/ip/firewall/address-list/add", [
      "=list=" + `${client.plan.mikrotik_name}`,
      "=address=" + ipmodel.host,
      "=comment=" + client.code,
    ]).catch((err) => {
      conn.close()
      console.log(err)
    })

    conn.close()
    return true
  } catch (error) {
    console.log(error)
  }
};