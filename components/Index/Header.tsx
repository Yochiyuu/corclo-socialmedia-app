import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-6 left-0 right-0 z-50">
      <div
        className="container mx-auto flex max-w-4xl items-center justify-between 
                   rounded-full px-6 py-3 
                   border border-white/10 
                   bg-black/30 
                   backdrop-blur-md 
                   shadow-lg"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          Corclo
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/docs" className="text-gray-300 hover:text-white">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
