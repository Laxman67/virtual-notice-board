// sockets/handlers/user.handler.js
import User from '../../models/User.model.js';
import { addOnlineUser, removeOnlineUserBySocket } from '../socketManager.js';
import { onlineUsers } from '../socketManager.js';

export default function registerUserHandlers(io, socket) {
  socket.on('user_online', async (userId) => {
    console.log('Server: user_online - userId:', userId, 'socketId:', socket.id);
    addOnlineUser(userId, socket.id);
    console.log('Server: online users now:', Array.from(onlineUsers.entries()));

    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('user_status_changed', { userId, isOnline: true });
  });

  socket.on('disconnect', async () => {
    const userId = removeOnlineUserBySocket(socket.id);
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit('user_status_changed', { userId, isOnline: false });
    }
  });
}
