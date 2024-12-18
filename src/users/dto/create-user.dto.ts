import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    readonly name: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @MinLength(6)
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    readonly phone: string

}
