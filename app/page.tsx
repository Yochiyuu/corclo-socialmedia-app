/*
  File ini adalah LANDING PAGE (Index) untuk "Corclo".
  Ini adalah halaman yang dilihat pengunjung sebelum mereka login atau mendaftar.

  Mengasumsikan Anda sudah meng-install:
  1. npx shadcn@latest add button card
  2. npm install lucide-react
  3. SUDAH MEMBUAT DAN MENAMBAHKAN KODE untuk components/ui/animated-gradient-background.tsx
  4. SUDAH MENAMBAHKAN CSS ANIMASI ke app/globals.css
*/

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DarkVeil from "@/components/ui/DarkVeil";
import { MessageCircle, Rocket, Share2, Users } from "lucide-react";
import Link from "next/link";

// 1. Komponen Header (Navigasi Landing Page)
function LandingHeader() {
  return (
    <header className="absolute top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-sm dark:bg-black/5">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-blue-400" />{" "}
          {/* Ganti warna icon agar lebih cocok dengan background gelap */}
          <span className="text-xl font-bold text-black dark:text-white">
            Corclo
          </span>
        </Link>

        {/* Navigasi Link (Desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#fitur"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Fitur
          </Link>
          <Link
            href="#tentang"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Tentang
          </Link>
          <Link
            href="#harga"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Harga
          </Link>
        </nav>

        {/* Tombol Autentikasi */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            asChild
            className="text-zinc-700 hover:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <Link href="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Link href="/register">Daftar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// 2. Komponen Hero (Bagian Utama Paling Atas)
function HeroSection() {
  return (
    // Hapus kelas py-24, sm:py-32, md:py-40 karena sekarang wrapping div yang mengatur ketinggian
    <section className="relative flex h-full w-full flex-col items-center justify-center text-center">
      <div className="container max-w-3xl px-4">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Terhubung. Berbagi. Temukan Komunitas Anda.
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-lg leading-8 text-zinc-200">
          Selamat datang di Corclo, platform media sosial generasi baru yang
          dirancang untuk koneksi autentik dan diskusi yang bermakna.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            size="lg"
            className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            asChild
          >
            <Link href="/register">Mulai Sekarang Gratis</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 text-white hover:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
            asChild
          >
            <Link href="#fitur">Pelajari Fitur</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// 3. Komponen Fitur (Tidak banyak berubah, hanya penyesuaian warna teks/bg)
function FeaturesSection() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Grup Komunitas",
      description:
        "Buat atau gabung dengan grup berdasarkan minat, hobi, atau profesi Anda.",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "Diskusi Real-time",
      description:
        "Ngobrol langsung dengan teman atau komunitas dalam obrolan yang cepat dan aman.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-purple-600" />,
      title: "Berbagi Konten",
      description:
        "Bagikan pemikiran, foto, dan video Anda dengan mudah kepada pengikut Anda.",
    },
  ];

  return (
    <section id="fitur" className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="container max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
          Semua yang Anda Butuhkan
        </h2>
        <p className="mt-4 text-center text-lg text-zinc-600 dark:text-zinc-400">
          Corclo dilengkapi dengan fitur-fitur canggih untuk memperkaya
          interaksi sosial Anda.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col items-center text-center dark:bg-black"
            >
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2 text-xl font-semibold">
                  {feature.title}
                </CardTitle>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Komponen Footer
function LandingFooter() {
  return (
    <footer className="border-t py-12 dark:border-zinc-800">
      <div className="container max-w-5xl px-4 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Corclo. Dibuat dengan ❤️ oleh Andrew
          Reinhart.
        </p>
      </div>
    </footer>
  );
}

// --- Halaman Utama (Index/Landing Page) ---
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white">
      {/* Absolute positioning untuk Header agar tidak mengganggu layout Hero */}
      <LandingHeader />

      <main className="relative flex flex-1 flex-col">
        {/* Wrap HeroSection dengan AnimatedGradientBackground */}
        <DarkVeil className="flex flex-1 flex-col items-center justify-center text-center">
          <HeroSection />
        </DarkVeil>

        <FeaturesSection />
        <LandingFooter />
      </main>
    </div>
  );
}
