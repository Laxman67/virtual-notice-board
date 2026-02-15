// sockets/handlers/admin.handler.js
export default function registerAdminHandlers(io, socket) {
  socket.on('join_admin_room', () => {
    socket.join('admin_room');
  });
}
