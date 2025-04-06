import { Module } from '@nestjs/common';
import { EstatisticaService } from './estatistica.service';
import { EstatisticaController } from './estatistica.controller';

@Module({
  controllers: [EstatisticaController],
  providers: [EstatisticaService],
})
export class EstatisticaModule {}
