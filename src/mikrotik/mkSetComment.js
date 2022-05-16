const RouterOSAPI = require("node-routeros").RouterOSAPI;
module.exports.mkSetComment = async function (payload) {
  const conn = new RouterOSAPI({
    host: payload.mikrotikHost,
    user: "API_ARNOP",
    password: process.env.MIKROTIK_API_SECRET,
    port: 8087,
  });
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
          conn.close();
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
          conn.close();
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

async function test () {
  try {
    console.log('begin test funcion')
    const conn = new RouterOSAPI({
      host: '191.102.86.50',
      user: "API_ARNOP",
      password: process.env.MIKROTIK_API_SECRET,
      port: 8087,
    });
    const connect = function() {
      conn.connect().then( () => {
        console.log('begin streaming')
        conn.stream('/interface/print', ['stats-detail', '=interval=1', '?name=WAN'], (error, packet) => {
          // If you get a error (trap), the streaming will stop
          if(error) {
            setTimeout(() => {
              console.log('try to resume after 10 seconds inactivity')
              test()
            }, 10000);
            return console.log('err1: ', error)
          }
          packet.length > 0 ? console.log('res: ', packet) : null
        })
      })
      .catch((err) => {
        console.log(err.message);
        conn.connect()
        return false;
      });
      conn.on('error', (err) => {
        console.log('connection error, timeout or bad credentials.Triying to reconnect in 10 seconds')
        console.log(err); // Some error that ocurred when already connected
        setTimeout(() => {
          connect()
        }, 10000);
      });
    }
    connect()
  } catch (error) {
    console.log('err3: ', error);
  }
}