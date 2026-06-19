import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const { name, email, phone, password } = dto;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
