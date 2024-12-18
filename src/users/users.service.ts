import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

type Tokens = {
  access_token: string,
  refresh_token: string
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>, private jwtSvc: JwtService){}
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
  
      const { access_token, refresh_token } = await this.generateTokens(savedUser);
  
      return {
        access_token,
        refresh_token,
        user: this.removePassword(savedUser), 
        status: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async loginUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
      }
      if(user && isMatch){
        const {access_token, refresh_token} = await this.generateTokens(user)
        const payload = { sub: user._id, email: user.email, name: user.name };

        return {
          access_token,
          refresh_token,
          user: this.removePassword(user),
          message: 'Login Successful'

        }
      }  
      
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
    }
  }
  

  async refreshToken(refreshToken: string){
    try{
      const user = this.jwtSvc.verify(refreshToken, {secret: 'jwt_secret_refresh'})
      const payload = { sub: user._id, email: user.email, name: user.name };
      const {access_token, refresh_token} = await this.generateTokens(payload)
      return {
        access_token, 
        refreshToken,
        status: 200,
        message: 'Refresh token succesfuly'
      };


    } catch(error){
      throw new HttpException('Refresh token failed', HttpStatus.UNAUTHORIZED)
    }
  }

  private async generateTokens(user):Promise<Tokens>{
    const jwtPayload = { sub: user._id, email: user.email, name: user.name };
    
    const [accessToken, refresh_token] = await Promise.all([
      
      this.jwtSvc.signAsync(jwtPayload,{
        secret: 'jwt_secret',
        expiresIn: '1d'
      }),

      this.jwtSvc.signAsync(jwtPayload,{
        secret: 'jwt_secret_refresh',
        expiresIn: '7d'
      
      })
    ])
    return{
      access_token: accessToken,
      refresh_token: refresh_token
    }
  }

  private removePassword(user){
    const {password, ...rest} = user.toObject();
    return rest;
  }

}
