"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";

/**
 * Site-wide floating header. Fixed to the top across the whole page so the
 * nav is reachable from any section. Starts fully transparent over the hero;
 * once you scroll it fades in a frosted-glass bar.
 *
 * `at` = how far INTO each (scroll-driven) section to land, 0..1, so the right
 * moment of the animation is on screen — the Tolaab card, the pinned gallery
 * text, etc. Omit `at` to land at the section top.
 */
type NavItem = {
  label: string;
  /** in-page section to smooth-scroll to (home page) */
  target?: string;
  at?: number;
  /** a separate page to navigate to instead of scrolling */
  href?: string;
};

const NAV: NavItem[] = [
  { label: "Case Study", target: "case-study", at: 0.82 },
  { label: "Services", target: "service" },
  { label: "Results", target: "result", at: 0.35 },
  { label: "Projects", href: "/projects" },
];

function scrollToSection(
  e: MouseEvent<HTMLAnchorElement>,
  target: string,
  at?: number
) {
  e.preventDefault();
  const el = document.getElementById(target);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const dest =
    at != null ? top + (el.offsetHeight - window.innerHeight) * at : top;
  window.scrollTo({ top: Math.max(0, dest), behavior: "smooth" });
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // once you scroll past the (full-screen) hero, the nav links retract
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center border-b transition-all duration-500 ${
        scrolled
          ? "border-white/10 bg-black/40 py-3 backdrop-blur-xl"
          : "border-transparent bg-transparent py-3"
      }`}
    >
      <div className="relative flex h-full w-full items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3 min-[1025px]:gap-9">
          {/* menu icon — sits left of the logo on mobile/tablet; the full nav
              replaces it on desktop */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex shrink-0 items-center justify-center min-[1025px]:hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/menu.png"
              alt=""
              className="h-5 w-5 object-contain"
            />
          </button>

          <Link href="/" className="inline-flex items-center">
            <img
              src="/Group%201.png"
              alt="Temis logo"
              className="h-[20px] w-auto object-contain min-[1025px]:h-[28px]"
            />
          </Link>

          <nav
            className={`hidden items-center gap-9 transition-all duration-500 min-[1025px]:flex min-[1025px]:ml-[36px] ${
              pastHero
                ? "pointer-events-none -translate-y-1 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
          {NAV.map((item) => {
            const linkClass =
              "group relative font-body text-[12px] uppercase tracking-luxe text-stone transition-colors hover:text-resort";
            const underline = (
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-resort transition-transform duration-300 group-hover:scale-x-100" />
            );

            // page link (e.g. Project → /projects)
            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                  {underline}
                </Link>
              );
            }

            // in-page section anchor (smooth scroll on home, jump-home elsewhere)
            return (
              <a
                key={item.label}
                href={`/#${item.target}`}
                onClick={(e) => {
                  if (pathname === "/" && item.target)
                    scrollToSection(e, item.target, item.at);
                }}
                className={linkClass}
              >
                {item.label}
                {underline}
              </a>
            );
          })}
        </nav>
        </div>

        {/* on /projects the button is hidden but kept in layout (invisible)
            so the header keeps the exact same height/offset as elsewhere */}
        <Link
          href="/projects"
          aria-hidden={pathname === "/projects" || undefined}
          tabIndex={pathname === "/projects" ? -1 : undefined}
          className={`group ml-auto inline-flex items-center gap-2 rounded-lg border border-resort/15 bg-umbra/70 px-3.5 py-2 font-body text-[12px] font-normal tracking-normal text-resort shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-colors hover:bg-resort/10 min-[1025px]:gap-2.5 min-[1025px]:rounded-xl min-[1025px]:px-5 min-[1025px]:py-3 min-[1025px]:text-[14px] ${
            pathname === "/projects" ? "invisible" : ""
          }`}
        >
          Explore Projects
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 min-[1025px]:h-4 min-[1025px]:w-4"
            >
              <path
                d="M14.4301 18.82C14.2401 18.82 14.0501 18.75 13.9001 18.6C13.6101 18.31 13.6101 17.83 13.9001 17.54L19.4401 12L13.9001 6.46C13.6101 6.17 13.6101 5.69 13.9001 5.4C14.1901 5.11 14.6701 5.11 14.9601 5.4L21.0301 11.47C21.3201 11.76 21.3201 12.24 21.0301 12.53L14.9601 18.6C14.8101 18.75 14.6201 18.82 14.4301 18.82Z"
                fill="currentColor"
              />
              <path
                d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z"
                fill="currentColor"
              />
            </svg>
          </Link>
      </div>

      {/* mobile dropdown menu — opens from the hamburger, hidden on desktop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-0 z-40 cursor-default min-[1025px]:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl min-[1025px]:hidden"
            >
              <ul className="flex flex-col px-6 py-1">
                {NAV.map((item, i) => {
                  const cls =
                    "block py-4 font-body text-sm uppercase tracking-luxe text-stone transition-colors hover:text-resort";
                  return (
                    <li
                      key={item.label}
                      className={i > 0 ? "border-t border-white/10" : ""}
                    >
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={cls}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={`/#${item.target}`}
                          onClick={(e) => {
                            setMenuOpen(false);
                            if (pathname === "/" && item.target)
                              scrollToSection(e, item.target, item.at);
                          }}
                          className={cls}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
