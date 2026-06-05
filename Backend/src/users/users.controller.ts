<<<<<<< HEAD
import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {}
=======
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
>>>>>>> feat/crud-operations
