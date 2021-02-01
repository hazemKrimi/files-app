import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { File } from './File';

@ObjectType({ description: 'User Model' })
export class User {
	@Field(() => ID)
	public id?: String;

	@Field()
	@prop({ required: true })
	public username?: string;

	@Field()
	@prop({ required: true })
	public email?: string;

	@prop({ required: true })
	public password?: string;

	@Field(() => [File])
	@prop({ ref: File, required: false })
	public files?: File[];
}

export const UserModel = getModelForClass(User);
