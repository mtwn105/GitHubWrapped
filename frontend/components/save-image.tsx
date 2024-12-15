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

        // Hide this button
        const twitterShareButton = document.getElementById(
          "twitter-share-button"
        );
        if (twitterShareButton) twitterShareButton.style.visibility = "hidden";

        // Add a para
        const para = document.createElement("p");
        para.textContent = "Generated using GitHubWrapped.xyz";
        para.className = "text-white p-8 text-xl font-bold text-center";
        document.body.appendChild(para);

        // Capture the screenshot
        const element = document.body; // Adjust to capture specific elements

        const canvas = await html2canvas(element, {
          useCORS: true,
        });

        // Restore the navbar
        if (navbar) navbar.style.visibility = "visible";
        if (saveimage) saveimage.style.visibility = "visible";
        if (twitterShareButton) twitterShareButton.style.visibility = "visible";

        // Remove p
        document.body.removeChild(para);

        // Convert to image and download
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "screenshot.png";
        link.click();
      }}
      className="fixed bottom-8 right-8 bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-white/90 transition-all duration-300 z-50"
    >
      <DownloadIcon className="w-4 h-4 mr-2 inline-block" />
      Save as Image
    </button>
  );
}
