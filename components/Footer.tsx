import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/70">
      <div className="container-custom py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-lg font-semibold tracking-widest uppercase text-white block mb-4">
            Judigoods
          </Link>
          <p className="text-xs leading-relaxed mb-6 max-w-xs text-white/50">
            Curated clothing, handmade accessories, artisan home décor, and lifestyle goods — ethically sourced, beautifully made.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: '#', label: 'Instagram' },
              { Icon: Facebook, href: '#', label: 'Facebook' },
              { Icon: Twitter, href: '#', label: 'Twitter' },
              { Icon: Youtube, href: '#', label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="h-8 w-8 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white mb-5">Shop</h4>
          <ul className="space-y-3">
            {[
              ['All Products', '/products'],
              ['New Arrivals', '/products?tag=new-arrival'],
              ['Sale', '/products?sale=true'],
              ['Clothing', '/products?category=clothing'],
              ['Accessories', '/products?category=accessories'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-xs text-white/50 hover:text-white transition-colors tracking-wide">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white mb-5">Help</h4>
          <ul className="space-y-3">
            {[
              ['Shipping Info', '/shipping'],
              ['Returns & Exchanges', '/returns'],
              ['FAQ', '/faq'],
              ['Contact Us', '/contact'],
              ['Size Guide', '/size-guide'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-xs text-white/50 hover:text-white transition-colors tracking-wide">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white mb-5">Company</h4>
          <ul className="space-y-3">
            {[
              ['Our Story', '/about'],
              ['Sustainability', '/sustainability'],
              ['Careers', '/careers'],
              ['Press', '/press'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-xs text-white/50 hover:text-white transition-colors tracking-wide">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <p className="text-[10px] tracking-widest uppercase text-white mb-2">Contact</p>
            <a href="mailto:hello@judigoods.com" className="text-xs text-white/50 hover:text-white transition-colors block mb-1">
              hello@judigoods.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-wider text-white/30">
            © {new Date().getFullYear()} Judigoods. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(label => (
              <Link key={label} href="/" className="text-[10px] tracking-wider text-white/30 hover:text-white/60">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] tracking-wider text-white/30">Secure checkout via Stripe</p>
        </div>
      </div>
    </footer>
  )
}
