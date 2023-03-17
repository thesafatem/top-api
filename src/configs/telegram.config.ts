import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('Telegram token is not defined');
  }
  return {
    token: token,
    chatId: configService.get('CHAT_ID') ?? '',
  };
};
