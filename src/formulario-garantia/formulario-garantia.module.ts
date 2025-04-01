import { Module } from '@nestjs/common';
import { FormularioGarantiaService } from './formulario-garantia.service';
import { FormularioGarantiaController } from './formulario-garantia.controller';

@Module({
  controllers: [FormularioGarantiaController],
  providers: [FormularioGarantiaService],
})
export class FormularioGarantiaModule {}
