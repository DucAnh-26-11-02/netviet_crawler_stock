import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IIndicateInsight } from 'src/types/indicates.type';

@WebSocketGateway({ cors: true })
export class IndicateGetWay {
  @WebSocketServer()
  private readonly server: Server;

  sendUpdate(payload: IIndicateInsight): void {
    this.server.emit('market_update', payload);
  }
}
