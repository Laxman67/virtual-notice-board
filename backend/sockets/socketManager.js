// sockets/socketManager.js
export const onlineUsers = new Map();

export const addOnlineUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

export const removeOnlineUserBySocket = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      return userId;
    }
  }
  return null;
};

export const getSocketIdByUser = (userId) => {
  return onlineUsers.get(userId);
};
