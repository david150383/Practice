import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';

// Define interface in the same file
interface User {
  id: number;
  name: string;
}

@Controller('users')
export class AppController {

  users: User[] = [
    { id: 1, name: 'mohan' }
  ];

  @Get()
  getUsers(): User[] {
    return this.users;
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user
    };

    this.users.push(newUser);

    return newUser;
  }
}