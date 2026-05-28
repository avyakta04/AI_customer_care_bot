import { io } from 'socket.io-client';

// Initializing the socket service for real-time AI supervisor updates
const socket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:3000', {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const onSupervisorUpdate = (callback) => {
  socket.on('supervisor_update', callback);
};

export default socket;
