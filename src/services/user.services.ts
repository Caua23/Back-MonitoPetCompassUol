import { LoginUserDto } from './../dto/login.user.dto';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/models/users.models";
import * as argon2 from 'argon2';
import { CreateUserDto } from "src/dto/create.user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }
    async CreateUser(user: CreateUserDto): Promise<any> {
        try {
            if (!user.email || !user.password) return HttpException.createBody('Email and password are required', 'Bad Request', HttpStatus.BAD_REQUEST)
            const existingUser = await this.userModel.findOne({ email: user.email.toLowerCase() });

            if (existingUser) return HttpException.createBody('Email already exists', 'Bad Request', HttpStatus.BAD_REQUEST)
            const PasswordEncrypt = await argon2.hash(user.password);
            const newUser = new this.userModel({
                ...user,
                email: user.email.toLowerCase(),
                password: PasswordEncrypt,
            });

            const User = await newUser.save()
            const { password, ...userResponseBody } = User.toJSON();
            return {
                message: 'User created successfully',
                statusCode: HttpStatus.CREATED,
                redirect: '/user',
                data: userResponseBody,
            };
        } catch (error) {
            console.error(error);
            return HttpException.createBody(error, 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginUser(user: LoginUserDto): Promise<any> {
        try {
            if (!user.email || !user.password) return HttpException.createBody('Email and password are required', 'Bad Request', HttpStatus.BAD_REQUEST) 

            const userModel = await this.userModel.findOne({ email: user.email.toLowerCase() });
            if (!userModel) return HttpException.createBody('Email or password is incorrect', 'Bad Request', HttpStatus.BAD_REQUEST);

            const PasswordValid = await argon2.verify(userModel.password, user.password);
            if (!PasswordValid) return HttpException.createBody('Email or password is incorrect', 'Bad Request', HttpStatus.BAD_REQUEST);
            
            const { password, ...userResponseBody } = userModel.toJSON();
            return {
                message: 'Login successfully',
                statusCode: HttpStatus.OK,
                redirect: '/user',
                data: userResponseBody,
            };
        } catch (error) {
            console.error(error);
            return HttpException.createBody(error, 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
