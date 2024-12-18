import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [UsersModule,MongooseModule.forRoot('mongodb+srv://jbautistapulido:nSf698KVJfWvF92B@cluster0.tuza9.mongodb.net/Inlaze?retryWrites=true&w=majority&appName=Cluster0')],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
