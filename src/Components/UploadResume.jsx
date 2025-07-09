import React, { useRef, useState } from "react";
import { Menu } from "@headlessui/react";
import { BsUpload, BsShare } from "react-icons/bs";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
const handleDownloadPDF = async (ref) => {
  if (!ref?.current) return;
  
  try {
    const canvas = await html2canvas(ref.current, {
      useCORS: true,
      scale: 2,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Resume.pdf");
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

const shareTextOnWhatsApp = (text) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

const shareTextOnFacebook = (text) => {
  const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

const shareTextOnTwitter = (text) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

const nativeWebShare = async (text) => {
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

export default function UploadResume() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first!");

    const file = selectedFile;
    let textContent = "";

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map((item) => item.str).join(" ");
            textContent += text + "\n";
          }
          finishParsing(textContent);
        } catch (error) {
          console.error("PDF parsing failed:", error);
          alert("Failed to parse PDF. Please try another file.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    else if (file.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: reader.result });
          textContent = result.value;
          finishParsing(textContent);
        } catch (error) {
          console.error("DOCX parsing failed:", error);
          alert("Failed to parse DOCX. Please try another file.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    else {
      alert("Unsupported file type. Please upload PDF or DOCX.");
    }
  };

  const finishParsing = (rawText) => {
    setParsedText(rawText);
    sessionStorage.setItem("resumeText", rawText);
    setIsUploaded(true);
  };

  const handleReset = () => {
    setIsUploaded(false);
    setSelectedFile(null);
    setParsedText("");
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    await handleDownloadPDF(resumeRef);
    setIsDownloading(false);
  };

  const handleShare = (platform) => {
    const shareText = `Check out my enhanced resume!\n\n${parsedText.substring(0, 200)}...`;
    
    switch (platform) {
      case 'whatsapp':
        shareTextOnWhatsApp(shareText);
        break;
      case 'facebook':
        shareTextOnFacebook(shareText);
        break;
      case 'twitter':
        shareTextOnTwitter(shareText);
        break;
      case 'native':
        nativeWebShare(shareText);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center">Upload Your Resume</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Upload your resume in PDF or Word format to get started with AI enhancement
      </p>

      {!isUploaded ? (
        <div className="w-full max-w-xl bg-white border-2 border-dashed border-gray-300 p-10 rounded-lg shadow-sm text-center">
          <div className="text-5xl mb-4">📤</div>
          <p className="mb-1 font-medium">Drag & drop your resume here</p>
          <label
            htmlFor="fileUpload"
            className="text-sm text-blue-500 cursor-pointer hover:underline"
          >
            or browse files
          </label>
          <input
            id="fileUpload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          <p className="text-sm text-gray-400 mt-2">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>

          {selectedFile && (
            <div className="mt-4 bg-gray-100 p-2 rounded text-sm">
              📄 {selectedFile.name}{" "}
              <span className="text-gray-400 ml-2">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          <button
            onClick={handleUpload}
            className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Upload Resume
          </button>
        </div>
      ) : (
        <div ref={resumeRef} className="w-full max-w-xl bg-white p-6 rounded-lg shadow">
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            ✅ Resume uploaded successfully. You can now enhance it.
          </div>

          <h2 className="text-lg font-semibold mb-2">Resume Content Preview</h2>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={parsedText}
            readOnly
          />

          <div className="flex justify-end flex-wrap gap-4">
            <button
              onClick={handleReset}
              className="border px-4 py-2 rounded hover:bg-gray-100 text-sm"
            >
              Upload Another Resume
            </button>

            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                <BsUpload />
                Continue
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/manual-edit"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        ✏️ AI ENHANCED
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/ai"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        🤖 MANUAL EDIT
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>

            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? "Generating..." : "📄 Download PDF"}
            </button>

            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                <BsShare />
                Share
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        📱 WhatsApp
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleShare('facebook')}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        📘 Facebook
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleShare('twitter')}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        🐦 Twitter
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleShare('native')}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        🔗 More Options
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      )}
    </div>
  );
}