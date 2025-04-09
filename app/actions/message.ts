'use server'
import { readDatabase, writeDatabase } from '@/lib/dbOperations';
import { revalidatePath } from 'next/cache';

export async function addMessage(data: {name:string,email:string,message:string,phone:string})  {
    try {
        const {name,message,phone,email} = data
        const messages = await readDatabase('messages')
        messages.push({id:Date.now().toString(), name, email, message,phone,createdAt : new Date().toISOString() });
        await writeDatabase(messages,'messages');
        return { success: true, message: 'Message sent successfully' };
    } catch (error) {
        console.error('Error adding message:', error);
        return { success: false, message: 'Failed to add message' };
    }
}

export async function readMessages() {
    try {
        const messages = await readDatabase('messages')
        return messages
    } catch (error) {
        console.error('Error reading message:', error);
        return { success: false, message: 'Failed to read message' };
    }
}

export async function deleteMessage(id:string) {
    const messages = await readDatabase('messages');
    const updatedMessages = messages.filter((message) => message.id !== id);
    await writeDatabase(updatedMessages, 'messages');
}