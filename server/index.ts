import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { connect } from 'mongoose';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/User';

(async () => {
	try {
		const app = express();
		const PORT = process.env.PORT || 5000;
		const schema = await buildSchema({
			resolvers: [UserResolver],
			validate: true
		});
		const server = new ApolloServer({
			schema
		});

		app.use(cors());
		await connect('mongodb://localhost:27017/filesApp', {
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
