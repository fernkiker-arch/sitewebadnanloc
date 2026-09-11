import { notFound } from "next/navigation";

import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { QuoteForm } from "@/components/quote-form";
import { RouteVisual } from "@/components/route-visual";
import { SiteHeader } from "@/components/site-header";
import { content } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = content[locale];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SwiftXpress",
    url: "https://swiftxpress.ca",
    telephone: "+1-438-227-6337",
    email: "contact@swiftxpress.ca",
    description: copy.meta.description,
    areaServed: {
      "@type": "City",
      name: "Montréal",
    },
    knowsLanguage: ["fr-CA", "en-CA"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-438-227-6337",
      email: "contact@swiftxpress.ca",
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "fr" ? "Services de livraison" : "Delivery services",
      itemListElement: [
        "Same-day delivery",
        "Express delivery",
        "Parcel delivery",
        "Scheduled delivery",
        "Proof of delivery",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader locale={locale} copy={copy} />

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero__grid container">
            <div className="hero__content">
              <span className="eyebrow">{copy.hero.eyebrow}</span>
              <h1>
                {copy.hero.title} <em>{copy.hero.accent}</em>
              </h1>
              <p className="hero__lead">{copy.hero.description}</p>
              <div className="hero__actions">
                <a className="button" href="#soumission">
                  {copy.hero.primaryCta}
                  <span aria-hidden="true">→</span>
                </a>
                <a className="text-link" href="tel:4382276337">
                  <Icon name="phone" size={18} />
                  {copy.hero.secondaryCta}
                </a>
              </div>
              <ul className="hero__highlights" aria-label={copy.services.eyebrow}>
                {copy.hero.highlights.map((item) => (
                  <li key={item.text}>
                    <Icon name={item.icon} size={18} />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <RouteVisual copy={copy.hero.visual} />
          </div>
          <div className="hero__ticker" aria-hidden="true">
            <div>
              <span>SwiftXpress</span>
              <i>•</i>
              <span>Montréal</span>
              <i>•</i>
              <span>Jour même</span>
              <i>•</i>
              <span>Same-day</span>
              <i>•</i>
              <span>Express</span>
              <i>•</i>
              <span>SwiftXpress</span>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div>
                <span className="eyebrow">{copy.services.eyebrow}</span>
                <h2>{copy.services.title}</h2>
              </div>
              <p>{copy.services.intro}</p>
            </div>
            <div className="service-grid">
              {copy.services.items.map((service, index) => (
                <article className="service-card" key={service.title}>
                  <div className="service-card__top">
                    <span className="service-card__icon">
                      <Icon name={service.icon} size={25} />
                    </span>
                    <span className="service-card__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process" id="fonctionnement">
          <div className="container process__grid">
            <div className="process__intro">
              <span className="eyebrow eyebrow--light">{copy.process.eyebrow}</span>
              <h2>{copy.process.title}</h2>
              <p>{copy.process.intro}</p>
              <aside className="process__note">
                <Icon name="route" size={25} />
                <div>
                  <strong>{copy.process.noteTitle}</strong>
                  <p>{copy.process.note}</p>
                </div>
              </aside>
            </div>
            <ol className="process-list">
              {copy.process.items.map((item, index) => (
                <li key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section business" id="entreprises">
          <div className="container business__grid">
            <div className="business__content">
              <span className="eyebrow">{copy.business.eyebrow}</span>
              <h2>{copy.business.title}</h2>
              <p>{copy.business.description}</p>
              <ul className="check-list">
                {copy.business.bullets.map((item) => (
                  <li key={item}>
                    <span>
                      <Icon name="check" size={16} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a className="button button--dark" href="#contact">
                {copy.business.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="business-panel">
              <span className="business-panel__icon">
                <Icon name="building" size={32} />
              </span>
              <span className="eyebrow eyebrow--light">
                {copy.business.panelEyebrow}
              </span>
              <h3>{copy.business.panelTitle}</h3>
              <p>{copy.business.panelText}</p>
              <div className="business-panel__sectors">
                {copy.business.sectors.map((sector) => (
                  <span key={sector}>{sector}</span>
                ))}
              </div>
              <div className="business-panel__route" aria-hidden="true">
                <i />
                <b>→</b>
                <i />
                <b>→</b>
                <i />
              </div>
            </div>
          </div>
        </section>

        <section className="quote-section" id="soumission">
          <div className="container">
            <QuoteForm locale={locale} copy={copy.form} />
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container contact__grid">
            <div className="contact__heading">
              <span className="eyebrow">{copy.contact.eyebrow}</span>
              <h2>{copy.contact.title}</h2>
              <p>{copy.contact.description}</p>
            </div>
            <div className="contact-cards">
              <a className="contact-card" href="tel:4382276337">
                <span><Icon name="phone" size={23} /></span>
                <small>{copy.contact.phoneLabel}</small>
                <strong>438-227-6337</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a
                className="contact-card"
                href="mailto:contact@swiftxpress.ca"
              >
                <span><Icon name="mail" size={23} /></span>
                <small>{copy.contact.emailLabel}</small>
                <strong>contact@swiftxpress.ca</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <div className="contact-card">
                <span><Icon name="mapPin" size={23} /></span>
                <small>{copy.contact.areaLabel}</small>
                <strong>{copy.contact.area}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <a href={`/${locale}#top`} aria-label="SwiftXpress">
              <Logo inverse />
            </a>
            <p>{copy.footer.description}</p>
          </div>
          <div>
            <h2>{copy.footer.navigation}</h2>
            <nav aria-label={copy.navLabel}>
              {copy.nav.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </nav>
          </div>
          <div>
            <h2>{copy.footer.contact}</h2>
            <a href="tel:4382276337">438-227-6337</a>
            <a href="mailto:contact@swiftxpress.ca">
              contact@swiftxpress.ca
            </a>
            <p>{copy.contact.area}</p>
          </div>
        </div>
        <div className="container footer__bottom">
          <p>
            © {new Date().getFullYear()} SwiftXpress.ca. {copy.footer.rights}
          </p>
          <a href={`/${locale === "fr" ? "en" : "fr"}`}>
            {copy.languageSwitch}
          </a>
        </div>
      </footer>
    </>
  );
}
