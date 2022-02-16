import { CartItem } from './schemas/Cart';
import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { ProductImage } from './schemas/ProductImage';
import {insertSeedData} from './seed-data'
import { sendPasswordResetEmail } from './lib/mail';

const databaseUrl = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 1000,
  secret: process.env.SESSION_SECRET,
};

// auth config
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
  passwordResetLink:{
  async sendToken(args){
  console.log(args)
  await sendPasswordResetEmail(args.token,args.identity)
  },
  
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseUrl,
    },
    lists: createSchema({
      // TODO: screma goes here
      User,
      Product,
      ProductImage,
      CartItem
    }),
    ui: {
      // TODO: add ui config
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id name email',
    }),
  })
);
