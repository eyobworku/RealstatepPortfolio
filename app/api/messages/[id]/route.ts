import { deleteMessage } from "@/app/actions/message";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deleteMessage(id);
    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { message: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
