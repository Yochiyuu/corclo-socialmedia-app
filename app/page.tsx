import About from "@/components/Index/About";
import Features from "@/components/Index/Features";
import Footer from "@/components/Index/Footer";
import Header from "@/components/Index/Header";
import Hero from "@/components/Index/Hero";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 ...">
      <main>
        {/* Wrapper 'relative' ini SANGAT PENTING */}
        <div className="relative">
          <Header /> {/* Header akan mengambang di atas */}
          <Hero /> {/* Hero akan berada di bawahnya */}
        </div>

        <Features />
        <About />
      </main>
      <Footer />
    </div>
  );
}
