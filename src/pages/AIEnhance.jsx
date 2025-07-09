import React, { useEffect, useState, useRef } from "react";

export default function AIEnhance() {
  const [resumeText, setResumeText] = useState("");
  const [original, setOriginal] = useState("");
  const [enhanced, setEnhanced] = useState("");
  const printableRef = useRef();

  useEffect(() => {
    const text = sessionStorage.getItem("resumeText");
    if (text) {
      setResumeText(text);
      setOriginal(text); // Directly display full resume content as original summary
    }
  }, []);

  const handleEnhance = () => {
    if (!original) {
      alert("No content to enhance.");
      return;
    }
    setEnhanced(`✨ Enhanced Summary:\n${original}`);
  };

  const handleSave = () => {
    const stored = sessionStorage.getItem("resumeData");
    if (stored) {
      const updated = { ...JSON.parse(stored), summary: enhanced };
      sessionStorage.setItem("resumeData", JSON.stringify(updated));
      alert("Enhanced summary saved to resume!");
    } else {
      alert("No resume data found to save.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-5xl mx-auto bg-gray-50 border rounded p-6">
        <h2 className="text-2xl font-bold mb-6">🤖 Enhance Summary from Resume</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Original Resume Content</label>
            <textarea
              className="w-full h-64 border rounded p-3 text-sm"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Enhanced Summary</label>
            <textarea
              className="w-full h-64 border rounded p-3 bg-gray-100 text-sm"
              value={enhanced}
              onChange={(e) => setEnhanced(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleEnhance}
          >
            ✨ Enhance with AI
          </button>

          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
            onClick={handleSave}
          >
            💾 Save to Resume
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

        {/* Hidden printable section */}
        <div className="hidden" ref={printableRef}>
          <h2 className="text-lg font-semibold">Enhanced Summary</h2>
          <p>{enhanced}</p>
        </div>
      </div>
    </div>
  );
}
