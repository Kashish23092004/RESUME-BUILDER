import React from "react";
import { FaDownload, FaShareAlt, FaSave } from "react-icons/fa";
import { BsUpload, BsRobot } from "react-icons/bs";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  shareTextOnWhatsApp,
  shareTextOnFacebook,
  shareTextOnTwitter,
  nativeWebShare,
} from "../utils/shareUtils";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function HeaderBar({ resumeRef, resumeData, setResumeData }) {
  const downloadResume = () => {
    if (!resumeRef || !resumeRef.current) {
      toast.error("❌ Resume preview not found!");
      return;
    }

    const resumeElement = resumeRef.current;

    html2canvas(resumeElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    });
  };

  const handleShare = () => {
    const message = "📄 Check out my resume!";
    shareTextOnWhatsApp(message);
    shareTextOnFacebook(message);
    shareTextOnTwitter(message);
    nativeWebShare(message);
  };

  const handleSave = () => {
    localStorage.setItem("resume", JSON.stringify(resumeData));
    toast.success("💾 Resume saved locally!");
  };

  const handleUpload = (type) => {
    toast.info(`📤 Upload selected: ${type}`);
  };

  const handleAIAction = (type) => {
    toast.info(`🤖 AI Action: ${type}`);
  };

  return (
    <div className="w-full bg-white border-b shadow px-4 py-2.5 sticky top-0 z-50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 flex-wrap">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md text-sm shadow hover:bg-gray-200 transition-all">
              <BsUpload className="text-lg" />
              Upload Resume
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-1 py-1.5">
                <Link to="/manual-edit">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleUpload("manual")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } px-4 py-2 text-sm w-full text-left rounded-md`}
                      >
                        📝 AI Edit
                      </button>
                    )}
                  </Menu.Item>
                </Link>
                <Link to="/ai">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleUpload("ai")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } px-4 py-2 text-sm w-full text-left rounded-md`}
                      >
                        🤖 MANUAL Edit
                      </button>
                    )}
                  </Menu.Item>
                </Link>
              </div>
            </Menu.Items>
          </Menu>

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
                      onClick={() => handleAIAction("profile")}
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
                      onClick={() => handleAIAction("experience")}
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
                      onClick={() => handleAIAction("projects")}
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

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-blue-200 transition-all"
          >
            <FaSave className="text-lg" />
            Save
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-green-100 text-green-900 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-green-200 transition-all"
          >
            <FaShareAlt className="text-lg" />
            Share
          </button>

          
        </div>
      </div>
    </div>
  );
}
