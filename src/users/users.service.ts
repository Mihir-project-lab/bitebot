import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async createUser(email: string, name: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new Error('User with this email already exists');
    }
    const newUser = this.userRepository.create({ email, name, password });
    return this.userRepository.save(newUser);
  }
}
