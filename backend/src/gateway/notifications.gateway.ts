import { CreateNotificationDto } from '@/contracts/notification.dto';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/socket.io',
  serveClient: false,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);
  }

  sendNotification(userId: string, notification: any) {
    // Emitir para um usuário específico (baseado no userId)
    this.server.to(userId).emit('notification', { ...notification, timestamp: new Date().toISOString() });
  }

  joinUserRoom(client: Socket, userId: string) {
    client.join(userId); // Cliente entra na sala do usuário
    console.log(`Cliente ${client.id} entrou na sala: ${userId}`);
  }

  sendAddMemberNotification(notification: CreateNotificationDto) {
    notification.userId.map(user => this.sendNotification(user, notification))

  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    this.joinUserRoom(client, userId);
  }

}
