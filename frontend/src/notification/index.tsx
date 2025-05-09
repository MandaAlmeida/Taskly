// socketService.ts
import { io } from 'socket.io-client';
import { notificationProps } from "@/@types/notification";

export const socket = io('http://192.168.100.6:3000'); // ou a URL de produção
console.log('📡 Tentando conectar ao servidor WebSocket...');


export const connectToSocket = (userId: string) => {
    // Sempre registra listeners (evita duplicar usando .off antes, opcionalmente)
    socket.on('notification', (data: notificationProps) => {
        console.log('🔔 Nova notificação recebida:', data);
        // Exibir toast, modal, ou salvar no estado global
    });

    socket.on('disconnect', () => {
        console.log('⚠️ Desconectado do servidor');
    });

    // // Emitir join imediatamente se já estiver conectado
    // if (socket.connected) {
    //     console.log('✅ Já conectado, emitindo join imediatamente');
    //     socket.emit('join', userId);
    // }

    // Ou aguardar conexão, se ainda não estiver
    socket.on('connect', () => {
        console.log('✅ Conectado ao servidor via socket');
        socket.emit('join', userId);
    });
};
