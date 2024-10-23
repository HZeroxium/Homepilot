// middlewares/mqttMiddleware.js

const mqttClient = require("../controllers/mqttController");

module.exports = (req, res, next) => {
  req.mqttClient = mqttClient;
  next();
};
