import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "~/lib/auth"
import { db } from "~/server/db"

type Props = {
    params: Promise<{projectId: string}>
}

const JoinHandler = async (props: Props) => {
    const { projectId } = await props.params
    let userId: string | null = null

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        userId = session?.user?.id ?? null
    } catch {
        // Fallback
    }

    if (!userId) {
        return redirect('/sign-in')
    }

    const project = await db.project.findUnique({
        where: { id: projectId },
    })

    if (!project) return redirect('/')

    try {
        await db.userToProject.create({
            data: {
                userId,
                projectId,
            },
        })
    } catch {
        console.log('user already in project')
    }

    return redirect(`/dashboard`)
}

export default JoinHandler