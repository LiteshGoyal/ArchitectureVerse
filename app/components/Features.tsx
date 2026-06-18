import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import {
  Wand2,
  Blocks,
  SearchCheck,
  FileText,
  MessageCircle,
  Users,
  LucideIcon,
} from "lucide-react";

const STEPS = [
  { n: "01", title: "Describe", caption: "Type what you're building in plain English." },
  { n: "02", title: "Generate", caption: "The AI drafts nodes, edges and labels for you." },
  { n: "03", title: "Review & improve", caption: "Get explanations and concrete suggestions." },
  { n: "04", title: "Ship the docs", caption: "Export documentation straight from the canvas." },
];

interface Feature {
  icon: LucideIcon;
  badge: string | null;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: Wand2,
    badge: "AI",
    title: "Generate from a sentence",
    desc: "Type what you're building in plain English. ArchitectureVerse drafts the nodes, edges, and labels for a working first version of your system.",
  },
  {
    icon: Blocks,
    badge: null,
    title: "Build from a library",
    desc: "Drag in components — frontend, backend, databases, queues, caches, load balancers — from the side panel, or start from a template like React + Django.",
  },
  {
    icon: SearchCheck,
    badge: "AI",
    title: "Review, explain, improve",
    desc: "Get a plain-language walkthrough of any diagram, with callouts on single points of failure and concrete suggestions like adding a cache or a queue.",
  },
  {
    icon: FileText,
    badge: null,
    title: "Auto-generated docs",
    desc: "Every diagram exports to clean technical documentation — components, connections, and responsibilities, written for you.",
  },
  {
    icon: MessageCircle,
    badge: "AI",
    title: "An assistant on the canvas",
    desc: "Ask questions about your architecture without leaving the board. The assistant reads your diagram and answers in context.",
  },
  {
    icon: Users,
    badge: "LIVE",
    title: "Work on it together",
    desc: "Invite your team to the same diagram and see their edits, comments, and cursors as they happen.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#F7F7F4] py-28">
      <Container>
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-wide text-[#4F46E5]">
            Inside the canvas
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-[#14141A] sm:text-4xl">
            Six tools, one continuous workflow
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5C5C68]">
            From a one-line prompt to a documented, reviewed system —
            everything happens on the same board.
          </p>
        </Reveal>

        <div
          id="how-it-works"
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 90}>
              <div className="relative">
                <span className="font-mono text-sm text-[#9B9BA6]">{step.n}</span>
                <h3 className="font-display mt-2 text-lg font-medium text-[#14141A]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#5C5C68]">{step.caption}</p>
                {i < STEPS.length - 1 && (
                  <span className="absolute right-[-1rem] top-1 hidden h-px w-8 bg-[#E7E6E1] sm:block lg:right-[-1.25rem]" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 70}>
                <div className="group h-full rounded-2xl border border-[#E7E6E1] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(20,20,26,0.18)]">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEEDFC] text-[#4F46E5]">
                      <Icon size={20} />
                    </div>
                    {feature.badge && (
                      <span className="font-mono rounded-full border border-[#E7E6E1] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#9B9BA6]">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display mt-5 text-lg font-medium text-[#14141A]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C5C68]">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
