import { PartialType } from '@nestjs/swagger';
import { CreatePullDto } from './create-pull.dto';

export class UpdatePullDto extends PartialType(CreatePullDto) {}
