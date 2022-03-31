import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PullService } from './pull.service';
import { CreatePullDto } from './dto/create-pull.dto';
import { UpdatePullDto } from './dto/update-pull.dto';
import { Crud } from '@nestjsx/crud';
import { Pull } from './entities/pull.entity';

@Crud({
  model: {
    type: Pull,
  },
})
@Controller('pull')
export class PullController {
  constructor(private readonly pullService: PullService) {}

  // @Post()
  // create(@Body() createPullDto: CreatePullDto) {
  //   return this.pullService.create(createPullDto);
  // }

  // @Get()
  // findAll() {
  //   return this.pullService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pullService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePullDto: UpdatePullDto) {
  //   return this.pullService.update(+id, updatePullDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pullService.remove(+id);
  // }
}
