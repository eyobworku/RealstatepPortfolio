'use server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

// Function to read the JSON database
export async function readDatabase(fileName: string): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), `models/${fileName}`);
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Function to write to the JSON database
export async function writeDatabase(data: any[], fileName: string): Promise<void> {
  const filePath = path.join(process.cwd(), `models/${fileName}`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}
