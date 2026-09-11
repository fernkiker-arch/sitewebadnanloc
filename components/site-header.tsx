"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import type { Locale } from "@/lib/i18n";

interface HeaderCopy {
  languageLabel: string;
  languageSwitch: string;
  menuOpen: string;
  menuClose: string;
  navLabel: string;
  topbar: string;
  headerCta: string;
  nav: Array<{ label: string; href: string }>;
}

interface SiteHeaderProps {
  locale: Locale;
  copy: HeaderCopy;
}

export function SiteHeader({ locale, copy }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const otherLocale = locale === "fr" ? "en" : "fr";

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <p>{copy.topbar}</p>
          <div className="utility-bar__links">
            <a href="tel:4382276337">
              <Icon name="phone" size={15} />
              438-227-6337
            </a>
            <a href="mailto:contact@swiftxpress.ca">
              <Icon name="mail" size={15} />
              contact@swiftxpress.ca
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link
            className="site-header__logo"
            href={`/${locale}#top`}
            aria-label="SwiftXpress"
          >
            <Logo />
          </Link>

          <nav className="desktop-nav" aria-label={copy.navLabel}>
            {copy.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link
              className="language-link"
              href={`/${otherLocale}`}
              hrefLang={otherLocale}
              aria-label={`${copy.languageLabel}: ${copy.languageSwitch}`}
            >
              {copy.languageSwitch}
            </Link>
            <a className="button button--small header-quote" href="#soumission">
              {copy.headerCta}
            </a>
            <button
              className="menu-button"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <nav className="container" aria-label={copy.navLabel}>
            {copy.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
            <a
              className="mobile-nav__call"
              href="tel:4382276337"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="phone" size={18} />
              438-227-6337
            </a>
            <a
              className="button"
              href="#soumission"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {copy.headerCta}
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
