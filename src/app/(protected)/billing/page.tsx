"use client"

import { Info, CreditCard, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { Button } from '~/components/ui/button'
import { Slider } from '~/components/ui/slider'
import { createRazorpayOrder, verifyRazorpayPayment } from '~/lib/razorpay'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay: any
  }
}

const BillingPage = () => {
    const { data: user, refetch: refetchCredits } = api.project.getMyCredits.useQuery()
    const { data: purchaseHistory, refetch: refetchHistory } = api.project.getPurchaseHistory.useQuery()
    const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100])
    const [isProcessing, setIsProcessing] = useState(false)
    const creditsToBuyAmount = creditsToBuy[0]!
    const priceINR = Math.round((creditsToBuyAmount / 50) * 80)
    const priceUSD = (creditsToBuyAmount / 50).toFixed(2)

    const handleRazorpayPayment = async () => {
        setIsProcessing(true)
        try {
            const order = await createRazorpayOrder(creditsToBuyAmount)

            if (!order.success) {
                toast.error(order.error || 'Failed to initialize payment')
                setIsProcessing(false)
                return
            }

            // Demo Mode Simulation when Razorpay keys are not provided
            if (order.isDemo || typeof window === 'undefined' || !window.Razorpay) {
                await verifyRazorpayPayment(order.orderId!, 'pay_demo_mock', 'sig_demo_mock', creditsToBuyAmount)
                toast.success(`Demo Mode: Added ${creditsToBuyAmount} credits successfully!`)
                refetchCredits?.()
                refetchHistory?.()
                setIsProcessing(false)
                return
            }

            // Real Razorpay Checkout Popup
            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: 'RepoMind',
                description: `${creditsToBuyAmount} RepoMind Credits`,
                image: '/favicon.ico',
                order_id: order.orderId,
                handler: async function (response: any) {
                    const verification = await verifyRazorpayPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                        creditsToBuyAmount
                    )

                    if (verification.success) {
                        toast.success(`Payment Successful! Added ${creditsToBuyAmount} credits to your account.`)
                        refetchCredits?.()
                        refetchHistory?.()
                    } else {
                        toast.error(verification.error || 'Payment verification failed.')
                    }
                    setIsProcessing(false)
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false)
                    },
                },
                prefill: {
                    name: 'RepoMind Developer',
                    email: 'developer@repomind.ai',
                },
                theme: {
                    color: '#2563eb',
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', function (resp: any) {
                toast.error(`Payment failed: ${resp.error.description}`)
                setIsProcessing(false)
            })
            rzp.open()
        } catch (error: any) {
            console.error('Payment error:', error)
            toast.error(error?.message || 'Error processing payment')
            setIsProcessing(false)
        }
    }

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usage &amp; Billing</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your RepoMind indexing credits with Razorpay payment processing.
                    </p>
                </div>

                {/* Current Balance Card */}
                <div className="rounded-lg border bg-card p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Available Credits</span>
                        <div className="text-3xl font-extrabold text-primary mt-1">
                            {user?.credits ?? 1240} <span className="text-sm font-normal text-muted-foreground">Credits</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-3.5" /> Active Plan
                        </span>
                    </div>
                </div>

                {/* Credit Explanation */}
                <div className="bg-primary/10 px-4 py-3 rounded-lg border border-primary/20 text-primary flex items-start gap-3">
                    <Info className="size-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold">How Credits Work in RepoMind</p>
                        <p className="text-xs text-primary/80 mt-0.5">
                            Each credit allows you to parse, chunk, and index 1 repository file with vector embeddings. E.g., a project with 100 files requires 100 credits for full semantic indexing.
                        </p>
                    </div>
                </div>

                {/* Purchase Credits Card */}
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-semibold">Purchase Credits</h2>
                        <div className="text-right">
                            <span className="text-xl font-bold text-primary">₹{priceINR} INR</span>
                            <span className="text-xs text-muted-foreground ml-2">(${priceUSD} USD)</span>
                        </div>
                    </div>

                    <Slider
                        defaultValue={[100]}
                        max={1000}
                        step={10}
                        min={10}
                        onValueChange={(value) => setCreditsToBuy(value)}
                        value={creditsToBuy}
                    />

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10 credits (Min)</span>
                        <span>Selected: <strong>{creditsToBuyAmount} credits</strong></span>
                        <span>1,000 credits (Max)</span>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                        <Button
                            size="lg"
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            onClick={handleRazorpayPayment}
                            disabled={isProcessing}
                        >
                            <QrCode className="size-4" />
                            {isProcessing ? 'Opening Razorpay...' : `Pay ₹${priceINR} with Razorpay (UPI / Card)`}
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        Supports Google Pay, PhonePe, Paytm UPI, Debit/Credit Cards, and NetBanking.
                    </p>
                </div>

                {/* Purchase History Section */}
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-semibold">Transaction History (Payment Transactions)</h2>
                    {purchaseHistory && purchaseHistory.length > 0 ? (
                        <div className="rounded-md border divide-y">
                            {purchaseHistory.map((transaction) => (
                                <div key={transaction.id} className="flex justify-between items-center p-3 text-sm">
                                    <span className="text-muted-foreground">
                                        {transaction.createdAt.toLocaleString(undefined, {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span className="font-semibold text-emerald-600">+{transaction.credits} Credits</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                            No transactions recorded yet. Click &quot;Pay with Razorpay&quot; to test the credit top-up!
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default BillingPage