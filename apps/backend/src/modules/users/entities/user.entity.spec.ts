import { User, UserPlan } from './user.entity';

describe('User Entity', () => {
  describe('Entity Creation', () => {
    it('should create a user entity with default values', () => {
      const user = new User();

      expect(user).toBeDefined();
      expect(user.plan).toBe(UserPlan.FREE);
      expect(user.projectsCount).toBe(0);
      expect(user.freeProjectUsed).toBe(false);
      expect(user.tasksCount).toBe(0);
      expect(user.hasCompletedOnboarding).toBe(false);
    });

    it('should allow setting all properties', () => {
      const user = new User();
      const now = new Date();

      user.id = '550e8400-e29b-41d4-a716-446655440000';
      user.email = 'test@example.com';
      user.password = 'hashedPassword123';
      user.plan = UserPlan.PRO;
      user.projectsCount = 5;
      user.freeProjectUsed = true;
      user.tasksCount = 100;
      user.quotaResetDate = now;
      user.hasCompletedOnboarding = true;
      user.createdAt = now;
      user.updatedAt = now;

      expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedPassword123');
      expect(user.plan).toBe(UserPlan.PRO);
      expect(user.projectsCount).toBe(5);
      expect(user.freeProjectUsed).toBe(true);
      expect(user.tasksCount).toBe(100);
      expect(user.quotaResetDate).toBe(now);
      expect(user.hasCompletedOnboarding).toBe(true);
      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });
  });

  describe('UserPlan Enum', () => {
    it('should have all expected plan values', () => {
      expect(UserPlan.FREE).toBe('FREE');
      expect(UserPlan.BASIC).toBe('BASIC');
      expect(UserPlan.PRO).toBe('PRO');
    });

    it('should contain exactly 3 plans', () => {
      const planValues = Object.values(UserPlan);
      expect(planValues).toHaveLength(3);
      expect(planValues).toContain('FREE');
      expect(planValues).toContain('BASIC');
      expect(planValues).toContain('PRO');
    });
  });

  describe('Default Values', () => {
    it('should have plan defaulting to FREE', () => {
      const user = new User();
      expect(user.plan).toBe(UserPlan.FREE);
    });

    it('should have projectsCount defaulting to 0', () => {
      const user = new User();
      expect(user.projectsCount).toBe(0);
    });

    it('should have freeProjectUsed defaulting to false', () => {
      const user = new User();
      expect(user.freeProjectUsed).toBe(false);
    });

    it('should have tasksCount defaulting to 0', () => {
      const user = new User();
      expect(user.tasksCount).toBe(0);
    });

    it('should have hasCompletedOnboarding defaulting to false', () => {
      const user = new User();
      expect(user.hasCompletedOnboarding).toBe(false);
    });

    it('should have quotaResetDate defaulting to null', () => {
      const user = new User();
      expect(user.quotaResetDate).toBeNull();
    });
  });
});
