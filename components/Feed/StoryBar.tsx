"use client";

import { createStory } from "@/app/actions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Image, Spinner } from "react-bootstrap";
import { useFormStatus } from "react-dom";

type StoryUser = {
  username: string;
  avatar: string | null;
};

function AddStoryButton() {
  const { pending } = useFormStatus();
  return (
    <div
      className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center border border-dark"
      style={{ width: 20, height: 20, cursor: "pointer", zIndex: 10, right: 0 }}
    >
      {pending ? (
        <Spinner
          animation="border"
          size="sm"
          variant="light"
          style={{ width: 10, height: 10, borderWidth: 1 }}
        />
      ) : (
        <Plus className="text-white" size={12} />
      )}
    </div>
  );
}

export default function StoryBar({
  currentUser,
  usersWithStories,
}: {
  currentUser: { avatar: string | null };
  usersWithStories: StoryUser[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      formRef.current?.requestSubmit();
    }
  };

  // Ukuran standar untuk konsistensi (Outer Ring)
  const OUTER_SIZE = 66;
  const INNER_SIZE = 60;

  return (
    <div className="d-flex gap-4 overflow-auto pb-3 mb-2 no-scrollbar align-items-start px-2">
      {/* 1. Tombol Add Story (Kiri) */}
      <div
        className="text-center cursor-pointer"
        style={{ minWidth: `${OUTER_SIZE}px` }}
      >
        <form action={createStory} ref={formRef}>
          <label className="position-relative d-inline-block cursor-pointer">
            <input
              type="file"
              name="media"
              accept="image/*,video/*"
              className="d-none"
              onChange={handleFileChange}
            />
            {/* Wrapper agar ukuran sama dengan story teman */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: OUTER_SIZE,
                height: OUTER_SIZE,
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="position-relative">
                <Image
                  src={currentUser.avatar || "/images/default-avatar.png"}
                  roundedCircle
                  width={INNER_SIZE}
                  height={INNER_SIZE}
                  alt="My Story"
                  style={{ objectFit: "cover", opacity: 0.9 }}
                />
                <AddStoryButton />
              </div>
            </div>
          </label>
        </form>
        <small
          className="d-block mt-2 text-secondary small text-truncate"
          style={{ fontSize: "11px", maxWidth: `${OUTER_SIZE}px` }}
        >
          Cerita Anda
        </small>
      </div>

      {/* 2. List Story Teman (Kanan) */}
      {usersWithStories.map((user, idx) => (
        <Link
          href={`/stories/${user.username}`}
          key={idx}
          className="text-decoration-none"
        >
          <div className="text-center" style={{ minWidth: `${OUTER_SIZE}px` }}>
            {/* Gradient Ring Wrapper */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle p-[2px]"
              style={{
                width: OUTER_SIZE,
                height: OUTER_SIZE,
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
            >
              {/* Inner Circle (Black Border) */}
              <div
                className="bg-black rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "100%", height: "100%" }}
              >
                <Image
                  src={user.avatar || "/images/default-avatar.png"}
                  roundedCircle
                  width={INNER_SIZE}
                  height={INNER_SIZE}
                  alt={user.username}
                  style={{ objectFit: "cover", border: "2px solid #000" }}
                />
              </div>
            </div>
            <small
              className="d-block mt-2 text-white text-truncate"
              style={{ fontSize: "11px", maxWidth: `${OUTER_SIZE}px` }}
            >
              {user.username}
            </small>
          </div>
        </Link>
      ))}
    </div>
  );
}