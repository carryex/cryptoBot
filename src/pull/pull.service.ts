import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreatePullDto } from './dto/create-pull.dto';
import { UpdatePullDto } from './dto/update-pull.dto';
import { Pull, PullStatus } from './entities/pull.entity';

@Injectable()
export class PullService extends TypeOrmCrudService<Pull> {
  constructor(@InjectRepository(Pull) repo) {
    super(repo);
  }

  get(id: number) {
    return this.repo.findOne(id, { relations: ['orders'] });
  }

  async getActivePull() {
    return await this.repo.findOne({ status: PullStatus.FORMERING });
  }

  create(createPullDto: CreatePullDto) {
    const pull = this.repo.create(createPullDto);
    return this.repo.save(pull);
  }

  async getOrCreatePull() {
    const pull = await this.getActivePull();
    if (pull) {
      return pull;
    }
    console.log(pull);
    const createPullDto: CreatePullDto = {};
    return await this.create(createPullDto);
  }

  update(id: number, updatePullDto: UpdatePullDto) {
    return this.repo.update(id, updatePullDto);
  }

  // findAll() {
  //   return `This action returns all pull`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} pull`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} pull`;
  // }
}
