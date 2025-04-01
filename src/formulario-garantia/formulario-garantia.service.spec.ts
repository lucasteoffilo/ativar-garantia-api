import { Test, TestingModule } from '@nestjs/testing';
import { FormularioGarantiaService } from './formulario-garantia.service';

describe('FormularioGarantiaService', () => {
  let service: FormularioGarantiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormularioGarantiaService],
    }).compile();

    service = module.get<FormularioGarantiaService>(FormularioGarantiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
