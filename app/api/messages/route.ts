import { NextResponse } from "next/server";
import { readMessages, addMessage } from "@/app/actions/message";

export async function GET() {
    const messages = await readMessages();
    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    const data = await request.json();
    await addMessage(data);
    return NextResponse.json(data);
}