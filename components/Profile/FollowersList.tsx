"use client";

import { toggleFollow } from "@/app/actions";
import Link from "next/link";
import { Button, Card, Image } from "react-bootstrap";

type UserType = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  followedBy: { followerId: number }[];
};

type FollowerItem = {
  follower: UserType;
};

export default function FollowersList({ 
  followersList, 
  currentUserId 
}: { 
  followersList: FollowerItem[], 
  currentUserId: number 
}) {
  return (
    <div className="d-flex flex-column gap-3">
      {followersList.map((item) => {
        const user = item.follower;
        const isFollowing = user.followedBy.length > 0;
        const isMe = user.id === currentUserId;

        return (
          <Card key={user.id} className="bg-dark border-secondary border-opacity-25 rounded-4 overflow-hidden">
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <Link href={`/profile/${user.username}`} className="d-flex align-items-center gap-3 text-decoration-none flex-grow-1 text-white">
                <Image
                  src={user.avatar || "/images/default-avatar.png"}
                  roundedCircle
                  width={50}
                  height={50}
                  alt={user.name}
                  style={{ objectFit: "cover", border: "2px solid #212529" }}
                />
                <div style={{ minWidth: 0 }}>
                  <h6 className="fw-bold mb-0 text-truncate">{user.name}</h6>
                  <small className="text-secondary text-truncate d-block">@{user.username}</small>
                  {user.bio && (
                    <small className="text-white-50 text-truncate d-block" style={{ maxWidth: '300px' }}>
                      {user.bio}
                    </small>
                  )}
                </div>
              </Link>

              {!isMe && (
                <form action={toggleFollow.bind(null, user.id)}>
                  <Button 
                    type="submit"
                    variant={isFollowing ? "outline-light" : "primary"}
                    className="rounded-pill fw-bold px-4 py-1 small"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {isFollowing ? "Following" : "FollowBack"}
                  </Button>
                </form>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}