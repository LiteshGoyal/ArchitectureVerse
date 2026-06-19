import Link from "next/link";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import HeroCanvas from "./HeroCanvas";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-48 lg:pb-32 lg:pt-48">
      <div className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="font-mono inline-flex items-center gap-2 rounded-full border border-[#E7E6E1] bg-white px-3 py-1 text-xs uppercase tracking-wide text-[#4F46E5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                AI-native architecture canvas
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-[#14141A] sm:text-5xl lg:text-6xl">
                Describe your system.
                <br />
                Watch the diagram draw itself.
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5C5C68]">
                ArchitectureVerse turns a plain-English description into a
                full system diagram — then reviews it, explains the
                tradeoffs, and writes the documentation. You focus on the
                design, not the diagramming.
              </p>
            </Reveal>

            <Reveal delay={270}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#3F37C9] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                >
                  Start building free
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/#features"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E7E6E1] bg-white px-6 py-3 text-sm font-medium text-[#14141A] transition-colors hover:border-[#14141A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                >
                  See what it can do
                  <ChevronDown size={16} />
                </Link>
              </div>
              <p className="font-mono mt-5 text-xs text-[#9B9BA6]">
                Free for solo projects · No credit card required
              </p>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:pl-6">
            <HeroCanvas />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
