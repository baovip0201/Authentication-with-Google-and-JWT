import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwt } from './utils/AuthJwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [LoginController],
  providers: [
    GoogleStrategy,
    AuthJwt,
    { provide: 'LOGIN_SERVICE', useClass: LoginService },
  ],
})
export class LoginModule {}
