import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react'

interface Props {
  searchParams: { session_id?: string }
}

export default function CheckoutSuccessPage({ searchParams }: Props) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 animate-fade-in">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for your order! We&apos;ve received your payment and are preparing your items with care. You&apos;ll receive a confirmation email shortly.
          </p>
        </div>

        {/* Order reference */}
        {searchParams.session_id && (
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="text-muted-foreground">Order Reference</p>
            <p className="font-mono font-medium text-foreground mt-1 text-xs break-all">
              {searchParams.session_id.slice(0, 30)}...
            </p>
          </div>
        )}

        {/* What's next */}
        <div className="rounded-xl border border-border bg-card p-5 text-left space-y-3">
          <h3 className="font-semibold text-sm">What happens next?</h3>
          {[
            { step: '1', text: "You'll receive an order confirmation email" },
            { step: '2', text: "We'll carefully package your items" },
            { step: '3', text: "Your order ships within 2-3 business days" },
            { step: '4', text: "Track your delivery via the link in your email" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {step}
              </span>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/account/orders" className="btn-primary justify-center py-3">
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
          <Link href="/products" className="btn-secondary justify-center py-3">
            <Home className="h-4 w-4" />
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
