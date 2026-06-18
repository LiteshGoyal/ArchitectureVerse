import Link from "next/link";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#4F46E5] py-24">
      <div className="bg-dot-grid-light pointer-events-none absolute inset-0" />
      <div className="animate-drift pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="animate-drift pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

      <Container className="relative text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-wide text-white/70">
            Get started
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your next system diagram is one sentence away.
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mx-auto mt-5 max-w-md text-base text-white/80">
            Open a blank canvas, describe what you&apos;re building, and let
            the AI sketch the first version.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#4F46E5] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F46E5]"
            >
              Start building free
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F46E5]"
            >
              Browse templates
            </a>
          </div>
          <p className="font-mono mt-5 text-xs text-white/60">
            Free for solo projects · No credit card required
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
