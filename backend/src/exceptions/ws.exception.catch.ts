import { ArgumentsHost, Catch } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class JwtUnauthFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const context = host.switchToWs();
    const client = context.getClient();

    client.emit('error', {
      status: 'error',
      message: 'Unauthorized Access',
    });
  }
}
