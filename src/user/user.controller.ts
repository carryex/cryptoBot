import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Crud } from '@nestjsx/crud';
import { User } from './entities/user.entity';

@Crud({
  model: {
    type: User,
  },
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
