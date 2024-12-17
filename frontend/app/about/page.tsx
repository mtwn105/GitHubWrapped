import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 mt-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            About GitHub Wrapped
          </h1>
          <p className="text-lg text-white/80">
            Your personalized year in review for GitHub contributions and coding
            activity.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-6 md:p-8">
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">
              What is GitHub Wrapped?
            </h2>
            <p className="text-white/80">
              GitHub Wrapped provides developers with beautiful, shareable
              insights into their coding journey throughout 2024. See your
              contributions, most active repositories, favorite languages, and
              more - all in one place.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>Visualize your contribution patterns</li>
              <li>Track commits, pull requests, and issues</li>
              <li>See your most-used programming languages</li>
              <li>Share your stats on social media</li>
              <li>Compare with top GitHub contributors</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">Open Source</h2>
            <p className="text-white/80">
              GitHub Wrapped is open source and available on GitHub.
              Contributions are welcome!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://github.com/mtwn105/GithubWrapped"
                target="_blank"
              >
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
                  Generate Your Wrapped
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
