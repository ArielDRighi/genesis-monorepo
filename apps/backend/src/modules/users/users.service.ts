import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserPlan } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updatePlan(userId: string, plan: UserPlan, quotaResetDate: Date): Promise<User> {
    const user = await this.findById(userId);

    user.plan = plan;
    user.quotaResetDate = quotaResetDate;

    return this.userRepository.save(user);
  }

  async incrementProjectCount(userId: string): Promise<User> {
    // Use atomic increment to avoid race conditions
    await this.userRepository.increment({ id: userId }, 'projectsCount', 1);
    return this.findById(userId);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);

    // Explicitly set only allowed fields to prevent security issues
    if (typeof updateUserDto.hasCompletedOnboarding !== 'undefined') {
      user.hasCompletedOnboarding = updateUserDto.hasCompletedOnboarding;
    }

    return this.userRepository.save(user);
  }
}
