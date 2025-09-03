import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (token, userId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io('https://barber-server-6kuo.onrender.com', {
    auth: {
      token: token
    }
  });

  socket.on('connect', () => {
    console.log('✅ Conectado al servidor Socket.io');
    socket.emit('unir_usuario', userId);
  });

  socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor Socket.io');
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};