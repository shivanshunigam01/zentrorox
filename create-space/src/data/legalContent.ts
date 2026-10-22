export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  seoTitle: string;
  seoDescription: string;
  path: string;
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

const COMPANY = "Zentroverse Global Private Limited";
const CONTACT_EMAIL = "digital@zentroverse.com";
const WEBSITE = "https://zentroverse.com";

export const PRIVACY_POLICY: LegalDocument = {
  seoTitle: "Privacy Policy | Zentroverse Global",
  seoDescription:
    "How Zentroverse Global Private Limited collects, uses, stores and protects your personal information when you use our website and business services.",
  path: "/privacy-policy",
  eyebrow: "Legal",
  title: "Privacy Policy",
  lastUpdated: "October 5, 2025",
  intro:
    `This Privacy Policy describes how ${COMPANY} ("Zentroverse", "we", "us") handles personal information when you visit ${WEBSITE}, use our products and platforms, submit forms, or engage our consulting and technology services.`,
  sections: [
    {
      title: "1. Information we collect",
      paragraphs: ["We may collect the following categories of information, depending on how you interact with us:"],
      bullets: [
        "Identity and contact details (name, email, phone, company, job title, address).",
        "Business and enquiry information you provide in forms, demos, consultations, or support requests.",
        "Account and usage data when you register for or use Zentroverse platforms (login identifiers, preferences, activity logs).",
        "Technical data (IP address, browser type, device information, pages visited, referral URLs) via cookies and similar technologies.",
        "Communications you send us (email, WhatsApp, calls) and related metadata where permitted by law.",
      ],
    },
    {
      title: "2. How we use your information",
      bullets: [
        "To respond to enquiries, provide demos, deliver services, and manage customer relationships.",
        "To operate, secure, and improve our websites, products, and internal systems.",
        "To send service-related updates, invoices, and—with your consent or as permitted—marketing communications.",
        "To comply with legal obligations, prevent fraud, and enforce our agreements.",
        "To analyse aggregated or de-identified trends to improve our offerings.",
      ],
    },
    {
      title: "3. Legal basis and consent",
      paragraphs: [
        "We process personal information based on your consent, performance of a contract, legitimate business interests (such as improving services and security), and compliance with applicable law. Where consent is required, you may withdraw it by contacting us; withdrawal does not affect processing already lawfully carried out.",
      ],
    },
    {
      title: "4. Sharing and disclosure",
      paragraphs: ["We do not sell your personal information. We may share data with:"],
      bullets: [
        "Service providers (hosting, analytics, CRM, messaging, payment processors) under contractual confidentiality and security obligations.",
        "Professional advisers where necessary (legal, accounting).",
        "Authorities when required by law or to protect rights, safety, and security.",
        "Successors in connection with a merger, acquisition, or asset transfer, subject to this Policy.",
      ],
    },
    {
      title: "5. Cookies and analytics",
      paragraphs: [
        "We use cookies and similar technologies to remember preferences, measure site performance, and support marketing attribution. You can control cookies through your browser settings; disabling cookies may limit some features. Third-party tools (for example, analytics or advertising pixels) may collect information according to their own policies.",
      ],
    },
    {
      title: "6. Data retention",
      paragraphs: [
        "We retain personal information only as long as needed for the purposes described in this Policy, to meet legal, tax, and accounting requirements, and to resolve disputes. Retention periods vary by data type and relationship with you.",
      ],
    },
    {
      title: "7. Security",
      paragraphs: [
        "We implement reasonable administrative, technical, and organisational measures to protect personal information. No method of transmission or storage is completely secure; we cannot guarantee absolute security.",
      ],
    },
    {
      title: "8. Your rights",
      paragraphs: [
        "Subject to applicable law (including India's Digital Personal Data Protection Act, 2023, where applicable), you may request access, correction, deletion, restriction, or portability of your personal data, or object to certain processing. To exercise these rights, contact us using the details below. You may also lodge a complaint with the relevant data protection authority.",
      ],
    },
    {
      title: "9. Children's privacy",
      paragraphs: [
        "Our services are directed at businesses and professionals. We do not knowingly collect personal information from children under 18 without parental consent.",
      ],
    },
    {
      title: "10. International transfers",
      paragraphs: [
        "Your information may be processed in India and, where we use cloud or SaaS providers, in other countries. We take steps to ensure appropriate safeguards when data is transferred across borders.",
      ],
    },
    {
      title: "11. Changes to this Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top will reflect revisions. Material changes may be communicated via the website or direct notice where appropriate.",
      ],
    },
    {
      title: "12. Contact us",
      paragraphs: [
        `For privacy-related questions or requests, contact ${COMPANY} at ${CONTACT_EMAIL} or write to our registered office address listed on the Contact page and website footer.`,
      ],
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  seoTitle: "Terms & Conditions | Zentroverse Global",
  seoDescription:
    "Terms and conditions governing use of the Zentroverse website, software platforms, and professional services.",
  path: "/terms-and-conditions",
  eyebrow: "Legal",
  title: "Terms & Conditions",
  lastUpdated: "October 5, 2025",
  intro:
    `These Terms & Conditions ("Terms") govern your access to ${WEBSITE} and use of products, platforms, and services offered by ${COMPANY} ("Zentroverse", "we", "us"). By using our website or engaging our services, you agree to these Terms.`,
  sections: [
    {
      title: "1. Services",
      paragraphs: [
        "Zentroverse provides business growth, digital marketing, consulting, software platforms (including CRM, ERP, automation, and related tools), and implementation services. Specific scope, deliverables, fees, and timelines are defined in quotations, statements of work, subscription plans, or separate agreements signed with you.",
      ],
    },
    {
      title: "2. Eligibility and accounts",
      bullets: [
        "You must be at least 18 years old and authorised to bind your organisation where you act on its behalf.",
        "You are responsible for maintaining the confidentiality of account credentials and for all activity under your account.",
        "You agree to provide accurate, current information and to notify us of unauthorised access promptly.",
      ],
    },
    {
      title: "3. Acceptable use",
      bullets: [
        "Do not misuse our website or platforms (including attempting unauthorised access, disrupting service, or uploading malicious code).",
        "Do not use our services for unlawful, fraudulent, or infringing activities.",
        "Comply with applicable laws, including telecommunications, data protection, and anti-spam regulations when using messaging or marketing features.",
        "You retain responsibility for content, leads, and customer data you upload or process through our systems.",
      ],
    },
    {
      title: "4. Intellectual property",
      paragraphs: [
        "Zentroverse and its licensors own all rights in our brands, websites, software, documentation, and proprietary methodologies. Except as expressly granted in a written agreement, no licence is granted to you. Client-provided materials remain yours; you grant us a limited licence to use them solely to deliver agreed services.",
      ],
    },
    {
      title: "5. Fees and payment",
      paragraphs: [
        "Fees are as quoted in proposals, invoices, or plan pages. Unless stated otherwise, amounts are exclusive of applicable taxes (including GST). Late payments may attract interest or suspension of services as permitted by law and your agreement with us.",
      ],
    },
    {
      title: "6. Third-party services",
      paragraphs: [
        "Our solutions may integrate with third-party APIs (for example, WhatsApp Business providers, ad platforms, or cloud hosts). Your use of those services is subject to the third party's terms and policies. We are not responsible for third-party outages or policy changes beyond our reasonable control.",
      ],
    },
    {
      title: "7. Disclaimers",
      paragraphs: [
        "Website content and tools are provided for general information and business use. Except where required by law, services are provided \"as is\" without warranties of uninterrupted operation or specific business outcomes. Marketing, lead generation, and growth results depend on many factors outside our control.",
      ],
    },
    {
      title: "8. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Zentroverse shall not be liable for indirect, incidental, special, or consequential damages, or for loss of profits, data, or goodwill. Our aggregate liability arising from these Terms or your use of services shall not exceed the fees paid by you to us in the twelve (12) months preceding the claim, except where liability cannot be limited under applicable law.",
      ],
    },
    {
      title: "9. Indemnity",
      paragraphs: [
        "You agree to indemnify and hold Zentroverse harmless from claims arising from your content, misuse of services, violation of these Terms, or infringement of third-party rights, to the extent permitted by law.",
      ],
    },
    {
      title: "10. Termination",
      paragraphs: [
        "We may suspend or terminate access for breach of these Terms or non-payment. You may stop using services according to your subscription or contract terms. Provisions that by nature should survive (including IP, liability limits, and governing law) will survive termination.",
      ],
    },
    {
      title: "11. Governing law and disputes",
      paragraphs: [
        "These Terms are governed by the laws of India. Courts at Patna, Bihar shall have exclusive jurisdiction, subject to any mandatory consumer protections or arbitration clauses in a signed commercial agreement between you and Zentroverse.",
      ],
    },
    {
      title: "12. Changes",
      paragraphs: [
        "We may update these Terms by posting a revised version on the website. Continued use after changes constitutes acceptance of the updated Terms where permitted by law.",
      ],
    },
    {
      title: "13. Contact",
      paragraphs: [
        `Questions about these Terms: ${CONTACT_EMAIL}. Registered entity: ${COMPANY}.`,
      ],
    },
  ],
};
