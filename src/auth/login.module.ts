import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { GoogleStrategy } from './utils/Strategies/GoogleStrategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwt } from './utils/Guards/RoleGuard';
import { TwitterStrategy1 } from './utils/Strategies/TwitterStrategy';
import { JwtStrategy } from './utils/Strategies/JwtStrategy';
import { JwtStrategyWithRT } from './utils/Strategies/RefreshTokenStrategy';

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
    TwitterStrategy1,
    JwtStrategy,
    JwtStrategyWithRT,
    AuthJwt,
    { provide: 'LOGIN_SERVICE', useClass: LoginService },
  ],
})
export class LoginModule {}
