/* eslint-disable no-undef */
const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkSetClientPlanInformation = async function (
  mikrotikHost,
  input
) {
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: strapi.config.get("server.admin.mikrotik.secret", "null"),
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
module.exports.mkGetMikrotikInfo = async function (mikrotikHost) {
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: strapi.config.get("server.admin.mikrotik.secret", "null"),
    port: 8087,
  });
  await conn.connect();
  try {
    var com1 = await conn.write("/system/identity/print").catch((error) => {
      conn.close();
      return error;
    });
    var com2 = await conn.write("/system/resource/print");
    conn.close();
    const res = { ...com1[0], ...com2[0] };
    const send = {};
    send.name = res.name;
    send.uptime = res.uptime;
    send.cpu = res["cpu-load"];
    send.memory = res["free-memory"];
    send.version = res.version;
    send.buildtime = res["build-time"];
    send.factorysoftware = res["factory-software"];
    send.totalmemory = res["total-memory"];
    send.cpucount = res["cpu-count"];
    send.cpufrequency = res["cpu-frequency"];
    send.freehddspace = res["free-hdd-space"];
    send.totalhddspace = res["total-hdd-space"];
    send.architecturename = res["architecture-name"];
    send.boardname = res["board-name"];
    send.platform = res.platform;
    return send;
  } catch (error) {
    conn.close();
    return error;
  }
};
module.exports.mkClientStatus = async function (
  mikrotikHost,
  code,
  dni,
  model
) {
  /* VAR INIT */
  let client = {
    exists: null,
    online: null,
    mikrotik: null,
    address: null,
    uptime: null,
    lastCallerId: null,
    mac_address: null,
    offlineTime: null,
    disconnectReason: null,
    download: null,
    upload: null,
  };
  /* Mikrotik connection init */
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: 8087,
  });

  await conn.connect();

  try {
    /* Get Current mikrotik identity */
    var identity = await conn.write("/system/identity/print").catch((error) => {
      conn.close();
      return error;
    });
    client.mikrotik = identity[0].name;

    if (model === 1) {
      var getSecret = await conn
        .write("/ppp/secret/print", ["?=name=" + code])
        .catch((error) => {
          conn.close();
          return error;
        });
      var getActiveConnection = await conn
        .write("/ppp/active/print", ["?=name=" + code])
        .catch((error) => {
          conn.close();
          return error;
        });
      var getInterfaceConnection = await conn
        .write("/interface/print", ["?=name=<pppoe-" + code + ">"])
        .catch((error) => {
          conn.close();
          return error;
        });
    } else {
      // eslint-disable-next-line no-redeclare
      var getSecret = await conn
        .write("/ppp/secret/print", ["?=name=" + dni])
        .catch((error) => {
          conn.close();
          return error;
        });
      var getActiveConnection = await conn
        .write("/ppp/active/print", ["?=name=" + dni])
        .catch((error) => {
          conn.close();
          return error;
        });
      // eslint-disable-next-line no-redeclare
      var getInterfaceConnection = await conn
        .write("/interface/print", ["?=name=<pppoe-" + dni + ">"])
        .catch((error) => {
          conn.close();
          return error;
        });
    }
    if (getSecret.length > 0) {
      client.exists = true;
    } else {
      client.exists = false;
    }

    if (getActiveConnection.length > 0 && getInterfaceConnection.length > 0) {
      client.online = true;
    } else {
      client.online = false;
    }

    if (client.exists) {
      if (client.online) {
        client.download = getInterfaceConnection[0]["tx-byte"];
        client.upload = getInterfaceConnection[0]["rx-byte"];
        client.address = getActiveConnection[0]["address"];
        client.mac_address = getActiveConnection[0]["caller-id"];
        client.uptime = getActiveConnection[0].uptime;
      } else {
        client.offlineTime = getSecret[0]["last-logged-out"];
        client.disconnectReason = getSecret[0]["last-disconnect-reason"];
        client.lastCallerId = getSecret[0]["last-caller-id"];
      }
    } else {
      client.exists = false;
    }
    conn.close();
    return client;
  } catch (error) {
    console.log(error);
    conn.close();
  }
};
module.exports.mkActiveClientCount = async function (cityIpArray) {
  if (cityIpArray.length > 1) {
    const cityActiveClients = [];
    for (let i = 0; i < cityIpArray.length; i++) {
      const conn = new RouterOSAPI({
        host: cityIpArray[i],
        user: "API_ARNOP",
        password: strapi.config.get("server.admin.mikrotik.secret", "null"),
        port: 8087,
      });
      await conn.connect();
      const result = await conn.write("/ppp/active/getall", [
        "=.proplist=name",
      ]);
      conn.close();
      cityActiveClients.push(result);
    }
    return cityActiveClients[0].concat(cityActiveClients[1]);
  } else {
    const conn = new RouterOSAPI({
      host: cityIpArray[0],
      user: "API_ARNOP",
      password: strapi.config.get("server.admin.mikrotik.secret", "null"),
      port: 8087,
    });
    console.time("mkfind");
    await conn.connect();
    console.timeEnd("mkfind");
    const result2 = await conn.write("/ppp/active/print", ["=.proplist=name"]);
    conn.close();
    return result2;
  }
};
module.exports.mkGetSecrets = async function (mikrotikHost) {
  try {
    const conn = new RouterOSAPI({
      host: mikrotikHost,
      user: "API_ARNOP",
      password: strapi.config.get("server.admin.mikrotik.secret", "null"),
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
module.exports.mkGetComment = async function (mikrotikHost, dni, code, model) {
  try {
    const conn = new RouterOSAPI({
      host: mikrotikHost,
      user: "API_ARNOP",
      password: strapi.config.get("server.admin.mikrotik.secret", "null"),
      port: 8087,
    });
    await conn.connect();
    if (model === 1) {
      // eslint-disable-next-line no-unused-vars
      var com1 = await conn.write("/ppp/secret/print", [
        "=.proplist=comment",
        "?=name=" + code,
      ]);
    } else {
      // eslint-disable-next-line no-redeclare
      var com1 = await conn.write("/ppp/secret/print", [
        "=.proplist=comment",
        "?=name=" + dni,
      ]);
    }
    conn.close();
    return com1[0];
  } catch (error) {
    conn.close();
    return error;
  }
};
module.exports.mkSetComment = async function (
  mikrotikHost,
  dni,
  code,
  model,
  comment
) {
  const conn = new RouterOSAPI({
    host: mikrotikHost,
    user: "API_ARNOP",
    password: strapi.config.get("server.admin.mikrotik.secret", "null"),
    port: 8087,
  });
  await conn.connect();
  if (
    comment !== "" &&
    comment != "0" &&
    comment != null &&
    comment != "null"
  ) {
    if (model === 1) {
      // eslint-disable-next-line no-unused-vars
      try {
        var com1 = await conn
          .write("/ppp/secret/set", ["=.id=" + code, "=comment=" + comment])
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            conn.close();
            return false;
          });
      } catch (error) {
        conn.close();
        return error;
      }
    } else {
      try {
        // eslint-disable-next-line no-redeclare
        var com1 = await conn
          .write("/ppp/secret/set", ["=.id=" + dni, "=comment=" + comment])
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            conn.close();
            return false;
          });
      } catch (error) {
        conn.close();
        return error;
      }
    }
  } else {
    conn.close();
    return true;
  }
  conn.close();
  if (com1.length > 0) {
    return true;
  } else {
    return true;
  }
};
module.exports.mkDxClient = async function (input) {
  const conn = new RouterOSAPI({
    host: input.cityIp,
    user: "API_ARNOP",
    password: strapi.config.get("server.admin.mikrotik.secret", "null"),
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
module.exports.createComment = async function (client) {
  const newComment = `${client.code} ${client.technology.name} ${client.neighborhood.name} ${client.address} ${client.name} ${client.dni} ${client.phone} ${client.plan.name} ${client.mac_address} NAP-ONU: ${client.nap_onu_address} POTENCIA: ${client.opticalPower} ${client.wifi_ssid} ${client.wifi_password}`;
  return newComment;
};
