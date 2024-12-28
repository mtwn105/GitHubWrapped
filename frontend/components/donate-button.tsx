import Link from "next/link";

export default function DonateButton() {
  return (
    <Link
      href="https://checkout.dodopayments.com/buy/pdt_utV5Od6d2mwisWqSUciJu?quantity=1&redirect_url=https://githubwrapped.xyz"
      target="_blank"
      rel="noopener noreferrer"
      data-track="donate_click"
      className="fixed bottom-24 right-8 z-50 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform duration-200 text-sm"
    >
      ❤️ Support
    </Link>
  );
}
