import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable. Set it in .env.local');
}

const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Preserve a single MongoClient instance in development to avoid exhausting connections
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
