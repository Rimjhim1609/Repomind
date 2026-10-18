import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processMeeting } from "~/lib/assemblyAi";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const bodyParser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string(),
});

export async function POST(req: NextRequest) {
    let userId: string | null = null;
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        userId = session?.user?.id ?? null;
    } catch {
        // Fallback
    }

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { meetingUrl, meetingId } = bodyParser.parse(body);
        const { summaries } = await processMeeting(meetingUrl);
        await db.issue.createMany({
            data: summaries.map(summary => ({
                start: summary.start,
                end: summary.end,
                gist: summary.gist,
                headline: summary.headline,
                summary: summary.summary,
                meetingId,
            })),
        });

        await db.meeting.update({
            where: {
                id: meetingId,
            },
            data: {
                status: 'COMPLETED',
                name: summaries[0] ? summaries[0].headline : 'Default',
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}