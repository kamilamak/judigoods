import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const SHOP_LINKS = [
  { label: 'All Products', href: '/products' },
  { label: 'New Arrivals', href: '/products?tag=new-arrival' },
  { label: 'Sale Items', href: '/products?sale=true' },
  { label: 'Scarves & Wraps', href: '/products?category=scarves-wraps' },
  { label: 'Home & Decor', href: '/products?category=home-decor' },
]

const HELP_LINKS = [
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Story', href: '/about#story' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-2xl font-bold text-white mb-4 block">
              Judigoods
            </Link>
            <p className="text-brand-300 text-sm leading-relaxed mb-6 max-w-xs">
              Curated clothing, handmade scarves, artisan home décor, and lifestyle goods — ethically sourced, beautifully made.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-brand-300 hover:bg-brand-600 hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-4">Help</h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@judigoods.com" className="text-sm text-brand-300 hover:text-white">
                  hello@judigoods.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-sm text-brand-300 hover:text-white">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-brand-300">
                  123 Boutique Ave<br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-400">
            © {new Date().getFullYear()} Judigoods. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-brand-400 hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-brand-400 hover:text-white">Terms of Service</Link>
            <Link href="/cookies" className="text-xs text-brand-400 hover:text-white">Cookie Policy</Link>
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-2 text-xs text-brand-400">
            <span>Secure payments via</span>
            <span className="font-semibold text-white">Stripe</span>
            <span>· Visa · Mastercard · Amex · PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
