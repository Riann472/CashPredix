import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, PrismaModule, TransactionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }],
})
export class AppModule { }
