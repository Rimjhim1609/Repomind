import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { StreamClient } from '@stream-io/node-sdk';
import { auth } from "~/lib/auth";

const streamClient = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY || "demo_stream_key",
  process.env.STREAM_SECRET_KEY || "demo_stream_secret"
);

export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id ?? null;
    } catch {
      // Fallback
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const requestUserId = body.userId || userId;

    const token = streamClient.generateUserToken({ 
      user_id: requestUserId,
      validity_in_seconds: 3600
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}