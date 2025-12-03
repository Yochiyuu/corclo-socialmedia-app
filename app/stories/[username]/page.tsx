import StoryViewer from "@/components/Story/StoryViewer";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { username } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  // Ambil user beserta story aktifnya
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      stories: {
        where: {
          expiresAt: { gt: new Date() }, // Hanya ambil yg belum expired
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!user || user.stories.length === 0) {
    return redirect("/home"); // Balik ke home jika tidak ada story
  }

  return <StoryViewer stories={user.stories} user={user} />;
}