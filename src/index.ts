import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import 'reflect-metadata';
// import { Post } from './entities/Post';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import microConfig from './mikro-orm.config';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();
  app.listen(4000, () => {
    console.log('server started on localhost port 4000');
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    context: () => ({ em: orm.em })
  });

  apolloServer.applyMiddleware({ app });
  //   const post = orm.em.create(Post, { title: 'my first post.' });
  //   orm.em.persistAndFlush(post);
};

main();

console.log('hello there');
