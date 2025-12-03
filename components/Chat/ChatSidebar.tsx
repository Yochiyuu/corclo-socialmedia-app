// components/Chat/ChatSidebar.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Image } from "react-bootstrap";

export default function ChatSidebar({
  conversations,
}: {
  conversations: any[];
}) {
  const params = useParams();
  const activeUsername = params.username as string; // Ambil username dari URL

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-secondary">
        <small>Belum ada percakapan.</small>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column">
      {conversations.map((conv) => {
        const otherUser = conv.participants[0];
        const lastMessage = conv.messages[0];
        // Cek aktif berdasarkan username
        const isActive = activeUsername === otherUser.username;

        return (
          <Link
            key={conv.id}
            href={`/messages/${otherUser.username}`} // Link ke username
            className={`text-decoration-none p-3 d-flex align-items-center gap-3 transition-all ${
              isActive ? "bg-primary bg-opacity-10" : "hover-bg-opacity"
            }`}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Image
              src={otherUser.avatar || "/images/default-avatar.png"}
              roundedCircle
              width={48}
              height={48}
              style={{ objectFit: "cover" }}
            />
            <div className="overflow-hidden w-100">
              <div className="d-flex justify-content-between align-items-center">
                <h6
                  className={`mb-0 text-white text-truncate ${
                    isActive ? "fw-bold" : ""
                  }`}
                  style={{ maxWidth: "120px" }}
                >
                  {otherUser.name}
                </h6>
                {lastMessage && (
                  <span className="text-secondary" style={{ fontSize: "10px" }}>
                    {new Date(lastMessage.createdAt).toLocaleDateString([], {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
              <small className="text-secondary d-block text-truncate">
                {lastMessage
                  ? (lastMessage.senderId !== otherUser.id ? "Anda: " : "") +
                    (lastMessage.mediaUrl
                      ? lastMessage.mediaType === "VIDEO"
                        ? "🎥 Video"
                        : "📷 Foto"
                      : lastMessage.content)
                  : "Mulai percakapan baru"}
              </small>
            </div>
          </Link>
        );
      })}
    </div>
  );
}