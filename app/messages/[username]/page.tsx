// app/messages/[username]/page.tsx

import { getMessagesByUsername } from "@/app/actions"; // Import fungsi baru
import ChatWindow from "@/components/Chat/ChatWindow";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cookieStore = await cookies();
  const currentUserId = parseInt(cookieStore.get("userId")?.value || "0");

  if (!currentUserId) redirect("/login");

  const data = await getMessagesByUsername(username);

  if (!data || !data.conversation) {
    // Jika user ada tapi belum pernah chat, redirect ke home atau buat tampilan "Mulai chat baru"
    // Untuk simplifikasi, kita anggap not found dulu atau bisa buat logic create on the fly di action
    return notFound();
  }

  const { conversation, targetUser } = data;

  return (
    <ChatWindow
      conversationId={conversation.id}
      messages={conversation.messages}
      currentUserId={currentUserId}
      otherUser={targetUser}
    />
  );
}