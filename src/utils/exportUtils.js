import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function downloadSectionAsPDF(ref, filename = "resume.pdf") {
  if (!ref.current) return;

  html2canvas(ref.current, {
    scale: 2,
    useCORS: true,
    logging: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let y = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          y = -pageHeight;
        }
      }
    }

    pdf.save(filename);
  });
}
