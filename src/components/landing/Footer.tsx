import { Zap, Globe, FolderGit, FileSymlink } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Partners", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const socials = [
  { icon: Globe, href: "#", label: "Instagram" },
  { icon: FolderGit, href: "#", label: "GitHub" },
  { icon: FileSymlink, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base text-[#F8FAFC]">
                TaskFlow <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Work smarter, not harder —<br />
              powered by AI.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/20 cursor-pointer transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[#F8FAFC]">{group}</h4>
              {links.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#94A3B8]">
            © 2026 TaskFlow AI, Inc. All rights reserved.
          </p>
          <p className="text-sm text-[#94A3B8]">
            Built with{" "}
            <span className="gradient-text font-semibold">Next.js</span> &{" "}
            <span className="gradient-text font-semibold">AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
