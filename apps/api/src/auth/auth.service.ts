import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';

export type PublicUser = Omit<User, 'passwordHash'>;

function toIsoDate(usDate: string): string {
  const [month, day, year] = usDate.split('/');
  return `${year}-${month}-${day}`;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async signup(dto: SignupDto): Promise<PublicUser> {
    const username = dto.username.trim().toLowerCase();
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      throw new ConflictException(`An account with this ${field} already exists.`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      fullName: dto.fullName.trim(),
      phoneNumber: dto.phoneNumber.trim(),
      gender: dto.gender ?? null,
      dateOfBirth: toIsoDate(dto.dateOfBirth),
      avatarUri: dto.avatarUri ?? null,
      country: dto.country ?? null,
      cookingLevel: dto.cookingLevel ?? null,
      cuisines: dto.cuisines ?? [],
      dietary: dto.dietary ?? [],
      username,
      email,
      passwordHash,
    });

    const saved = await this.usersRepository.save(user);
    return this.toPublicUser(saved);
  }

  private toPublicUser(user: User): PublicUser {
    const publicUser: Partial<User> = { ...user };
    delete publicUser.passwordHash;
    return publicUser as PublicUser;
  }
}
