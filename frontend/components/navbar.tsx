import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div
      id="navbar-div"
      className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg text-white sticky top-0 z-50"
    >
      <Link
        data-track="navbar_home_click"
        href="/"
        className="text-base md:text-2xl font-bold"
      >
        GitHub Wrapped
      </Link>
      <Link
        data-track="navbar_generate_wrapped_click"
        className="text-xs md:text-base"
        href="/"
      >
        <Button className="bg-white text-black  hover:bg-white/90">
          Generate Wrapped
        </Button>
      </Link>
    </div>
  );
}
