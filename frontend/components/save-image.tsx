"use client";

import html2canvas from "html2canvas";
import { DownloadIcon } from "lucide-react";
import { useUmami } from "@/lib/umami";
import { useCallback } from "react";

// Convert an image URL to base64 via our proxy
async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    // Use our proxy API to fetch the image with proper CORS headers
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return imageUrl; // Return original URL as fallback
  }
}

export default function SaveImageButton() {
  const op = useUmami();

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

    // Pre-convert external images to base64 for CORS compatibility
    const externalImages = document.querySelectorAll('img[src*="githubusercontent.com"], img[src*="github.com"], img[data-avatar="true"]');
    const imageMap = new Map<string, string>();

    await Promise.all(
      Array.from(externalImages).map(async (img) => {
        const src = img.getAttribute("src");
        if (src && !imageMap.has(src)) {
          const base64 = await convertImageToBase64(src);
          imageMap.set(src, base64);
        }
      })
    );

    try {
      // Capture screenshot
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        scale: 2,
        logging: false,
        allowTaint: false,
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

          // Replace external image sources with base64 in the cloned document
          const clonedImages = clonedDoc.querySelectorAll('img[src*="githubusercontent.com"], img[src*="github.com"], img[data-avatar="true"]');
          clonedImages.forEach((img) => {
            const src = img.getAttribute("src");
            if (src && imageMap.has(src)) {
              img.setAttribute("src", imageMap.get(src)!);
            }
          });
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
