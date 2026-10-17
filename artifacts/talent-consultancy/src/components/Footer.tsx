import { ArrowUpRight } from 'lucide-react';
import { FaLinkedinIn, FaInstagram, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import type { Translations } from '../content';
import { FortunaLogo } from './FortunaLogo';

export default function Footer({ t }: { t: Translations }) {
  const year = new Date().getFullYear();
  
  // Reemplaza con tu número corporativo real
  const whatsappNumber = "34600000000"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="site-footer">
      <div className="footer-top">
        {/* Columna 1: Logo y Tagline */}
        <div className="footer-brand-col">
          <a className="brand-lockup inline-block" href="#top" data-testid="link-footer-brand">
            <FortunaLogo className="h-8 w-auto" showText={true} lightMode={true} />
          </a>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <span className="footer-locations block mt-6 text-slate-400 text-xs">
            {t.footer.locations}
          </span>
        </div>

        {/* Columna 2: Explorar (Navegación) */}
        <div className="footer-column">
          <h3 className="eyebrow">{t.footer.explore}</h3>
          <a href="#companies" data-testid="link-footer-companies">
            {t.footer.companies} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a href="#pipeline" data-testid="link-footer-pipeline">
            {t.footer.pipeline} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a href="#candidate" data-testid="link-footer-connect">
            {t.footer.connect} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-column">
          <h3 className="eyebrow">{t.footer.contact}</h3>
          <a href="https://thefortunaconnect.com" target="_blank" rel="noreferrer" data-testid="link-footer-website">
            {t.footer.website} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a href="mailto:info@thefortunaconnect.com">
            info@thefortunaconnect.com <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          
          {/* Fila de Redes Sociales + WhatsApp solo con iconos */}
          <div className="flex items-center gap-4 mt-8">
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Contactar por WhatsApp"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/thefortunaconnect"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <FaLinkedinIn size={18} />
            </a>
            <a
              href="https://instagram.com/thefortunaconnect"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-slate-400 hover:text-pink-400 transition-colors"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://x.com/thefortunaconn"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="text-slate-400 hover:text-slate-100 transition-colors"
            >
              <FaXTwitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom flex justify-between items-center border-t border-slate-800 pt-5 mt-8">
        <p className="text-xs text-slate-500">© {year} Fortuna Connect. {t.footer.rights}</p>
        <span className="mono text-xs text-slate-500">FC / {String(year).slice(-2)}</span>
      </div>
    </footer>
  );
}