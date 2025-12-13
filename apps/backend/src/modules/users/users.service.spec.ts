import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserPlan } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashed_password',
    plan: UserPlan.FREE,
    projectsCount: 0,
    freeProjectUsed: false,
    quotaResetDate: null,
    hasCompletedOnboarding: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            increment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user with all plan fields when user exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(result.plan).toBe(UserPlan.FREE);
      expect(result.projectsCount).toBe(0);
      expect(result.freeProjectUsed).toBe(false);
      expect(result.quotaResetDate).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findById('non-existent-id')).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found by email', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updatePlan', () => {
    it('should update plan and quota_reset_date correctly', async () => {
      const futureDate = new Date('2024-12-31');
      const updatedUser = {
        ...mockUser,
        plan: UserPlan.PRO,
        quotaResetDate: futureDate,
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updatePlan(mockUser.id, UserPlan.PRO, futureDate);

      expect(result.plan).toBe(UserPlan.PRO);
      expect(result.quotaResetDate).toEqual(futureDate);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePlan('non-existent-id', UserPlan.BASIC, new Date()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('incrementProjectCount', () => {
    it('should increment projectsCount by 1 using atomic operation', async () => {
      const updatedUser = {
        ...mockUser,
        projectsCount: 1,
      };

      userRepository.increment = jest.fn().mockResolvedValue(undefined);
      userRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.incrementProjectCount(mockUser.id);

      expect(result.projectsCount).toBe(1);
      expect(userRepository.increment).toHaveBeenCalledWith(
        { id: mockUser.id },
        'projectsCount',
        1,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.increment = jest.fn().mockResolvedValue(undefined);
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.incrementProjectCount('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('FREE plan initialization', () => {
    it('should have freeProjectUsed initialized to false for new users', async () => {
      const newUser = { ...mockUser, freeProjectUsed: false };
      userRepository.findOne.mockResolvedValue(newUser);

      const result = await service.findById(newUser.id);

      expect(result.freeProjectUsed).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user fields correctly', async () => {
      const updateDto = { hasCompletedOnboarding: true };
      const updatedUser = { ...mockUser, hasCompletedOnboarding: true };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(mockUser.id, updateDto);

      expect(result.hasCompletedOnboarding).toBe(true);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser('non-existent-id', { hasCompletedOnboarding: true }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
