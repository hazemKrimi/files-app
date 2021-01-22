import { sign } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcrypt';
import { Resolver, Mutation, Args, Query } from 'type-graphql';
import { User, UserModel } from '../models/User';
import { UserData, SignupArgs, LoginArgs } from '../types';

@Resolver()
export class UserResolver {
	@Mutation(() => UserData)
	async signup(@Args() { username, email, password }: SignupArgs): Promise<UserData> {
		try {
			const userExist = (await UserModel.findOne({ email })) as User;
			if (!!userExist) throw new Error('User already exists');
			const salt = await genSalt(10);
			const passwordHash = await hash(password, salt);
			const user = await UserModel.create({ username, email, password: passwordHash });
			const token = sign({ id: user.id }, 'SECRET');
			await user.save();
			return { user, token };
		} catch (err) {
			throw err.message;
		}
	}

	@Query(() => [User])
	async getUsers(): Promise<User[]> {
		try {
			return await UserModel.find();
		} catch (err) {
			throw err.message;
		}
	}

	@Mutation(() => UserData)
	async login(@Args() { email, password }: LoginArgs): Promise<UserData> {
		try {
			const user = (await UserModel.findOne({ email })) as User;
			if (!user) throw new Error('User does not exist');
			const match = await compare(password, user.password as string);
			if (!match) throw new Error('Incorrect password');
			const token = sign({ id: user.id }, 'SECRET');
			return { user, token };
		} catch (err) {
			throw err.message;
		}
	}
}
