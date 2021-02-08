import { GraphQLUpload } from 'graphql-upload';
import { Resolver, Mutation, Authorized, Arg, Ctx } from 'type-graphql';
import { File, FileModel } from '../models/File';
import { UserModel } from '../models/User';
import { Upload } from '../types/upload';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { AuthContext } from '../types/auth';

@Resolver()
export class FileResolver {
	@Authorized()
	@Mutation(() => File)
	async addFile(
		@Arg('file', () => GraphQLUpload) { createReadStream, filename }: Upload,
		@Ctx() { user: { id } }: AuthContext
	): Promise<File> {
		try {
			return new Promise(async resolve =>
				createReadStream()
					.pipe(createWriteStream(join(__dirname, '/../files/', filename)))
					.on('finish', async () => {
						const file = (await FileModel.create({
							name: filename,
							path: join(__dirname, '/../files/', filename)
						})) as File;
						await UserModel.findOneAndUpdate({ _id: id }, { $push: { files: file } });
						resolve(file);
					})
			);
		} catch (err) {
			throw err.message;
		}
	}
}
