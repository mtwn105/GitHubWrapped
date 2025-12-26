import Link from "next/link";
import { Heart } from "lucide-react";

export default function DonateButton() {
  return (
    <Link
      href="/support"
      data-track="donate_click"
      className="fixed bottom-24 right-8 z-50 group"
    >
      <span className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2.5 rounded-full font-medium shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 hover:from-pink-600 hover:to-purple-700">
        <Heart className="w-4 h-4 group-hover:animate-pulse" />
        <span className="text-sm">Support</span>
      </span>
      {/* Subtle pulse animation */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-ping opacity-20" />
    </Link>
  );
}
