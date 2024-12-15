import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div
      id="navbar-div"
      className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg text-white sticky top-0 z-50"
    >
      <Link href="/" className="text-2xl font-bold">
        GitHub Wrapped
      </Link>
      <Link href="/">
        <Button className="bg-white text-black hover:bg-white/90">
          Generate Wrapped
        </Button>
      </Link>
    </div>
  );
}
