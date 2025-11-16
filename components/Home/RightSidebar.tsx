"use client";

import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Button, Image, ListGroup } from "react-bootstrap";

export default function RightSidebar() {
  const verifiedUsers = [
    {
      id: 1,
      name: "u.s.s",
      username: "uss",
      avatar: "images/home/uss.png",
    },
    {
      id: 2,
      name: "Riot Games",
      username: "riotgames",
      avatar: "images/home/riot.jpg",
    },
    {
      id: 3,
      name: "Pelita Jaya Jakarta",
      username: "pelitajayabasketball",
      avatar: "images/home/pj.png",
    },
  ];

  const trends = [
    {
      id: 1,
      category: "Trending in Indonesia",
      tag: "Nextjs",
      posts: "15.2k posts",
    },
    {
      id: 2,
      category: "Trending in Tech",
      tag: "Bootstrap5",
      posts: "8.7k posts",
    },
    {
      id: 3,
      category: "Gaming",
      tag: "Valorant",
      posts: "122.1k posts",
    },
  ];

  return (
    <div className="position-sticky" style={{ top: "80px" }}>
      <div className="rounded-4 p-3 bg-body-tertiary">
        <div>
          <h5 className="fw-bold fs-6 text-body mb-2">Siapa untuk diikuti</h5>
          <ListGroup variant="flush" className="mt-2">
            {verifiedUsers.map((user) => (
              <ListGroup.Item
                key={user.id}
                className="bg-transparent border-0 px-0 py-2 d-flex align-items-center"
              >
                <Link
                  href={`/profile/${user.username}`}
                  className="d-flex align-items-center text-decoration-none flex-grow-1 overflow-hidden me-2"
                >
                  <Image
                    src={user.avatar}
                    roundedCircle
                    width={32}
                    height={32}
                    alt={user.name}
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/32x32/E9ECEF/495057?text=Err";
                    }}
                  />
                  <div className="flex-grow-1 overflow-hidden ms-2">
                    <h6
                      className="fw-bold mb-0 d-flex align-items-center"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <span className="text-truncate text-body">
                        {user.name}
                      </span>
                      <span
                        title="Verified Account"
                        className="d-flex align-items-center"
                      >
                        <BadgeCheck
                          size={14}
                          fill="#1D9BF0"
                          color="#FFFFFF"
                          className="ms-1 flex-shrink-0"
                        />
                      </span>
                    </h6>
                    <small
                      className="text-body-secondary text-truncate d-block"
                      style={{ fontSize: "0.75rem" }}
                    >
                      @{user.username}
                    </small>
                  </div>
                </Link>

                <Button
                  variant="dark"
                  size="sm"
                  className="rounded-pill px-2 py-0 ms-auto flex-shrink-0"
                  style={{
                    backgroundColor: "#0F1419",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "0.8rem",
                  }}
                >
                  Follow
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <hr className="my-3" />

        <div>
          <h5 className="fw-bold fs-6 text-body mb-2">Trends for you</h5>
          <ListGroup variant="flush" className="mt-2">
            {trends.map((trend) => (
              <ListGroup.Item
                key={trend.id}
                as={Link}
                href={`/explore?tag=${trend.tag}`}
                action
                className="bg-transparent border-0 px-0 py-1 text-body-secondary text-decoration-none"
              >
                <small className="d-block" style={{ fontSize: "0.75rem" }}>
                  {trend.category}
                </small>
                <h6
                  className="fw-bold mb-0 text-body"
                  style={{ fontSize: "0.9rem" }}
                >
                  #{trend.tag}
                </h6>
                <small style={{ fontSize: "0.75rem" }}>{trend.posts}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
