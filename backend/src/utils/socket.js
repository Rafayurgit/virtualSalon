let io = null;

export const initSocket = async (server) => {
  const { Server } = await import('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('subscribe', (shopId) => {
      if (shopId) socket.join(shopId);
    });
    socket.on('unsubscribe', (shopId) => {
      if (shopId) socket.leave(shopId);
    });
  });
  return io;
};

export const getIo = () => io;
