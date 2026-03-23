import { AnimatedGradient } from "@/components/shared/animated-gradient";
import { Hero } from "@/components/landing/hero";
import { DemoSection } from "@/components/landing/demo-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <AnimatedGradient />
      <main className="relative">
        <Hero />
        <DemoSection />
      </main>
      <Footer />
    </>
  );
}
