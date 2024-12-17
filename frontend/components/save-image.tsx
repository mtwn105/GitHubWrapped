"use client";

import html2canvas from "html2canvas";
import { DownloadIcon } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";
import { useCallback } from "react";

export default function SaveImageButton() {
  const op = useOpenPanel();

  const handleSaveImage = useCallback(async () => {
    op.track("save_image_start");

    // Hide elements
    const elements = {
      navbar: document.getElementById("navbar-div"),
      saveButton: document.getElementById("save-image-btn"),
      twitterButton: document.getElementById("twitter-share-button"),
    };

    // Hide elements
    Object.values(elements).forEach((el) => {
      if (el) el.style.visibility = "hidden";
    });

    // Add watermark
    const watermark = document.createElement("p");
    watermark.textContent = "Generated using GitHubWrapped.xyz";
    watermark.className =
      "text-white p-8 text-xl font-bold text-center font-mono";
    document.body.appendChild(watermark);

    try {
      // Capture screenshot
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        scale: 2,
        logging: false,
        allowTaint: true,
        backgroundColor: "#000000",
        windowWidth: 1400,
        windowHeight: 630,
        onclone: (clonedDoc) => {
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

      // Download image
      const dataURL = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "github-wrapped.png";
      link.click();

      op.track("save_image_complete");
    } finally {
      // Restore visibility
      Object.values(elements).forEach((el) => {
        if (el) el.style.visibility = "visible";
      });

      // Remove watermark
      document.body.removeChild(watermark);
    }
  }, [op]);

  return (
    <button
      id="save-image-btn"
      onClick={handleSaveImage}
      className="fixed bottom-8 right-8 bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold shadow-lg hover:bg-white/90 transition-all duration-300 z-50 text-sm md:text-base"
    >
      <DownloadIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 inline-block" />
      Save as Image
    </button>
  );
}
