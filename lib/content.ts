import type { Locale } from "@/lib/i18n";

export type IconName =
  | "bolt"
  | "box"
  | "building"
  | "calendar"
  | "check"
  | "clock"
  | "document"
  | "mail"
  | "mapPin"
  | "phone"
  | "route"
  | "store";

export interface FormCopy {
  eyebrow: string;
  title: string;
  intro: string;
  requiredNote: string;
  labels: {
    customerName: string;
    company: string;
    optional: string;
    phone: string;
    email: string;
    pickupAddress: string;
    deliveryAddress: string;
    deliveryDate: string;
    parcelType: string;
    instructions: string;
  };
  placeholders: {
    customerName: string;
    company: string;
    phone: string;
    email: string;
    pickupAddress: string;
    deliveryAddress: string;
    parcelType: string;
    instructions: string;
  };
  parcelTypes: Record<
    | "envelope"
    | "small_parcel"
    | "medium_parcel"
    | "large_parcel"
    | "multiple_items"
    | "other",
    string
  >;
  submit: string;
  submitting: string;
  privacy: string;
  success: string;
  successReference: string;
  errors: {
    generic: string;
    invalid: string;
    required: string;
    email: string;
    phone: string;
    date: string;
    rateLimited: string;
    unavailable: string;
  };
}

interface SiteCopy {
  meta: {
    title: string;
    description: string;
  };
  languageLabel: string;
  languageSwitch: string;
  skipLink: string;
  menuOpen: string;
  menuClose: string;
  navLabel: string;
  nav: Array<{ label: string; href: string }>;
  headerCta: string;
  topbar: string;
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: Array<{ icon: IconName; text: string }>;
    visual: {
      eyebrow: string;
      title: string;
      pickup: string;
      transit: string;
      delivery: string;
      area: string;
    };
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{
      icon: IconName;
      title: string;
      description: string;
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ title: string; description: string }>;
    noteTitle: string;
    note: string;
  };
  business: {
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    cta: string;
    panelEyebrow: string;
    panelTitle: string;
    panelText: string;
    sectors: string[];
  };
  form: FormCopy;
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    phoneLabel: string;
    emailLabel: string;
    areaLabel: string;
    area: string;
  };
  footer: {
    description: string;
    navigation: string;
    contact: string;
    rights: string;
  };
}

