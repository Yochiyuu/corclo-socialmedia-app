"use client";

import { createPost, logout, toggleFollow } from "@/app/actions";
import PostList, { PostWithRelations } from "@/components/Feed/PostList";
import { Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { Button, Card, Container, Form, Image } from "react-bootstrap";
import { useFormStatus } from "react-dom";

type UserProfileData = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  _count: {
    posts: number;
    followedBy: number;
    following: number;
  };
  posts: any[];
};

export default function ProfileView({
  user,
  isOwnProfile,
  currentUserId,
  isFollowing,
}: {
  user: UserProfileData;
  isOwnProfile: boolean;
  currentUserId: number;
  isFollowing?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const clearFile = () => {
    setPreview(null);
    setFileType(null);
    const input = document.getElementById("mediaInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const postsForList: PostWithRelations[] = user.posts.map((post: any) => ({
    ...post,
    author: {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
  }));

  function TombolPosting() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        className="px-4 fw-bold"
        style={{ backgroundColor: "#7c3aed", border: "none" }}
        disabled={pending}
      >
        {pending ? "..." : "Posting"}
      </Button>
    );
  }

  return (
    <section className="min-vh-100 py-5 bg-black text-white">
      <Container>
        <div className="d-flex align-items-center gap-4 mb-5 border-bottom border-secondary border-opacity-25 pb-4">
          <Image
            src={user.avatar || "/images/default-avatar.png"}
            alt={user.name}
            roundedCircle
            width={100}
            height={100}
            style={{ border: "3px solid #7c3aed", objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <h2 className="fw-bold mb-0">{user.name}</h2>
            <p className="text-secondary mb-2">@{user.username}</p>

            <div className="d-flex gap-4 mb-3">
              <span>
                <b>{user._count.posts}</b> Post
              </span>
              <span>
                <b>{user._count.followedBy}</b> Followers
              </span>
              <span>
                <b>{user._count.following}</b> Following
              </span>
            </div>

            {!isOwnProfile && (
              <Button
                variant={isFollowing ? "outline-secondary" : "primary"}
                size="sm"
                onClick={() => toggleFollow(user.id)}
                className="px-4 rounded-pill fw-bold"
                style={
                  !isFollowing
                    ? { backgroundColor: "#7c3aed", border: "none" }
                    : {}
                }
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>

          {isOwnProfile && (
            <form action={logout}>
              <Button variant="outline-danger" size="sm" type="submit">
                Logout
              </Button>
            </form>
          )}
        </div>

        {isOwnProfile && (
          <Card className="bg-dark border border-secondary border-opacity-25 rounded-4 mb-5">
            <Card.Body>
              <h5 className="fw-bold mb-3 text-white">Buat Postingan Baru</h5>
              <form action={createPost}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    name="content"
                    rows={3}
                    placeholder="Apa yang sedang terjadi?"
                    className="bg-black text-white border-secondary border-opacity-25 mb-2"
                    style={{ resize: "none" }}
                  />
                </Form.Group>

                {preview && (
                  <div className="position-relative mb-3 fit-content d-inline-block">
                    <Button
                      variant="dark"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                      onClick={clearFile}
                      style={{ zIndex: 10 }}
                    >
                      <X size={14} />
                    </Button>
                    {fileType === "image" ? (
                      <img
                        src={preview}
                        className="rounded-3"
                        style={{ maxHeight: "200px" }}
                      />
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="rounded-3"
                        style={{ maxHeight: "200px" }}
                      />
                    )}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <label
                    className="btn btn-sm btn-dark border-secondary border-opacity-25 d-flex align-items-center gap-2 text-secondary hover-text-white"
                    style={{ cursor: "pointer" }}
                  >
                    <ImageIcon size={18} className="text-success" /> Foto /
                    Video
                    <input
                      id="mediaInput"
                      type="file"
                      name="media"
                      accept="image/*,video/*"
                      className="d-none"
                      onChange={handleFileChange}
                    />
                  </label>
                  <TombolPosting />
                </div>
              </form>
            </Card.Body>
          </Card>
        )}

        <h4 className="fw-bold mb-4">
          {isOwnProfile ? "Timeline Kamu" : `Postingan ${user.name}`}
        </h4>

        <PostList posts={postsForList} currentUserId={currentUserId} />
      </Container>
    </section>
  );
}
