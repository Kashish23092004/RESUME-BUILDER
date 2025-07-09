// utils/exportUtils.js

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Downloads any section of the DOM as PDF using a ref.
 * @param {React.RefObject} ref
 */
export const downloadSectionAsPDF = async (ref) => {
  if (!ref?.current) return;

  const canvas = await html2canvas(ref.current);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("enhanced-content.pdf");
};

/**
 * Shares resume content using Web Share API or fallback to WhatsApp
 * @param {string} content
 */
export const shareEnhancedContent = (content) => {
  const message = `🚀 Here's my enhanced resume content:\n\n${content}`;

  if (navigator.share) {
    navigator
      .share({
        title: "My Enhanced Resume Content",
        text: message,
        url: window.location.href,
      })
      .catch((err) => console.error("Sharing failed", err));
  } else {
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  }
};

/**
 * Direct share to WhatsApp
 * @param {string} text
 */
export const shareTextOnWhatsApp = (text) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

/**
 * Direct share to Facebook
 * @param {string} text
 */
export const shareTextOnFacebook = (text) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

/**
 * Direct share to Twitter
 * @param {string} text
 */
export const shareTextOnTwitter = (text) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

/**
 * Use native Web Share API if supported
 * @param {string} text
 */
export const nativeWebShare = async (text) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Resume Enhancement",
        text,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  } else {
    alert("Web Share not supported on this browser.");
  }
};
