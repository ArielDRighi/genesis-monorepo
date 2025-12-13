import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserPlan } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return current user data', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getMe({ id: mockUser.id });

      expect(result).toBeDefined();
      expect(usersService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateMe', () => {
    it('should update current user and return updated data', async () => {
      const updateDto: UpdateUserDto = { hasCompletedOnboarding: true };
      const updatedUser = { ...mockUser, hasCompletedOnboarding: true };

      usersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateMe({ id: mockUser.id }, updateDto);

      expect(result).toBeDefined();
      expect(usersService.updateUser).toHaveBeenCalledTimes(1);
    });
  });
});
