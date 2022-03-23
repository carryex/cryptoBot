import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }

  async createOrUpdate(createUserDto: CreateUserDto) {
    const user = await this.repo.findOne({
      where: {
        chatId: createUserDto.chatId,
      },
    });
    if (user) {
      await this.repo.update(user.id, { ...createUserDto });
      return await this.repo.findOne({ id: user.id });
    }
    const newUser = this.repo.create(createUserDto);
    return await this.repo.save(newUser);
  }

  // async upsert(createUserDto: CreateUserDto) {
  //   const user = this.repo.create(createUserDto);
  //   await this.repo
  //     .createQueryBuilder()
  //     .insert()
  //     .into(User)
  //     .values(user)
  //     .onConflict(`("id") DO NOTHING`)
  //     .execute();
  // }
}
