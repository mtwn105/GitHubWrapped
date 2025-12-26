"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Server,
  Code,
  Zap,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { useUmami } from "@/lib/umami";
import { Supporter } from "@/types/supporter";

const DODO_CHECKOUT_URL = "https://dodo.pe/gw-donation";

// Separate component that uses useSearchParams
function PaymentSuccessHandler({
  onSuccess,
}: {
  onSuccess: (paymentId: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const op = useUmami();

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    if (paymentId || status === "succeeded" || status === "success") {
      onSuccess(paymentId);
      op.track("donation_success", { payment_id: paymentId });

      // Clear URL params without page reload
      window.history.replaceState({}, "", "/support");
    }
  }, [searchParams, op, onSuccess]);

  return null;
}

function SupportPageContent() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const op = useUmami();

  const handlePaymentSuccess = useCallback(() => {
    setShowSuccessBanner(true);
  }, []);

  useEffect(() => {
    async function fetchSupporters() {
      try {
        const response = await fetch("/api/supporters");
        const data = await response.json();
        if (data.supporters) {
          setSupporters(data.supporters);
          setTotalCount(data.totalCount);
          setTotalAmount(data.totalAmount);
        }
      } catch (error) {
        console.error("Failed to fetch supporters:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSupporters();
  }, []);

  const handleDonateClick = useCallback(() => {
    op.track("donate_click", { location: "support_page" });
    window.open(DODO_CHECKOUT_URL, "_blank");
  }, [op]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Payment Success Handler - wrapped in Suspense */}
      <Suspense fallback={null}>
        <PaymentSuccessHandler onSuccess={handlePaymentSuccess} />
      </Suspense>

      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-500/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-400">
                    Thank you for your support!
                  </p>
                  <p className="text-sm text-white/60">
                    Your contribution helps keep GitHub Wrapped running.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 blur-3xl opacity-20" />
          <Heart className="w-16 h-16 text-pink-500 relative" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Help Keep GitHub Wrapped Running
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
          GitHub Wrapped is free for everyone. Your support helps cover the
          costs of running this service and keeps it available for the entire
          developer community.
        </p>

        {/* Donate Button */}
        <button
          onClick={handleDonateClick}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40"
        >
          <Heart className="w-5 h-5" />
          Support with a Donation
        </button>

        {totalCount > 0 && (
          <p className="mt-4 text-white/50 text-sm">
            {totalCount} supporter{totalCount !== 1 ? "s" : ""} have contributed{" "}
            {formatAmount(totalAmount, "USD")} so far!
          </p>
        )}
      </section>

      {/* Why Support Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Where Your Support Goes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Hosting & Infrastructure
            </h3>
            <p className="text-white/60 text-sm">
              Servers, databases, and CDN costs to keep the site fast and
              reliable for thousands of users.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">GitHub API Costs</h3>
            <p className="text-white/60 text-sm">
              Fetching your GitHub data requires API calls. More users means
              more API usage and costs.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">New Features</h3>
            <p className="text-white/60 text-sm">
              Your support enables development of new features, better
              analytics, and an improved experience.
            </p>
          </div>
        </div>
      </section>

      {/* Wall of Supporters */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Wall of Supporters
        </h2>
        <p className="text-white/60 text-center mb-12 max-w-lg mx-auto">
          A huge thank you to everyone who has supported GitHub Wrapped. You
          make this possible!
        </p>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : supporters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {supporters.map((supporter, index) => (
              <div
                key={`${supporter.name}-${index}`}
                className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-purple-500/50 hover:from-purple-500/10 hover:to-pink-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {supporter.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium text-sm truncate">{supporter.name}</p>
                <p className="text-pink-400 font-semibold text-sm mt-1">
                  {formatAmount(supporter.amount, supporter.currency)}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {formatDate(supporter.createdAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/50 mb-4">Be the first supporter!</p>
            <button
              onClick={handleDonateClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-4 h-4" />
              Make a Donation
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Every Contribution Counts
          </h2>
          <p className="text-white/60 mb-6">
            Whether it&apos;s a small token of appreciation or a generous
            contribution, every donation helps keep GitHub Wrapped running and
            improving.
          </p>
          <button
            onClick={handleDonateClick}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Heart className="w-5 h-5 text-pink-500" />
            Support Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default function SupportPage() {
  return <SupportPageContent />;
}
