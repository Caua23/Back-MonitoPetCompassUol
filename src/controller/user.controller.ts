import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "src/dto/create.user.dto";
import { LoginUserDto } from "src/dto/login.user.dto";
import { UserService } from "src/services/user.services";

@Controller('user')
export class UserController {  
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Login a user' }) 
    @ApiResponse({ status: 200, description: 'Login successful', type: String })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' }) 
    @Post('auth/login')
    async login(@Body() user: LoginUserDto) {
        return this.userService.loginUser(user);
    }

    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully', type: String })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Post('auth/signUp')
    async signUp(@Body() user: CreateUserDto) {
        return this.userService.CreateUser(user);
    }
}
