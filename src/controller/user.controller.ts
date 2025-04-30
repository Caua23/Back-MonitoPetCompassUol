import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/dto/create.user.dto";
import { LoginUserDto } from "src/dto/login.user.dto";
import { UserService } from "src/services/user.services";

@Controller('user')
export class controllerUserModule {
    constructor(private readonly userService: UserService) {
        
    }
    
    @Post('auth/login')
    async login(@Body() user: LoginUserDto) {
        return this.userService.loginUser(user);
    }
    @Post('auth/signUp')
    async signUp(@Body() user: CreateUserDto) {
        return this.userService.CreateUser(user);
    }
}