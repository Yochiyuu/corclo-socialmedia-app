"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

type Story = {
  id: number;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  createdAt: Date;
};

type User = {
  username: string;
  avatar: string | null;
  name: string;
};

export default function StoryViewer({
  stories,
  user,
}: {
  stories: any[];
  user: User;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const currentStory = stories[currentIndex];
  const DURATION = 5000; // 5 detik per story

  // Timer Logic
  useEffect(() => {
    setProgress(0);
    const intervalTime = 50;
    const step = 100 / (DURATION / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push("/home"); // Selesai, balik ke home
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-black vh-100 vw-100 position-relative d-flex align-items-center justify-content-center">
      {/* === BUTTON NAVIGATION (DESKTOP) === */}

      {/* Tombol Previous (Kiri) - Hanya muncul jika bukan story pertama */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="position-absolute btn text-white d-none d-md-flex align-items-center justify-content-center p-0"
          style={{
            zIndex: 50,
            left: "calc(50% - 280px)", // Geser ke kiri dari tengah container (240px + 40px margin)
            width: "40px",
            height: "40px",
            transform: "translateX(-100%)",
          }}
        >
          <div className="bg-secondary bg-opacity-50 p-2 rounded-circle hover-bg-opacity d-flex">
            <ChevronLeft size={24} />
          </div>
        </button>
      )}

      {/* Tombol Next (Kanan) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="position-absolute btn text-white d-none d-md-flex align-items-center justify-content-center p-0"
        style={{
          zIndex: 50,
          right: "calc(50% - 280px)", // Geser ke kanan dari tengah container
          width: "40px",
          height: "40px",
          transform: "translateX(100%)",
        }}
      >
        <div className="bg-secondary bg-opacity-50 p-2 rounded-circle hover-bg-opacity d-flex">
          <ChevronRight size={24} />
        </div>
      </button>

      {/* === CONTAINER STORY === */}
      <div
        className="position-relative w-100 h-100 bg-dark"
        style={{ maxWidth: "480px" }}
      >
        {/* Progress Bars */}
        <div
          className="position-absolute top-0 start-0 w-100 p-2 d-flex gap-1"
          style={{ zIndex: 30, paddingTop: "10px" }}
        >
          {stories.map((story, idx) => (
            <div
              key={story.id}
              className="flex-grow-1 bg-secondary bg-opacity-50 rounded-pill"
              style={{ height: "3px" }}
            >
              <div
                className="bg-white h-100 rounded-pill transition-all"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                      ? `${progress}%`
                      : "0%",
                  transition:
                    idx === currentIndex ? "width 0.05s linear" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header User Info */}
        <div
          className="position-absolute top-0 start-0 w-100 p-3 pt-4 d-flex justify-content-between align-items-center"
          style={{ zIndex: 30, marginTop: "10px" }}
        >
          <div className="d-flex align-items-center gap-2">
            <Image
              src={user.avatar || "/images/default-avatar.png"}
              roundedCircle
              width={32}
              height={32}
              style={{ objectFit: "cover", border: "1px solid white" }}
            />
            <span
              className="fw-bold text-white shadow-sm"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              {user.username}
            </span>
            <span
              className="text-white opacity-75 small"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              {new Date(currentStory.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <Link href="/home">
            <X className="text-white cursor-pointer drop-shadow" size={28} />
          </Link>
        </div>

        {/* Media Content */}
        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-black position-relative">
          {currentStory.mediaType === "VIDEO" ? (
            <video
              src={currentStory.mediaUrl}
              className="w-100 h-100"
              style={{ objectFit: "contain" }}
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              className="w-100 h-100"
              style={{ objectFit: "contain" }}
              alt="Story"
            />
          )}
        </div>

        {/* Navigation Overlay (Invisible Tap Areas for Mobile/Tablet) */}
        <div
          className="position-absolute top-0 start-0 h-100 w-25"
          style={{ zIndex: 20, cursor: "pointer" }}
          onClick={handlePrev}
        />
        <div
          className="position-absolute top-0 end-0 h-100 w-75"
          style={{ zIndex: 20, cursor: "pointer" }}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}