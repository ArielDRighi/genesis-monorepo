import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.FREE,
  })
  plan: UserPlan = UserPlan.FREE;

  @Column({ type: 'integer', default: 0, name: 'projects_count' })
  projectsCount: number = 0;

  @Column({ type: 'boolean', default: false, name: 'free_project_used' })
  freeProjectUsed: boolean = false;

  @Column({ type: 'timestamp', nullable: true, name: 'quota_reset_date' })
  quotaResetDate: Date | null = null;

  @Column({ type: 'boolean', default: false, name: 'has_completed_onboarding' })
  hasCompletedOnboarding: boolean = false;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