export const content = {
  fr: {
    meta: {
      title: "Livraison locale à Montréal | SwiftXpress",
      description:
        "Service de livraison et messagerie à Montréal et dans les environs : jour même, express, colis, entreprises, livraisons programmées et preuve de livraison.",
    },
    languageLabel: "Langue",
    languageSwitch: "English",
    skipLink: "Aller au contenu",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    navLabel: "Navigation principale",
    nav: [
      { label: "Services", href: "#services" },
      { label: "Fonctionnement", href: "#fonctionnement" },
      { label: "Entreprises", href: "#entreprises" },
      { label: "Contact", href: "#contact" },
    ],
    headerCta: "Demander une soumission",
    topbar: "Livraison et messagerie à Montréal et dans les environs",
    hero: {
      eyebrow: "Votre livraison. Notre itinéraire.",
      title: "Vos envois locaux, pris en charge avec",
      accent: "précision.",
      description:
        "SwiftXpress transporte colis, documents et commandes à Montréal et dans les environs. Pour un besoin le jour même, express ou programmé, transmettez-nous les détails de votre livraison.",
      primaryCta: "Obtenir une soumission",
      secondaryCta: "Appeler le 438-227-6337",
      highlights: [
        { icon: "clock", text: "Jour même et express" },
        { icon: "check", text: "Preuve de livraison" },
        { icon: "mapPin", text: "Montréal et environs" },
      ],
      visual: {
        eyebrow: "Trajet coordonné",
        title: "D’un point à l’autre, clairement.",
        pickup: "Ramassage",
        transit: "En route",
        delivery: "Livraison",
        area: "Montréal et environs",
      },
    },
    services: {
      eyebrow: "Services de livraison",
      title: "Une solution adaptée à chaque envoi local.",
      intro:
        "Des demandes ponctuelles aux besoins récurrents, SwiftXpress organise la prise en charge selon le colis, les adresses et la date souhaitée.",
      items: [
        {
          icon: "clock",
          title: "Livraison le jour même",
          description:
            "Pour les envois qui doivent partir et arriver la même journée, selon la disponibilité et l’itinéraire.",
        },
        {
          icon: "bolt",
          title: "Livraison express",
          description:
            "Une prise en charge priorisée pour les documents, colis et commandes urgentes.",
        },
        {
          icon: "box",
          title: "Colis et documents",
          description:
            "Enveloppes, petits ou grands colis et envois multiples, avec les consignes nécessaires.",
        },
        {
          icon: "calendar",
          title: "Livraison programmée",
          description:
            "Choisissez une date et communiquez les informations de ramassage et de remise à l’avance.",
        },
        {
          icon: "store",
          title: "Commerces, restaurants et pharmacies",
          description:
            "Des livraisons locales adaptées aux commandes et articles autorisés de votre établissement.",
        },
        {
          icon: "document",
          title: "Preuve de livraison",
          description:
            "Une confirmation de remise peut être prévue selon les exigences de votre envoi.",
        },
      ],
    },
    process: {
      eyebrow: "Comment ça fonctionne",
      title: "Une demande simple, des détails bien coordonnés.",
      intro:
        "Chaque livraison commence par des informations précises. Elles nous permettent d’évaluer le trajet et de confirmer les modalités avec vous.",
      items: [
        {
          title: "Décrivez la livraison",
          description:
            "Indiquez les adresses, la date, le type de colis et toute instruction utile dans le formulaire.",
        },
        {
          title: "Confirmez les modalités",
          description:
            "SwiftXpress vérifie la demande et communique avec vous pour confirmer la disponibilité, le prix et les détails.",
        },
        {
          title: "Ramassage et livraison",
          description:
            "L’envoi est pris en charge selon les modalités convenues, avec preuve de livraison lorsqu’elle est prévue.",
        },
      ],
      noteTitle: "Une instruction particulière?",
      note:
        "Ajoutez les accès, contacts sur place, contraintes de remise ou précisions sur le colis à votre demande.",
    },
    business: {
      eyebrow: "Pour les entreprises",
      title: "La livraison locale intégrée à vos opérations.",
      description:
        "SwiftXpress accompagne les entreprises qui ont besoin d’expédier une commande, un document ou plusieurs colis, ponctuellement ou selon une planification convenue.",
      bullets: [
        "Demandes ponctuelles ou besoins récurrents",
        "Consignes propres à chaque point de ramassage et de livraison",
        "Livraisons programmées et express",
        "Preuve de livraison selon le besoin",
      ],
      cta: "Parler de vos besoins",
      panelEyebrow: "Livraison B2B et locale",
      panelTitle: "Un point de contact pour organiser vos envois.",
      panelText:
        "Présentez-nous vos destinations, vos types de colis et la fréquence souhaitée. Nous pourrons établir une solution adaptée à vos opérations.",
      sectors: ["Commerces", "Restaurants", "Pharmacies", "Bureaux"],
    },
    form: {
      eyebrow: "Demande de soumission",
      title: "Parlez-nous de votre livraison.",
      intro:
        "Remplissez les champs ci-dessous. SwiftXpress communiquera avec vous pour confirmer les détails et le prix.",
      requiredNote: "Les champs marqués d’un astérisque sont obligatoires.",
      labels: {
        customerName: "Nom du client",
        company: "Entreprise",
        optional: "facultatif",
        phone: "Téléphone",
        email: "Courriel",
        pickupAddress: "Adresse de ramassage",
        deliveryAddress: "Adresse de livraison",
        deliveryDate: "Date de livraison",
        parcelType: "Type de colis",
        instructions: "Instructions supplémentaires",
      },
      placeholders: {
        customerName: "Votre nom complet",
        company: "Nom de l’entreprise",
        phone: "438-000-0000",
        email: "vous@exemple.ca",
        pickupAddress: "Adresse complète de ramassage",
        deliveryAddress: "Adresse complète de livraison",
        parcelType: "Sélectionner un type",
        instructions: "Accès, contact sur place, dimensions ou autres précisions",
      },
      parcelTypes: {
        envelope: "Enveloppe ou document",
        small_parcel: "Petit colis",
        medium_parcel: "Colis moyen",
        large_parcel: "Grand colis",
        multiple_items: "Plusieurs articles",
        other: "Autre",
      },
      submit: "Envoyer la demande",
      submitting: "Envoi en cours…",
      privacy:
        "Les renseignements transmis servent uniquement à traiter votre demande de soumission.",
      success: "Votre demande a bien été transmise.",
      successReference: "Référence",
      errors: {
        generic:
          "Une erreur est survenue. Réessayez ou appelez-nous au 438-227-6337.",
        invalid: "Vérifiez les champs indiqués.",
        required: "Ce champ est obligatoire.",
        email: "Saisissez une adresse courriel valide.",
        phone: "Saisissez un numéro de téléphone valide.",
        date: "Choisissez aujourd’hui ou une date ultérieure.",
        rateLimited:
          "Trop de demandes ont été envoyées. Veuillez réessayer plus tard ou nous appeler.",
        unavailable:
          "Le service de soumission est temporairement indisponible. Appelez-nous au 438-227-6337.",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Une livraison à organiser?",
      description:
        "Appelez, écrivez ou envoyez une demande de soumission avec les adresses et la date souhaitée.",
      phoneLabel: "Téléphone",
      emailLabel: "Courriel",
      areaLabel: "Zone desservie",
      area: "Montréal et les environs",
    },
    footer: {
      description:
        "Livraison et messagerie locale pour particuliers et entreprises à Montréal et dans les environs.",
      navigation: "Navigation",
      contact: "Nous joindre",
      rights: "Tous droits réservés.",
    },
  },
  en: {
    meta: {
      title: "Local delivery in Montreal | SwiftXpress",
      description:
        "Delivery and courier service in Montreal and surrounding areas: same-day, express, parcels, business, scheduled delivery and proof of delivery.",
    },
    languageLabel: "Language",
    languageSwitch: "Français",
    skipLink: "Skip to content",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    navLabel: "Main navigation",
    nav: [
      { label: "Services", href: "#services" },
      { label: "How it works", href: "#fonctionnement" },
      { label: "Businesses", href: "#entreprises" },
      { label: "Contact", href: "#contact" },
    ],
    headerCta: "Request a quote",
    topbar: "Delivery and courier service in Montreal and surrounding areas",
    hero: {
      eyebrow: "Your delivery. Our route.",
      title: "Your local shipments, handled with",
      accent: "precision.",
      description:
        "SwiftXpress transports parcels, documents and orders across Montreal and surrounding areas. For same-day, express or scheduled service, send us your delivery details.",
      primaryCta: "Get a quote",
      secondaryCta: "Call 438-227-6337",
      highlights: [
        { icon: "clock", text: "Same-day and express" },
        { icon: "check", text: "Proof of delivery" },
        { icon: "mapPin", text: "Montreal and nearby areas" },
      ],
      visual: {
        eyebrow: "Coordinated route",
        title: "From one point to the next, clearly.",
        pickup: "Pickup",
        transit: "In transit",
        delivery: "Delivery",
        area: "Montreal and surrounding areas",
      },
    },
    services: {
      eyebrow: "Delivery services",
      title: "A solution suited to every local shipment.",
      intro:
        "From one-time requests to recurring needs, SwiftXpress coordinates pickup based on the parcel, addresses and requested date.",
      items: [
        {
          icon: "clock",
          title: "Same-day delivery",
          description:
            "For shipments that need to leave and arrive on the same day, subject to availability and route.",
        },
        {
          icon: "bolt",
          title: "Express delivery",
          description:
            "Prioritized handling for urgent documents, parcels and orders.",
        },
        {
          icon: "box",
          title: "Parcels and documents",
          description:
            "Envelopes, small or large parcels and multiple-item shipments, with the instructions you provide.",
        },
        {
          icon: "calendar",
          title: "Scheduled delivery",
          description:
            "Choose a date and provide pickup and drop-off information in advance.",
        },
        {
          icon: "store",
          title: "Retailers, restaurants and pharmacies",
          description:
            "Local delivery suited to your establishment’s orders and permitted items.",
        },
        {
          icon: "document",
          title: "Proof of delivery",
          description:
            "Delivery confirmation can be arranged based on your shipment requirements.",
        },
      ],
    },
    process: {
      eyebrow: "How it works",
      title: "A simple request, with every detail coordinated.",
      intro:
        "Every delivery starts with accurate information. It allows us to assess the route and confirm the arrangements with you.",
      items: [
        {
          title: "Describe the delivery",
          description:
            "Enter the addresses, date, parcel type and any useful instructions in the form.",
        },
        {
          title: "Confirm the arrangements",
          description:
            "SwiftXpress reviews the request and contacts you to confirm availability, pricing and details.",
        },
        {
          title: "Pickup and delivery",
          description:
            "The shipment is handled as agreed, with proof of delivery when included in the arrangements.",
        },
      ],
      noteTitle: "Have a special instruction?",
      note:
        "Add access details, on-site contacts, drop-off constraints or parcel information to your request.",
    },
    business: {
      eyebrow: "For businesses",
      title: "Local delivery that fits your operations.",
      description:
        "SwiftXpress supports businesses that need to send an order, document or multiple parcels, either occasionally or on an agreed schedule.",
      bullets: [
        "One-time requests or recurring needs",
        "Instructions for each pickup and delivery point",
        "Scheduled and express delivery",
        "Proof of delivery when required",
      ],
      cta: "Discuss your needs",
      panelEyebrow: "B2B and local delivery",
      panelTitle: "One point of contact to coordinate your shipments.",
      panelText:
        "Tell us about your destinations, parcel types and preferred frequency. We can establish a delivery solution suited to your operations.",
      sectors: ["Retailers", "Restaurants", "Pharmacies", "Offices"],
    },
    form: {
      eyebrow: "Quote request",
      title: "Tell us about your delivery.",
      intro:
        "Complete the fields below. SwiftXpress will contact you to confirm the details and price.",
      requiredNote: "Fields marked with an asterisk are required.",
      labels: {
        customerName: "Customer name",
        company: "Company",
        optional: "optional",
        phone: "Phone",
        email: "Email",
        pickupAddress: "Pickup address",
        deliveryAddress: "Delivery address",
        deliveryDate: "Delivery date",
        parcelType: "Parcel type",
        instructions: "Additional instructions",
      },
      placeholders: {
        customerName: "Your full name",
        company: "Company name",
        phone: "438-000-0000",
        email: "you@example.ca",
        pickupAddress: "Full pickup address",
        deliveryAddress: "Full delivery address",
        parcelType: "Select a type",
        instructions: "Access, on-site contact, dimensions or other details",
      },
      parcelTypes: {
        envelope: "Envelope or document",
        small_parcel: "Small parcel",
        medium_parcel: "Medium parcel",
        large_parcel: "Large parcel",
        multiple_items: "Multiple items",
        other: "Other",
      },
      submit: "Send request",
      submitting: "Sending…",
      privacy:
        "The information you submit is used only to process your quote request.",
      success: "Your request has been sent.",
      successReference: "Reference",
      errors: {
        generic:
          "Something went wrong. Try again or call us at 438-227-6337.",
        invalid: "Check the highlighted fields.",
        required: "This field is required.",
        email: "Enter a valid email address.",
        phone: "Enter a valid phone number.",
        date: "Choose today or a later date.",
        rateLimited:
          "Too many requests have been sent. Please try again later or call us.",
        unavailable:
          "The quote service is temporarily unavailable. Call us at 438-227-6337.",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Need to arrange a delivery?",
      description:
        "Call, email or send a quote request with the addresses and requested date.",
      phoneLabel: "Phone",
      emailLabel: "Email",
      areaLabel: "Service area",
      area: "Montreal and surrounding areas",
    },
    footer: {
      description:
        "Local delivery and courier service for individuals and businesses in Montreal and surrounding areas.",
      navigation: "Navigation",
      contact: "Contact us",
      rights: "All rights reserved.",
    },
  },
} satisfies Record<Locale, SiteCopy>;
