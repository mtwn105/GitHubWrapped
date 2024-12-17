import Link from "next/link";

export default function Footer() {
  return (
    <div className="p-8 mb-32 text-center bg-black">
      <p className="text-sm md:text-base text-white/80">
        Created by{" "}
        <Link
          href="https://x.com/mtwn105"
          className="text-white hover:underline"
          data-track="footer_twitter_profile_click"
        >
          Amit Wani
        </Link>{" "}
        (
        <Link
          href="https://x.com/mtwn105"
          className="text-white hover:underline"
          data-track="footer_twitter_click"
        >
          X
        </Link>
        {" / "}
        <Link
          href="https://github.com/mtwn105"
          className="text-white hover:underline"
          data-track="footer_github_click"
        >
          GitHub
        </Link>
        )
      </p>
    </div>
  );
}
