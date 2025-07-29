import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'flow-app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', 
      logging: process.env.NODE_ENV === 'development', 
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      extra: {
        connectionLimit: 10,
        acquireConnectionTimeout: 60000,
        timeout: 60000,
        reconnect: true,
      },
    }),
    AuthModule,
    UsersModule,
    WorkflowsModule,
  ],
})
export class AppModule {}
