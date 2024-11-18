// config/socket.js

import { Server as socketIO } from "socket.io";

let io;

/**
 * Initializes the Socket.IO instance.
 * @param {http.Server} server - The Node.js server to bind to.
 * @returns {SocketIO.Server} The initialized Socket.IO instance.
 */
export const init = (server) => {
  io = socketIO(server);
  return io;
};

/**
 * Returns the Socket.IO instance.
 * @throws {Error} Socket.IO not initialized yet.
 * @returns {SocketIO.Server} The Socket.IO instance.
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
