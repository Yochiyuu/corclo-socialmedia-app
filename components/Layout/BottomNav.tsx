"use client";

import { Hash, Home, MessageCircle, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav({
  currentUser,
}: {
  currentUser: { username: string };
}) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, href: "/home", active: pathname === "/home" },
    { icon: Hash, href: "#", active: false },
    {
      icon: MessageCircle,
      href: "/messages",
      active: pathname.includes("/messages"),
    },
    {
      icon: User,
      href: `/profile/${currentUser.username}`,
      active: pathname.includes("/profile"),
    },
    { 
      icon: Settings, 
      href: "/settings", 
      active: pathname === "/settings" || pathname.startsWith("/settings/")
    },
  ];

  return (
    <div
      className="fixed-bottom bg-dark border-top border-secondary border-opacity-25 px-3 py-2 d-flex justify-content-center align-items-center gap-5" // Ubah gap di sini
      style={{
        zIndex: 1030,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(33, 37, 41, 0.95)",
      }}
    >
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`text-decoration-none d-flex flex-column align-items-center gap-1 transition-all p-2 rounded-3 ${
            item.active
              ? "text-primary bg-primary bg-opacity-10"
              : "text-secondary hover-text-white hover-bg-opacity"
          }`}
        >
          <item.icon size={24} strokeWidth={item.active ? 2.5 : 2} />
        </Link>
      ))}
    </div>
  );
}