import { Collection, MongoClient, ObjectId } from 'mongodb';

type MongoHelperMapCollection<T> = T & { _id: ObjectId };

export const MongoHelper = {
  client: null as MongoClient | null,
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
  },
  async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name);
  },
  map<T>(collection: MongoHelperMapCollection<T>) {
    return {
      id: collection._id.toHexString(),
      ...collection,
    };
  },
};
