import { Exclude, Expose } from 'class-transformer';
import { UserPlan } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Exclude()
  password!: string;

  @Expose()
  plan!: UserPlan;

  @Expose()
  projectsCount!: number;

  @Expose()
  freeProjectUsed!: boolean;

  @Expose()
  quotaResetDate!: Date | null;

  @Expose()
  hasCompletedOnboarding!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
