import html2canvas from "html2canvas";
import jsPDF from "jspdf";


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
 * @param {RefObject} ref 
 */
export const downloadSectionAsPDF = async (ref) => {
  if (!ref?.current) return;

  const canvas = await html2canvas(ref.current);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("enhanced-content.pdf");
};
