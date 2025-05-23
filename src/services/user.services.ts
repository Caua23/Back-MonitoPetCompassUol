import { LoginUserDto } from './../dto/login.user.dto';
import { BadRequestException, Injectable, InternalServerErrorException, HttpStatus } from "@nestjs/common";
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
            if (!user || !user.email || !user.password)
                throw new BadRequestException('Email and password are required');
            
            const existingUser = await this.userModel.findOne({ email: user.email.toLowerCase() });
            if (existingUser)
                throw new BadRequestException('Email already exists');
            
            
            const passwordEncrypted = await argon2.hash(user.password);
            const newUser = new this.userModel({
                ...user,
                email: user.email.toLowerCase(),
                password: passwordEncrypted,
            });

            const savedUser = await newUser.save();
            const { password, ...userResponseBody } = savedUser.toJSON();

            return {
                message: 'User created successfully',
                statusCode: HttpStatus.CREATED,
                redirect: '/user/' + savedUser._id,
                data: userResponseBody,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }

    async loginUser(user: LoginUserDto): Promise<any> {
        try {
            if (!user.email || !user.password)
                throw new BadRequestException('Email and password are required');
            console.log('usuário:', user);
            const userModel = await this.userModel.findOne({ email: user.email });
            if (!userModel)
                throw new BadRequestException('Email or password is incorrect');
            console.log('userModel:', userModel);

            if (userModel) {
                const passwordValid = await argon2.verify(userModel.password, user.password);
            }
            const { password, ...userResponseBody } = userModel.toJSON();

            return {
                message: 'Login successfully',
                statusCode: HttpStatus.OK,
                redirect: '/user/' + userResponseBody._id,
                data: userResponseBody,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}
