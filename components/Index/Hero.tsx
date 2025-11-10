import { MoveRight } from "lucide-react";
// Impor komponen Aurora Anda
import Aurora from "@/components/ui/AuroraBackground";

export default function Hero() {
  return (
    <section
      id="hero"
      // Section ini harus 'relative' dan set 'h-screen'
      className="relative h-screen w-full overflow-hidden"
    >
      {/* 1. Komponen Aurora sebagai Latar Belakang */}
      {/* Tempatkan di 'absolute' dan 'z-0' (paling belakang) */}
      <div className="absolute inset-0 z-0">
        <Aurora />
      </div>

      {/* 2. Konten Anda */}
      {/* Tempatkan di 'relative' dan 'z-10' (di depan) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
          Welcome to <span className="text-blue-400">Corclo</span>
        </h1>
        <p className="mt-4 text-xl text-gray-200 md:text-2xl">
          The new way to connect, share, and discover.
        </p>
        <button className="mt-8 flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105">
          Get Started
          <MoveRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
