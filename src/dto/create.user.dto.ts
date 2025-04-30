import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message: 'Password must contain at least one letter and one number, and be at least 6 characters long',
    })
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
} 