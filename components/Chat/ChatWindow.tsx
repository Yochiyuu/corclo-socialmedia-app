"use client";

import {
  deleteMessage,
  editMessage,
  sendMessage,
  toggleMessageLike,
} from "@/app/actions";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Check,
  Edit2,
  Heart,
  Image as ImageIcon,
  MoreVertical,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Image, Modal, Spinner } from "react-bootstrap"; // Import Modal

const CustomToggle = React.forwardRef(
  ({ children, onClick }: any, ref: any) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: "pointer" }}
      className="text-secondary p-1"
    >
      {children}
    </div>
  )
);
CustomToggle.displayName = "CustomToggle";

type Message = {
  id: number;
  content: string | null;
  senderId: number;
  createdAt: Date;
  isEdited: boolean;
  mediaUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | null;
  sender: { username: string; avatar: string | null };
  likes: { userId: number }[];
};

export default function ChatWindow({
  conversationId,
  messages,
  currentUserId,
  otherUser,
}: {
  conversationId: number;
  messages: Message[];
  currentUserId: number;
  otherUser: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
}) {
  const [msgText, setMsgText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSending, setIsSending] = useState(false);

  // STATE UNTUK IMAGE VIEWER (MODAL)
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, editingId, previewUrl]);

  // Handle klik gambar untuk zoom
  const handleImageClick = (url: string) => {
    setModalImageUrl(url);
    setShowImageModal(true);
  };

  // ... (Logic Last Active, File Select, Clear File, Submit, Edit - TETAP SAMA) ...
  // Silakan copy dari kode sebelumnya untuk bagian handler-handler ini
  const lastMessageFromUser = [...messages]
    .reverse()
    .find((m) => m.senderId === otherUser.id);
  let lastActiveText = "Offline";
  if (lastMessageFromUser) {
    const timeAgo = formatDistanceToNow(
      new Date(lastMessageFromUser.createdAt),
      { addSuffix: true, locale: idLocale }
    );
    lastActiveText = `Aktif ${timeAgo}`;
  } else {
    lastActiveText = "Baru saja bergabung";
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() && !selectedFile) return;

    setIsSending(true);

    const formData = new FormData();
    formData.append("conversationId", conversationId.toString());
    if (msgText.trim()) formData.append("content", msgText);
    if (selectedFile) formData.append("media", selectedFile);

    setMsgText("");
    clearFile();

    await sendMessage(formData);
    setIsSending(false);
  };

  const handleStartEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.content || "");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editText.trim()) return;
    await editMessage(id, editText);
    setEditingId(null);
  };

  return (
    <>
      {/* Header */}
      <div
        className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center bg-dark"
        style={{ height: "70px" }}
      >
        <Link
          href={`/profile/${otherUser.username}`}
          className="d-flex align-items-center gap-3 text-decoration-none"
        >
          <div className="position-relative">
            <Image
              src={otherUser.avatar || "/images/default-avatar.png"}
              roundedCircle
              width={42}
              height={42}
              style={{ objectFit: "cover" }}
            />
            <div
              className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-dark"
              style={{ width: 10, height: 10 }}
            />
          </div>
          <div>
            <h6 className="fw-bold text-white mb-0">{otherUser.name}</h6>
            <small className="text-secondary" style={{ fontSize: "11px" }}>
              {lastActiveText}
            </small>
          </div>
        </Link>
      </div>

      {/* Messages Area */}
      <div
        className="flex-grow-1 overflow-auto p-3 custom-scrollbar d-flex flex-column gap-2"
        style={{ backgroundColor: "#000" }}
      >
        {messages.length === 0 && (
          <div className="text-center text-secondary my-auto">
            <small>Mulai percakapan dengan {otherUser.name}!</small>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const isLiked = msg.likes.length > 0;
          const hasMedia = msg.mediaUrl;

          return (
            <div
              key={msg.id}
              className={`d-flex w-100 ${
                isMe ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className="d-flex align-items-end gap-2"
                style={{ maxWidth: "85%" }}
              >
                {!isMe && (
                  <Image
                    src={msg.sender.avatar || "/images/default-avatar.png"}
                    roundedCircle
                    width={28}
                    height={28}
                    className="mb-1"
                    style={{ objectFit: "cover" }}
                  />
                )}

                <div
                  className={`position-relative group ${
                    isMe ? "order-2" : "order-1"
                  }`}
                >
                  {editingId === msg.id ? (
                    // ... (Blok Edit TETAP SAMA) ...
                    <div
                      className="bg-dark border border-secondary border-opacity-50 rounded-4 p-2"
                      style={{ minWidth: "200px" }}
                    >
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-black text-white border-0 text-sm mb-2"
                        style={{ fontSize: "0.9rem", resize: "none" }}
                      />
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="rounded-circle p-1"
                          onClick={() => setEditingId(null)}
                        >
                          <X size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          className="rounded-circle p-1 bg-purple-600 border-0"
                          onClick={() => handleSaveEdit(msg.id)}
                        >
                          <Check size={14} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-4 text-break position-relative overflow-hidden ${
                        isMe
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-dark border border-secondary border-opacity-25 text-white rounded-bl-none"
                      }`}
                      style={{
                        borderBottomRightRadius: isMe ? "4px" : "1rem",
                        borderBottomLeftRadius: isMe ? "1rem" : "4px",
                        padding: hasMedia ? "4px" : "12px 16px",
                      }}
                    >
                      {hasMedia && (
                        <div className={`mb-${msg.content ? "2" : "0"}`}>
                          {msg.mediaType === "VIDEO" ? (
                            <video
                              src={msg.mediaUrl!}
                              controls
                              className="img-fluid rounded-3"
                              style={{
                                maxHeight: "250px",
                                maxWidth: "280px",
                                width: "100%",
                                objectFit: "contain",
                                backgroundColor: "#000",
                              }}
                            />
                          ) : (
                            <img
                              src={msg.mediaUrl!}
                              alt="Media"
                              className="img-fluid rounded-3 cursor-pointer hover-opacity-90" // Tambahkan cursor pointer
                              style={{
                                maxHeight: "250px",
                                maxWidth: "280px",
                                width: "auto",
                                objectFit: "cover",
                              }}
                              onClick={() => handleImageClick(msg.mediaUrl!)} // Event klik
                            />
                          )}
                        </div>
                      )}

                      {msg.content && (
                        <div className={hasMedia ? "px-1 pb-1" : ""}>
                          <p
                            className="mb-1"
                            style={{ fontSize: "0.95rem", lineHeight: "1.4" }}
                          >
                            {msg.content}
                          </p>
                        </div>
                      )}

                      <div
                        className={`d-flex align-items-center gap-1 justify-content-end ${
                          hasMedia ? "px-1 pb-1" : ""
                        } ${isMe ? "text-white-50" : "text-secondary"}`}
                      >
                        {msg.isEdited && !hasMedia && (
                          <span
                            style={{ fontSize: "10px", fontStyle: "italic" }}
                          >
                            (diedit)
                          </span>
                        )}
                        <span style={{ fontSize: "10px" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {isLiked && (
                        <div
                          className="position-absolute bg-dark rounded-circle border border-dark d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: 20,
                            height: 20,
                            bottom: -8,
                            right: isMe ? "auto" : -8,
                            left: isMe ? -8 : "auto",
                            zIndex: 10,
                          }}
                        >
                          <Heart
                            size={12}
                            className="text-danger fill-danger"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`d-flex flex-column gap-1 ${
                    isMe
                      ? "order-1 align-items-end"
                      : "order-2 align-items-start"
                  }`}
                >
                  {/* ... (Dropdown & Like TETAP SAMA) ... */}
                  {isMe && !editingId && (
                    <Dropdown align={isMe ? "end" : "start"}>
                      <Dropdown.Toggle as={CustomToggle}>
                        <MoreVertical
                          size={14}
                          className="text-secondary opacity-50 hover-opacity-100"
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        variant="dark"
                        style={{ minWidth: "120px" }}
                      >
                        {msg.content && (
                          <Dropdown.Item
                            onClick={() => handleStartEdit(msg)}
                            className="small d-flex gap-2 align-items-center"
                          >
                            <Edit2 size={14} /> Edit Teks
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() => deleteMessage(msg.id)}
                          className="small d-flex gap-2 align-items-center text-danger"
                        >
                          <Trash2 size={14} /> Hapus
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {!editingId && (
                    <div
                      className="cursor-pointer p-1"
                      onClick={() => toggleMessageLike(msg.id)}
                    >
                      <Heart
                        size={14}
                        className={`transition-all ${
                          msg.likes.some((l) => l.userId === currentUserId)
                            ? "text-danger fill-danger"
                            : "text-secondary opacity-25 hover-opacity-100"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (TETAP SAMA) */}
      <div className="p-3 bg-dark border-top border-secondary border-opacity-25 position-relative">
        {previewUrl && (
          <div
            className="position-absolute bottom-100 start-0 m-3 p-2 bg-dark border border-secondary border-opacity-25 rounded-3 shadow-sm"
            style={{ zIndex: 10 }}
          >
            <div className="position-relative d-inline-block">
              {selectedFile?.type.startsWith("video") ? (
                <video
                  src={previewUrl}
                  className="rounded-3"
                  style={{ height: "80px" }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="rounded-3"
                  style={{ height: "80px" }}
                />
              )}
              <Button
                size="sm"
                variant="dark"
                className="position-absolute top-0 end-0 m-1 p-0 rounded-circle bg-black border-0 d-flex align-items-center justify-content-center"
                style={{ width: 20, height: 20 }}
                onClick={clearFile}
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="d-flex align-items-center gap-2 bg-black border border-secondary border-opacity-50 rounded-pill px-2 py-1">
            <Form.Control
              placeholder="Tulis pesan..."
              className="bg-transparent border-0 text-white shadow-none"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              disabled={isSending}
            />
            <label className="btn btn-link text-secondary p-2 hover-text-primary cursor-pointer d-flex align-items-center m-0">
              <ImageIcon size={20} />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                className="d-none"
                onChange={handleFileSelect}
              />
            </label>
            <Button
              variant="primary"
              type="submit"
              className="rounded-circle p-2 d-flex align-items-center justify-content-center"
              disabled={(!msgText.trim() && !selectedFile) || isSending}
              style={{
                backgroundColor: "#7c3aed",
                border: "none",
                width: "40px",
                height: "40px",
              }}
            >
              {isSending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Send size={18} className="ms-1" />
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* MODAL IMAGE VIEWER */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
        contentClassName="bg-transparent border-0"
      >
        <Modal.Body className="text-center p-0 position-relative">
          {modalImageUrl && (
            <img
              src={modalImageUrl}
              alt="Full View"
              className="img-fluid rounded-3"
              style={{
                maxHeight: "85vh",
                objectFit: "contain",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          )}
          <Button
            variant="dark"
            className="position-absolute top-0 end-0 m-3 rounded-circle"
            onClick={() => setShowImageModal(false)}
            style={{ backgroundColor: "rgba(0,0,0,0.5)", border: "none" }}
          >
            <X size={24} />
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}