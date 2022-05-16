function sanitizeString(str) {
  const res1 = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const res2 = res1.replace(/[^a-z0-9áéíóúñü \.\n@ñ,_-]/gim, "");
  return res2;
}
module.exports.simpleTelegramCreate = async function (input, telegrambot) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  try {
    const bot = telegrambot.token;
    const chatid = telegrambot.log;
    var message = `CREADO\n${input.code}\n${input.name}\n${input.dni}\n${input.address}\n${input.neighborhood.name}\n${input.phone}\n${input.city.name}\n${input.plan.name}\n${input.wifi_ssid}\n${input.wifi_password}\n${input.operator.username}\n${input.createdAt}`;
    const req =
      "https://api.telegram.org/bot" +
      bot +
      "/sendMessage?chat_id=" +
      chatid +
      "&text=" +
      encodeURIComponent(sanitizeString(message));
    fetch(req)
      .then(function (response) {
        return true;
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports.simpleTelegramCreateRequest = async function (
  input,
  telegrambot
) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.binnacle;
  var message = `SOLICITUD DE ACTIVACION\n${input.client.code}\n${input.client.name}\n${input.client.dni}\n${input.client.address}\n${input.client.neighborhood.name}\n${input.client.phone}\n${input.city.name}\n${input.client.wifi_ssid}\n${input.client.wifi_password}\n${input.client.mac_address}\nNAP-ONU: ${input.client.nap_onu_address}\nPOTENCIA: ${input.client.opticalPower}\n${input.operator.username}\n${input.createdAt}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(sanitizeString(message));
  fetch(req)
    .then(function (response) {
      return true;
    })
    .catch(function (err) {
      console.log(err);
    });
};
module.exports.simpleTelegramAdminCreate = async function (
  client,
  telegrambot,
  operator
) {
  const fetch = require("node-fetch");
  const bot = telegrambot.token;
  const chatid = telegrambot.binnacle;
  var message = `APROBADO\n${client.code}\n${client.name}\n${client.dni}\n${client.address}\n${client.neighborhood.name}\n${client.phone}\n${client.city.name}\n${client.plan.name}\n${client.wifi_ssid}\n${client.wifi_password}\n${client.mac_address}\nNAP-ONU: ${client.nap_onu_address}\nPOTENCIA: ${client.opticalPower}\n${operator}\n${client.createdAt}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(sanitizeString(message));
  fetch(req)
    .then(function (response) {
      return true;
    })
    .catch(function (err) {
      console.log(err);
    });
};
module.exports.simpleTelegramUpdate = async function (input, telegrambot) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.log;
  var message = `ACTUALIZADO\n${input.code}\n${input.name}\n${input.dni}\n${input.address}\n${input.neighborhood.name}\n${input.phone}\n${input.city.name}\n${input.plan.name}\n${input.wifi_ssid}\n${input.wifi_password}\n${input.technology.name}\nNAP-ONU: ${input.nap_onu_address}\nPOTENCIA: ${input.opticalPower}dBm\n${input.operator.username}\n${input.createdAt}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(sanitizeString(message));
  fetch(req)
    .then(function (response) {
      return true;
    })
    .catch(function () {
      console.log("Booo");
    });
};
module.exports.simpleTelegramUpdatePlan = async function (
  input,
  operator,
  isRx,
  telegrambot
) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.binnacle;
  var line1 = "";
  if (isRx) {
    line1 = "RECONEXIÓN";
  } else {
    line1 = "CAMBIO DE PLAN";
  }
  const line2 = input.code;
  const line3 = input.name;
  const line4 = input.plan.name;
  const line5 = operator;
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(sanitizeString(message));
  fetch(req)
    .then(function (response) {
      return true;
    })
    .catch(function () {
      console.log("Booo");
    });
};
module.exports.simpleTelegramDelete = async function (input, telegrambot) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.log;
  const line1 = "BORRADO";
  const line2 = input.code;
  const line3 = input.name;
  const line4 = input.operator.username;
  const message = `${line1}\n${line2}\n${line3}\n${line4}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(sanitizeString(message));
  fetch(req)
    .then(function (response) {
      return true;
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function () {
      console.log("Booo");
    });
};
module.exports.simpleTelegramPasswordChange = async function (
  input,
  telegrambot
) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.chat;
  const line1 = "CAMBIO DE CLAVE";
  const line2 = input.code;
  const line3 = input.name;
  const message = `${line1}\n${line2}\n${line3}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(sanitizeString(message));
  fetch(req)
    .then(function (response) {
      return true;
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function () {
      console.log("Booo");
    });
};
module.exports.simpleTelegramCreateTicket = async function (
  input,
  neighborhood,
  telegrambot
) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.chat;
  const line1 = "ℹ NUEVO TICKET ℹ️";
  const line2 = input.client.code;
  const line3 = sanitizeString(input.client.name);
  const line4 = sanitizeString(input.client.address);
  const line5 = sanitizeString(neighborhood);
  const line6 = sanitizeString(input.client.phone);
  const line7 = sanitizeString(input.tickettype.name);
  const line8 = sanitizeString(input.details);
  const line9 = sanitizeString(input.assiganted.username);
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\nInforma: ${line9}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(message);
  fetch(req)
    .then(function (res) {
      console.log(res)
      return true;
    })
    .catch(function (err) {
      console.log("Booo", err);
    });
};
module.exports.simpleTelegramCreateTicketAdvance = async function (
  input,
  client,
  tickettype,
  assiganted,
  telegrambot
) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.chat;
  let line1 = "";
  if (!input.ticket.active) {
    line1 = "✅ CIERRE DE TICKET ✅";
  } else {
    line1 = "AVANCE DE TICKET";
  }
  const line2 = sanitizeString(client.name);
  const line3 = sanitizeString(tickettype.name);
  const line4 = sanitizeString(input.details);
  let line5 = "";
  if (!input.ticket.active) {
    line5 = "CASO CERRADO";
  } else {
    line5 = "CASO ACTIVO";
  }
  const line6 = sanitizeString(assiganted);
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n\n${line5}\n${line6}`;
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(message);
  await fetch(req)
    .then(function (_) {
      return true;
    })
    .catch(function () {
      console.log("Booo");
    });
};
module.exports.simpleTelegramSendActiveTicketList = async function (
  ticketlist,
  telegrambot
) {
  const fetch = require("node-fetch");
  require("dotenv").config();
  const bot = telegrambot.token;
  const chatid = telegrambot.chat;
  let message = "✴️ TICKETS ACTIVOS RESTANTES ✴️";
  ticketlist.forEach((ticket) => {
    if (ticket.active) {
      message += `➡️ ${sanitizeString(
        ticket.client.code
      )} - ${sanitizeString(ticket.client.name)} - ${sanitizeString(
        ticket.tickettype.name
      )}\n\n`;
    }
  });
  const req =
    "https://api.telegram.org/bot" +
    bot +
    "/sendMessage?chat_id=" +
    chatid +
    "&text=" +
    encodeURIComponent(message);
  await fetch(req)
    .then(function (_) {
      return true;
    })
    .catch(function () {
      console.log("Booo");
    });
};