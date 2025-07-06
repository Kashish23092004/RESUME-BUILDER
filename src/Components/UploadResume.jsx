import React, { useRef, useState } from "react";
import { Menu } from "@headlessui/react";
import { BsUpload } from "react-icons/bs";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function UploadResume() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const resumeRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsUploaded(true);
    } else {
      alert("Please select a file first!");
    }
  };

  const handleReset = () => {
    setIsUploaded(false);
    setSelectedFile(null);
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    const canvas = await html2canvas(resumeRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
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
        <div
          ref={resumeRef}
          className="w-full max-w-xl bg-white p-6 rounded-lg shadow"
        >
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            ✅ Resume uploaded successfully. Your resume has been uploaded and is ready for enhancement.
          </div>

          <h2 className="text-lg font-semibold mb-2">Resume Content Preview</h2>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Parsed resume content will go here..."
            defaultValue={`📄 ${selectedFile?.name}`}
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
                Upload Resume
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/ai"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        ✏️ Manual Edit
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/manual-edit"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm block`}
                      >
                        🤖 AI Edit
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>

            <button
              onClick={handleDownloadPDF}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
