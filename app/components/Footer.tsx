// import Link from "next/link";
// import Container from "./ui/Container";
// import { Github, Twitter, MessageCircle } from "lucide-react";

// const PRODUCT = [
//   { label: "Features", href: "#features" },
//   { label: "Templates", href: "#features" },
//   { label: "Component library", href: "#features" },
//   { label: "Pricing", href: "#" },
// ];

// const RESOURCES = [
//   { label: "Documentation", href: "#" },
//   { label: "FAQ", href: "#faq" },
//   { label: "Guides", href: "#" },
// ];

// const COMPANY = [
//   { label: "About", href: "#" },
//   { label: "Blog", href: "#" },
//   { label: "Careers", href: "#" },
// ];

// export default function Footer() {
//   return (
//     <footer className="border-t border-[#E7E6E1] bg-[#F7F7F4] pb-8 pt-16">
//       <Container>
//         <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
//           <div className="max-w-xs">
//             <Link href="/" className="flex items-center gap-2.5">
//               <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
//                 <path
//                   d="M15 4 L25 24 H5 Z"
//                   stroke="#4F46E5"
//                   strokeWidth="1.6"
//                   strokeLinejoin="round"
//                   opacity="0.35"
//                 />
//                 <circle cx="15" cy="4" r="3" fill="#4F46E5" />
//                 <circle cx="5" cy="24" r="3" fill="#FF6B4A" />
//                 <circle cx="25" cy="24" r="3" fill="#F2A93B" />
//               </svg>
//               <span className="font-display text-base font-semibold tracking-tight text-[#14141A]">
//                 Architecture<span className="text-[#4F46E5]">Verse</span>
//               </span>
//             </Link>
//             <p className="mt-4 text-sm leading-relaxed text-[#5C5C68]">
//               A canvas for designing, reviewing, and documenting system
//               architecture — with an AI assistant built in.
//             </p>
//             <div className="mt-5 flex items-center gap-3 text-[#5C5C68]">
//               <a href="#" aria-label="GitHub" className="transition-colors hover:text-[#14141A]">
//                 <Github size={18} />
//               </a>
//               <a href="#" aria-label="Twitter" className="transition-colors hover:text-[#14141A]">
//                 <Twitter size={18} />
//               </a>
//               <a href="#" aria-label="Discord" className="transition-colors hover:text-[#14141A]">
//                 <MessageCircle size={18} />
//               </a>
//             </div>
//           </div>

//           <FooterColumn title="Product" links={PRODUCT} />
//           <FooterColumn title="Resources" links={RESOURCES} />
//           <FooterColumn title="Company" links={COMPANY} />
//         </div>

//         <div className="mt-14 flex flex-col gap-4 border-t border-[#E7E6E1] pt-6 text-xs text-[#9B9BA6] sm:flex-row sm:items-center sm:justify-between">
//           <p className="font-mono">
//             © 2026 ArchitectureVerse. Built for people who think in systems.
//           </p>
//           <div className="flex gap-5">
//             <a href="#" className="transition-colors hover:text-[#14141A]">
//               Privacy
//             </a>
//             <a href="#" className="transition-colors hover:text-[#14141A]">
//               Terms
//             </a>
//           </div>
//         </div>
//       </Container>
//     </footer>
//   );
// }

// function FooterColumn({
//   title,
//   links,
// }: {
//   title: string;
//   links: { label: string; href: string }[];
// }) {
//   return (
//     <div>
//       <h3 className="font-mono text-xs uppercase tracking-wide text-[#9B9BA6]">
//         {title}
//       </h3>
//       <ul className="mt-4 space-y-3">
//         {links.map((link) => (
//           <li key={link.label}>
//             <a
//               href={link.href}
//               className="text-sm text-[#5C5C68] transition-colors hover:text-[#14141A]"
//             >
//               {link.label}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
