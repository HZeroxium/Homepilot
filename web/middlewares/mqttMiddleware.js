// middlewares/mqttMiddleware.js

import mqttClient from "../controllers/mqttController.js";

export default (req, res, next) => {
  req.mqttClient = mqttClient;
  next();
};
