import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/zentroverse-logo.jpg";
import { useCompanySection } from "@/hooks/useCmsSections";
import { telHref, whatsAppHref } from "@/lib/siteContact";
import { useSiteContact } from "@/hooks/useSiteContact";
import { ECOSYSTEM_PRODUCTS, FOOTER_QUICK_LINKS } from "@/data/navConfig";

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
} as const;

export const Footer = () => {
  const { company } = useCompanySection();
  const contact = useSiteContact();

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logo} alt="Zentroverse" className="h-10 w-10 rounded-lg" />
              <span className="brand-wordmark text-sm sm:text-base text-secondary-foreground">Zentroverse</span>
            </div>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed mb-5 max-w-sm">
              {company.tagline}
            </p>
            <div className="text-sm text-secondary-foreground/70 leading-relaxed whitespace-pre-line">
              <div className="font-semibold text-secondary-foreground mb-1">{company.legalName}</div>
              {company.address}
            </div>
            <div className="flex gap-2 mt-5">
              {company.social.filter((s) => s.url).map((s) => {
                const Icon = socialIcons[s.platform];
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-lg bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                    aria-label={s.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</div>
            <ul className="space-y-2.5">
              {FOOTER_QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="font-semibold mb-4 text-sm uppercase tracking-wider">Ecosystem</div>
            <ul className="space-y-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4">
              {ECOSYSTEM_PRODUCTS.map((p) => (
                <li key={p.href}>
                  <Link to={p.href} className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</div>
            <ul className="space-y-2.5 text-sm text-secondary-foreground/70">
              <li className="font-medium text-secondary-foreground">{company.legalName}</li>
              {company.gstin && <li>GSTIN: {company.gstin}</li>}
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-primary transition-colors">
                  {company.email}
                </a>
              </li>
              <li>
                <a href={company.website} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </li>
              <li>
                <a href={telHref(contact)} className="hover:text-primary transition-colors">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={whatsAppHref(contact)} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
              {company.hours && <li>{company.hours}</li>}
              {(company.bankName || company.accountNumber) && (
                <li className="pt-2 border-t border-white/10 mt-2 text-xs">
                  {company.bankName && <div>{company.bankName}</div>}
                  {company.accountName && <div>{company.accountName}</div>}
                  {company.accountNumber && <div>A/C: {company.accountNumber}</div>}
                  {company.ifsc && <div>IFSC: {company.ifsc}</div>}
                  {company.upi && <div>UPI: {company.upi}</div>}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-secondary-foreground/60">
          <div>© {new Date().getFullYear()} Zentroverse Global Private Limited. All rights reserved.</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center md:justify-end">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link>
            <Link to="/privacy-policy#5-cookies-and-analytics" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
