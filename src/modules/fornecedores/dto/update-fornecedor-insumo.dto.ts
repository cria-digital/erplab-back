import { PartialType } from '@nestjs/swagger';
import { CreateFornecedorInsumoDto } from './create-fornecedor-insumo.dto';

export class UpdateFornecedorInsumoDto extends PartialType(
  CreateFornecedorInsumoDto,
) {}
