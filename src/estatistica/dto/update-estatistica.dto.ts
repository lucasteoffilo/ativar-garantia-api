import { PartialType } from '@nestjs/mapped-types';
import { CreateEstatisticaDto } from './create-estatistica.dto';

export class UpdateEstatisticaDto extends PartialType(CreateEstatisticaDto) {}
