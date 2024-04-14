import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(registerUserDto: RegisterUserDto) {
    return this.userRepository.insert(registerUserDto);
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    return {
      username: user.username,
      nickname: user.nickname,
    };
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({
      username: username,
    });
    return user;
  }
}
