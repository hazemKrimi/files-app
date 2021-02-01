import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { connect } from 'mongoose';
import { AuthChecker, buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/User';
import { AuthContext } from './types/auth';
import { auth } from './middleware/auth';

(async () => {
	try {
		const app = express();
		const PORT = process.env.PORT || 5000;
		const authChecker: AuthChecker<AuthContext> = ({ context: { user } }) => {
			if (!user) return false;
			return true;
		};
		const server = new ApolloServer({
			schema: await buildSchema({
				resolvers: [UserResolver],
				authChecker,
				validate: true
			}),
			context: ({ req }) => {
				const context = {
					req,
					user: req.user
				};
				return context;
			}
		});

		app.use(cors());
		app.use(auth);
		await connect('mongodb://localhost:27017/files-app', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('MongoDB connected');
		server.applyMiddleware({ app });
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	} catch (err) {
		console.error(err.message);
	}
})();
