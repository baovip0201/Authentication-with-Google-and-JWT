import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { User } from './models/user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from './role/role.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(user: User) {
    //console.log(user);

    const isExistUser = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (isExistUser) {
      const payload = { userId: isExistUser.id, role: isExistUser.role };
      const token = await this.getToken(payload);
      return token.accessToken;
    }
    console.log('User not found, creating new user');
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    const payload = { userId: newUser.id, role: newUser.role };
    const token = await this.getToken(payload);
    return token.accessToken;
  }

  async signUp(user: User) {
    const { password, ...userData } = user;
    const isExistingUser = await this.userRepository.findOneBy({
      username: userData.username,
      email: userData.email,
    });
    if (isExistingUser)
      throw new HttpException('User already exists', HttpStatus.FOUND);
    if (password !== userData.confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    const hashPassword = await bcrypt.hashSync(password, 10);
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser = await this.userRepository.create({
      password: hashPassword,
      ...userData,
      confirmationToken: token,
    });

    await this.userRepository.save(newUser);

    await this.mailService.sendUserConfirmation(userData, token);

    return { message: 'User created', data: newUser };
  }

  async confirmationUser(token: string) {
    const user = await this.userRepository.findOneBy({
      confirmationToken: token,
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.isVerified = true;
    user.confirmationToken = undefined;
    await this.userRepository.save(user);

    const payload = { userId: user.id, role: user.role };
    const newToken = await this.getToken(payload);
    return { message: 'Confirmation successful', data: newToken };
  }
  async signIn(username: string, password: string) {
    const isExistingUser = await this.userRepository.findOneBy({
      username: username,
    });
    if (!isExistingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isComparePassword = bcrypt.compareSync(
      password,
      isExistingUser.password,
    );

    if (!isComparePassword)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    const payload = { userId: isExistingUser.id, role: isExistingUser.role };
    const token = await this.getToken(payload);
    await this.userRepository.update(
      { id: isExistingUser.id },
      { refreshToken: token.refreshToken },
    );
    return { message: 'Success', data: token };
  }

  async refreshToken(id: any, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new ForbiddenException('Access denied');
    if (refreshToken !== user.refreshToken)
      throw new ForbiddenException('Access denied');

    const payload = { userId: user.id, role: user.role };
    const tokens = await this.getToken(payload);
    await this.userRepository.update(
      { id: id },
      { refreshToken: tokens.refreshToken },
    );
    return tokens;
  }
  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async getToken(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
