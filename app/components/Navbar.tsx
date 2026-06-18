"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "./ui/Container";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#E7E6E1] bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <path
                d="M15 4 L25 24 H5 Z"
                stroke="#4F46E5"
                strokeWidth="1.6"
                strokeLinejoin="round"
                opacity="0.35"
              />
              <circle cx="15" cy="4" r="3" fill="#4F46E5" />
              <circle cx="5" cy="24" r="3" fill="#FF6B4A" />
              <circle cx="25" cy="24" r="3" fill="#F2A93B" />
            </svg>
            <span className="font-display text-lg font-semibold tracking-tight text-[#14141A]">
              Architecture<span className="text-[#4F46E5]">Verse</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm text-[#5C5C68] transition-colors hover:text-[#14141A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/login"
              className="rounded-sm text-sm font-medium text-[#5C5C68] transition-colors hover:text-[#14141A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#4F46E5] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3F37C9] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center rounded-md p-2 text-[#14141A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>

      {open && (
        <div className="border-t border-[#E7E6E1] bg-white px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-[#5C5C68] hover:text-[#14141A]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-[#E7E6E1] pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-base font-medium text-[#14141A]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#4F46E5] px-5 py-2.5 text-center text-sm font-medium text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
