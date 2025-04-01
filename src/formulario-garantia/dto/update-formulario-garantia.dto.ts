import { PartialType } from '@nestjs/mapped-types';
import { CreateFormularioGarantiaDto } from './create-formulario-garantia.dto';

export class UpdateFormularioGarantiaDto extends PartialType(CreateFormularioGarantiaDto) {}
