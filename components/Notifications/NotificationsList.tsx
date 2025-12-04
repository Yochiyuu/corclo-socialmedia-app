"use client";

import { markNotificationsAsRead } from "@/app/actions";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Heart, MessageCircle, UserPlus, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Image, ListGroup } from "react-bootstrap";

type NotificationType = {
  id: number;
  type: string;
  read: boolean;
  createdAt: Date;
  sender: { username: string; avatar: string | null };
  post?: { id: number; content: string | null; mediaUrl: string | null } | null;
  comment?: { content: string } | null;
};

export default function NotificationList({
  notifications,
}: {
  notifications: NotificationType[];
}) {
  useEffect(() => {
    const unreadExists = notifications.some((n) => !n.read);
    if (unreadExists) {
      markNotificationsAsRead();
    }
  }, [notifications]);

  if (notifications.length === 0) {
    return (
      <div className="text-center py-5 text-secondary">
        <p>Belum ada notifikasi.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "LIKE": return <Heart size={20} className="text-danger fill-danger" />;
      case "COMMENT": return <MessageCircle size={20} className="text-primary" />;
      case "REPLY": return <MessageSquare size={20} className="text-info" />;
      case "FOLLOW": return <UserPlus size={20} className="text-success" />;
      default: return <Heart size={20} />;
    }
  };

  const getMessage = (n: NotificationType) => {
    switch (n.type) {
      case "LIKE": return "menyukai postingan Anda.";
      case "COMMENT": return "mengomentari postingan Anda.";
      case "REPLY": return "membalas komentar Anda.";
      case "FOLLOW": return "mulai mengikuti Anda.";
      default: return "berinteraksi dengan Anda.";
    }
  };

  return (
    <ListGroup variant="flush" className="bg-transparent">
      {notifications.map((n) => (
        <ListGroup.Item
          key={n.id}
          className={`bg-transparent border-bottom border-secondary border-opacity-10 d-flex align-items-start gap-3 p-3 ${
            !n.read ? "bg-primary bg-opacity-10" : ""
          }`}
        >
          <div className="mt-1">{getIcon(n.type)}</div>
          
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-center gap-2 mb-1">
                <Link href={`/profile/${n.sender.username}`}>
                  <Image
                    src={n.sender.avatar || "/images/default-avatar.png"}
                    roundedCircle
                    width={32}
                    height={32}
                    style={{ objectFit: "cover" }}
                  />
                </Link>
                <span className="small">
                  <Link href={`/profile/${n.sender.username}`} className="fw-bold text-white text-decoration-none hover-underline">
                    {n.sender.username}
                  </Link>{" "}
                  <span className="text-secondary">{getMessage(n)}</span>
                </span>
              </div>
              <small className="text-secondary opacity-75" style={{ fontSize: '10px' }}>
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: idLocale })}
              </small>
            </div>

            {(n.post || n.comment) && n.type !== 'FOLLOW' && (
              <Link href={`/post/${n.post?.id}`} className="text-decoration-none">
                <div className="mt-2 p-2 rounded bg-dark border border-secondary border-opacity-25 text-secondary small">
                  {n.comment ? (
                    <span className="fst-italic">"{n.comment.content}"</span>
                  ) : n.post?.mediaUrl ? (
                    <span className="d-flex align-items-center gap-2">📷 Media Post</span>
                  ) : (
                    <span className="text-truncate d-block" style={{ maxWidth: '100%' }}>
                      {n.post?.content}
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}