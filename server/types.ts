import { Field, ObjectType, ArgsType } from 'type-graphql';
import { IsEmail, MinLength } from 'class-validator';
import { User } from './models/User';

@ArgsType()
export class SignupArgs {
	@Field()
	public username?: string;

	@Field()
	@IsEmail()
	public email?: string;

	@Field()
	@MinLength(6)
	public password?: string;
}

@ArgsType()
export class LoginArgs {
	@Field()
	@IsEmail()
	public email?: string;

	@Field()
	@MinLength(6)
	public password?: string;
}

@ObjectType({ description: 'Signup response data' })
export class UserData {
	@Field()
	public user?: User;

	@Field()
	public token?: String;
}
