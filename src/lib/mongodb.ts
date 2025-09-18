import { Db, MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

// Preserve a single MongoClient instance in development to avoid exhausting connections
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function initClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable. Set it in .env (local) or in your hosting provider envs');
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise as Promise<MongoClient>;
  } else {
    client = new MongoClient(uri, options);
    return client.connect();
  }
}

export function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = initClient();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || 'kiosko-carlitos';
  return client.db(dbName);
}

