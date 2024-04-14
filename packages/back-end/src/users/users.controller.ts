import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  getUsers(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Post('login')
  // findAll(@Body() user: any) {
  //   const { username, password } = user;
  //   console.log(username, password);
  //   this.usersService.getUserByUsername(username);
  //   return 'This action returns all users';
  // }
}
