// sockets/index.js
import registerUserHandlers from './handlers/user.handler.js';
import registerAdminHandlers from './handlers/admin.handler.js';
import registerNoticeHandlers from './handlers/notice.handler.js';

export default function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    registerUserHandlers(io, socket);
    registerAdminHandlers(io, socket);
    registerNoticeHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
}
