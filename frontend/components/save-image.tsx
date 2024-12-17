"use client";

import html2canvas from "html2canvas";
import { DownloadIcon } from "lucide-react";

export default function SaveImageButton() {
  return (
    <button
      id="save-image-btn"
      onClick={async () => {
        // Hide the navbar
        const navbar = document.getElementById("navbar-div");
        if (navbar) navbar.style.visibility = "hidden";

        // Hide this button
        const saveimage = document.getElementById("save-image-btn");
        if (saveimage) saveimage.style.visibility = "hidden";

        // Hide twitter share button
        const twitterShareButton = document.getElementById(
          "twitter-share-button"
        );
        if (twitterShareButton) twitterShareButton.style.visibility = "hidden";

        // Add watermark
        const watermark = document.createElement("p");
        watermark.textContent = "Generated using GitHubWrapped.xyz";
        watermark.className =
          "text-white p-8 text-xl font-bold text-center font-mono";
        document.body.appendChild(watermark);

        // Set fixed dimensions for consistent output
        const FIXED_WIDTH = 1200;
        const FIXED_HEIGHT = 630;

        // Capture the screenshot with fixed dimensions
        const element = document.body;
        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2, // Increase quality
          logging: false,
          allowTaint: true,
          backgroundColor: "#000000",
          windowWidth: FIXED_WIDTH,
          windowHeight: FIXED_HEIGHT,
          onclone: (clonedDoc) => {
            // Ensure fonts are loaded in cloned document
            const style = clonedDoc.createElement("style");
            style.textContent = `
              @font-face {
                font-family: 'Geist Mono';
                src: url('/fonts/GeistMonoVF.woff') format('woff');
                font-weight: 100 900;
              }
              * {
                font-family: 'Geist Mono', monospace;
              }
            `;
            clonedDoc.head.appendChild(style);
          },
        });

        // Restore hidden elements
        if (navbar) navbar.style.visibility = "visible";
        if (saveimage) saveimage.style.visibility = "visible";
        if (twitterShareButton) twitterShareButton.style.visibility = "visible";

        // Remove watermark
        document.body.removeChild(watermark);

        // Download image with better quality
        const dataURL = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "github-wrapped.png";
        link.click();
      }}
      className="fixed bottom-8 right-8 bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold shadow-lg hover:bg-white/90 transition-all duration-300 z-50 text-sm md:text-base"
    >
      <DownloadIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 inline-block" />
      Save as Image
    </button>
  );
}
