import { Test, TestingModule } from '@nestjs/testing';
import { FormularioGarantiaController } from './formulario-garantia.controller';
import { FormularioGarantiaService } from './formulario-garantia.service';

describe('FormularioGarantiaController', () => {
  let controller: FormularioGarantiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormularioGarantiaController],
      providers: [FormularioGarantiaService],
    }).compile();

    controller = module.get<FormularioGarantiaController>(FormularioGarantiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
