'use server';
import { redis } from './kv';

// Function to read the JSON database
export async function readDatabase(fileName: string): Promise<any[]> {
  try {
    const data = await redis.get(fileName) as any[];
  return data ?? [];
  } catch (error) {
    console.log('read database failed',error);
    return []
  }  
}

// Function to write to the JSON database
export async function writeDatabase(data: any[], fileName: string): Promise<void> {
  await redis.set(fileName, data);
}
