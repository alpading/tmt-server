import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { StaysModule } from './stays/stays.module';
import { ActivitiesModule } from './activities/activities.module';
import { PreferencesModule } from './preferences/preferences.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    RestaurantsModule,
    StaysModule,
    ActivitiesModule,
    PreferencesModule,
  ],
})
export class AppModule {}
