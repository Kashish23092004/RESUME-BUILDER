import React from "react";
import { FaDownload, FaShareAlt, FaSave } from "react-icons/fa";
import { BsUpload, BsRobot } from "react-icons/bs";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  shareTextOnWhatsApp,
  shareTextOnFacebook,
  shareTextOnTwitter,
  nativeWebShare,
} from "../utils/shareUtils"; 
import { Link } from "react-router-dom";
export default function HeaderBar({ resumeRef, resumeData, setResumeData }) {
  const handleDownload = async () => {
    const canvas = await html2canvas(resumeRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("Resume.pdf");
    toast.success("📄 Resume downloaded!");
  };

  const handleShare = () => {
    const message = encodeURIComponent("📄 Check out my resume!");
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  };

  const handleSave = () => {
    const cleaned = cleanResumeData(resumeData);
    localStorage.setItem("resume", JSON.stringify(cleaned));
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
                <Link to='/manual-edit'>
                 <Link to='/ai'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleUpload("manual")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md`}
                    >
                      📝 Manual Edit
                    </button>
                  )}
                </Menu.Item>
                </Link>
                </Link>
                <Link to='manual-edit'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleUpload("ai")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } px-4 py-2 text-sm w-full text-left rounded-md`}
                    >
                      🤖 AI Edit
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
=
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

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-red-600 transition-all"
          >
            <FaDownload className="text-lg" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
