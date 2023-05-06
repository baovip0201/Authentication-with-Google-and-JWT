import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { User } from './models/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtModule: JwtService,
  ) {}

  async validateUser(user: User) {
    console.log(user);

    const isExistUser = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (isExistUser) {
      const payload = { userId: isExistUser.id, role: isExistUser.role };
      return {
        accessToken: await this.jwtModule.sign(payload),
      };
    }
    console.log('User not found, creating new user');
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    const payload = { userId: newUser.id, role: newUser.role };
    return {
      accessToken: await this.jwtModule.sign(payload),
    };
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }
}
