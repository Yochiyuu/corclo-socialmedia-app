import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-10">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between px-4 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Corclo. All rights reserved.
          </p>
        </div>
        <div className="mt-4 flex gap-6 md:mt-0">
          <Link href="#" className="text-gray-400 hover:text-white">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white">
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
