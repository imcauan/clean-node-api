import { Collection, MongoClient, ObjectId } from 'mongodb';

export type MongoHelperMapCollection<T> = T & { _id: ObjectId };

export const MongoHelper = {
  client: null as MongoClient | null,
  url: null as string | null,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url);
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
    this.client = null;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url);
    }

    return this.client.db().collection(name);
  },
  map<T>(collection: MongoHelperMapCollection<T>) {
    return {
      id: collection._id.toHexString(),
      ...collection,
    };
  },
};
