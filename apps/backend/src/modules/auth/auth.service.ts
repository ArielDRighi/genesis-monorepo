import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserPlan } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hashear password con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con plan FREE
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      plan: UserPlan.FREE,
      projectsCount: 0,
      freeProjectUsed: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: savedUser.id,
      email: savedUser.email,
    });

    // Retornar token y datos del usuario (sin password)
    return {
      access_token: token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        plan: savedUser.plan,
        projectsCount: savedUser.projectsCount,
        freeProjectUsed: savedUser.freeProjectUsed,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Retornar token y datos del usuario (sin password)
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        projectsCount: user.projectsCount,
        freeProjectUsed: user.freeProjectUsed,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // Retornar usuario sin password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
