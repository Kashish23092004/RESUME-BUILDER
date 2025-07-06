import React, { useRef, useState } from "react";
import { Menu } from "@headlessui/react";
import { downloadSectionAsPDF, shareEnhancedContent } from "../utils/exportUtils";

export default function ManualEdit() {
  const printableRef = useRef();
  const [original, setOriginal] = useState("");
  const [enhanced, setEnhanced] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-6xl mx-auto" ref={printableRef}>
      <h1 className="text-2xl font-bold text-center mb-6">AI Resume Enhancement</h1>
      <p className="text-center text-gray-500 mb-6">
        Enhance your resume content with our AI-powered tools to make it more impactful and ATS-friendly
      </p>

      <label className="block font-semibold mb-1">Select Section to Enhance</label>
      <select className="border p-2 rounded w-full mb-4">
        <option>Professional Summary</option>
        <option>Skills</option>
        <option>Experience</option>
        <option>Projects</option>
      </select>

      <div className="mb-6">
        <label className="block font-semibold mb-1">AI Assistant</label>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            🧠 AI Assistant
          </Menu.Button>

          <Menu.Items className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setEnhanced(`Improved Profile: ${original}`)}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    🧑‍💼 Improve Profile with AI
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setEnhanced(`Enhanced Experience: ${original}`)}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    💼 Enhance Experience with AI
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setEnhanced(`Improved Project Description: ${original}`)}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    📁 AI-Powered Projects Description
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Original Content</label>
          <textarea
            className="w-full h-40 border rounded p-2"
            placeholder="Enter your summary content here..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Enhanced Content</label>
          <textarea
            className="w-full h-40 border rounded p-2 bg-gray-100"
            placeholder="Enhanced content will appear here..."
            value={enhanced}
            onChange={(e) => setEnhanced(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setEnhanced(`AI Enhanced: ${original}`)}
        >
          ✨ Enhance with AI
        </button>

        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
          onClick={() => alert("Enhanced content saved!")}
        >
          💾 Save Enhanced Content
        </button>

        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => shareEnhancedContent(enhanced)}
        >
          📤 Share
        </button>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          onClick={() => downloadSectionAsPDF(printableRef)}
        >
          📄 Download PDF
        </button>
      </div>
      <div className="mt-8">
        <h3 className="font-bold text-md mb-2">📌 Tips for Summary Enhancement</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          <li>Keep your summary concise (3–5 sentences)</li>
          <li>Highlight your most relevant skills and experiences</li>
          <li>Include quantifiable achievements where possible</li>
        </ul>
      </div>
    </div>
  );
}
