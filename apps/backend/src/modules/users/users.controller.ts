import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: { sub: string }) {
    const userData = await this.usersService.findById(user.sub);
    return plainToInstance(UserResponseDto, userData, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: { sub: string }, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(user.sub, updateUserDto);
    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
