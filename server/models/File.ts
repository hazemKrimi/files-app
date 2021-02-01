import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType({ description: 'File Model' })
export class File {
	@Field(() => ID)
	public id?: String;

	@Field()
	@prop({ required: true })
	public name?: string;

	@Field()
	@prop({ required: true })
	public path?: string;
}

export const FileModel = getModelForClass(File);
