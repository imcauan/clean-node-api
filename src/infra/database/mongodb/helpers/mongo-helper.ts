import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient | null,
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      throw new Error('MongoDB not connected');
    }

    return this.client.db().collection(name);
  },
};
