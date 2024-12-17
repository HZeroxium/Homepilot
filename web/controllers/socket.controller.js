// controllers/socket.controller.js

import SocketService from '../services/socket.service.js';

const socketController = (socket) => {
  console.log('A client connected:', socket.id);

  const session = socket.handshake.session;
  if (session?.user) {
    const userId = session.user.id;
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  } else {
    console.warn(`Socket ${socket.id} has no associated user.`);
  }

  socket.on('joinRoom', (data) => {
    const userId = data.userId;
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on('chatMessage', async (data) => {
    try {
      const { message, userID } = data;
      const botResponse = await SocketService.processChatMessage({
        message,
        userID,
      });
      socket.emit('botResponse', botResponse);
    } catch (error) {
      console.error('Error in chatMessage:', error);
      socket.emit(
        'botResponse',
        'Sorry, there was an error processing your message.'
      );
    }
  });
};

export default socketController;
