import React from "react";
import { BsUpload, BsRobot } from "react-icons/bs";
import { FaSave, FaShareAlt } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function HeaderBar({ resumeRef, resumeData }) {
  // === Share Utilities ===
  const shareTextOnWhatsApp = (text) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTextOnFacebook = (text) => {
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTextOnTwitter = (text) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
        toast.error("Sharing cancelled or failed.");
      }
    } else {
      toast.info("Web Share API not supported on this browser.");
    }
  };

  // === Handlers ===

  const downloadResume = () => {
    if (!resumeRef || !resumeRef.current) {
      toast.error("❌ Resume preview not found!");
      return;
    }
    const resumeElement = resumeRef.current;

    html2canvas(resumeElement, { scale: 2, backgroundColor: "#ffffff" }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    });
  };

  const handleSave = () => {
    if (!resumeData || resumeData.trim() === "") {
      toast.error("❌ No resume data to save!");
      return;
    }
    localStorage.setItem("resume", JSON.stringify(resumeData));
    toast.success("💾 Resume saved locally!");
  };

  const handleAIEdit = () => {
    toast.info("🤖 AI Edit selected");
    // TODO: Insert your AI Edit logic (modal, navigation, etc.)
  };

  const handleManualEdit = () => {
    toast.info("📤 Manual Edit selected");
    // TODO: Insert your Manual Edit logic (modal, navigation, etc.)
  };

  const handleShare = (platform) => {
    if (!resumeData) {
      toast.error("❌ No resume data to share!");
      return;
    }
    const message = `📄 Check out my resume!\n\n${resumeData.substring(0, 200)}...`;
    switch (platform) {
      case "whatsapp":
        shareTextOnWhatsApp(message);
        break;
      case "facebook":
        shareTextOnFacebook(message);
        break;
      case "twitter":
        shareTextOnTwitter(message);
        break;
      case "native":
        nativeWebShare(message);
        break;
      default:
        toast.error("❌ Unknown share platform");
    }
  };

  return (
    <div className="w-full bg-white border-b shadow px-4 py-2.5 sticky top-0 z-50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Section: Upload Resume & AI Assistant */}
        <div className="flex gap-3 flex-wrap">
          {/* Upload Resume Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md text-sm shadow hover:bg-gray-200 transition-all">
              <BsUpload className="text-lg" />
              Upload Resume
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-1 py-1.5">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={handleAIEdit}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md flex items-center`}
                    >
                      📝 AI Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={handleManualEdit}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md flex items-center`}
                    >
                      🤖 Manual Edit
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>

          {/* AI Assistant Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md text-sm shadow hover:bg-gray-200 transition-all">
              <BsRobot className="text-lg" />
              AI Assistant
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-1 py-1.5">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => toast.info("💡 Improve Profile with AI")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md`}
                    >
                      💡 Improve Profile with AI
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => toast.info("💼 Enhance Experience with AI")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md`}
                    >
                      💼 Enhance Experience with AI
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => toast.info("🔬 AI-Powered Project Descriptions")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md`}
                    >
                      🔬 AI-Powered Project Descriptions
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>

        {/* Right Section: Save, Share, Download */}
        <div className="flex gap-3 flex-wrap items-center">
          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-blue-200 transition-all"
          >
            <FaSave className="text-lg" />
            Save
          </button>

          {/* Share Menu */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 bg-green-100 text-green-900 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-green-200 transition-all">
              <FaShareAlt className="text-lg" />
              Share
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm rounded`}
                    >
                      📱 WhatsApp
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleShare("facebook")}
                      className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm rounded`}
                    >
                      📘 Facebook
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleShare("twitter")}
                      className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm rounded`}
                    >
                      🐦 Twitter
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleShare("native")}
                      className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm rounded`}
                    >
                      🔗 More...
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>

          {/* Download Button */}
          <button
            type="button"
            onClick={downloadResume}
            className="flex items-center gap-2 bg-red-100 text-red-900 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-red-200 transition-all"
          >
            📄 Download
          </button>
        </div>
      </div>
    </div>
  );
}
