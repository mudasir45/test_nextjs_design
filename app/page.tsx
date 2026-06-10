import { CTA } from "@/components/landing/cta";
import { Differentiators } from "@/components/landing/differentiators";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Problem } from "@/components/landing/problem";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Differentiators />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
