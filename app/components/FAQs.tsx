"use client";

import { useState } from "react";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Do I need a system-design background to use this?",
    a: "No. Describe what you're building in plain English, and the AI drafts a starting diagram. You refine it from there — no prior architecture experience required.",
  },
  {
    q: "How does \u201cGenerate Architecture\u201d work?",
    a: "It reads your description, figures out which components a system like that typically needs, and places nodes and edges on the canvas, already labeled and styled by type.",
  },
  {
    q: "Can I bring my own components or templates?",
    a: "Yes. Add components from the side panel, or import a template as JSON. React + Django ships today, and more templates are on the way.",
  },
  {
    q: "What's the difference between Review and Improve?",
    a: "Review explains the diagram as it stands — what each piece does and where the risks are. Improve goes further and suggests concrete changes, like adding a cache or a queue.",
  },
  {
    q: "Can my team work on the same diagram?",
    a: "Not yet, but soon you will be able to work with your team on the same diagram. Work in progress.",
  },
  {
    q: "What can I export?",
    a: "PNG images, Markdown documentation, or a shareable read-only link to the live diagram.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Solo projects and small diagrams are free. Team workspaces and larger architectures move to a paid plan.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-wide text-[#4F46E5]">
            Questions
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[#14141A] sm:text-4xl">
            Answers before you start drawing
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-[#E7E6E1] border-y border-[#E7E6E1]">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 50}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 rounded-sm py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-medium text-[#14141A] sm:text-lg">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-[#9B9BA6] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0">
                      <p className="pb-5 text-sm leading-relaxed text-[#5C5C68] sm:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
