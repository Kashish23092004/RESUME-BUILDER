import React, { useState } from "react";

const fontOptions = ["Inter", "Roboto", "Georgia", "Times New Roman", "Arial"];
const colorOptions = ["#000000", "#1F2937", "#4B5563", "#374151", "#6B7280"];

export default function AIEnhance() {
  const [fontStyle, setFontStyle] = useState("Inter");
  const [textColor, setTextColor] = useState("#000000");

  const [resumeData, setResumeData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    linkedin: "",
    location: "",
    summary: "",
    experience: [{ title: "", companyName: "", date: "", companyLocation: "", accomplishment: [""] }],
    education: [{ degree: "", institution: "", duration: "", location: "" }],
    achievements: [{ keyAchievements: "", describe: "" }],
    skills: [""],
    languages: [""],
    projects: [{ title: "", description: "", duration: "" }],
    courses: [{ title: "", description: "" }],
    certifications: [{ title: "", issuedBy: "", year: "" }],
    hobbies: [""]
  });

  const handleChange = (field, value) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  const handleArrayChange = (section, index, key, value) => {
    const updated = [...resumeData[section]];
    updated[index][key] = value;
    setResumeData({ ...resumeData, [section]: updated });
  };

  const handleListChange = (section, index, value) => {
    const updated = [...resumeData[section]];
    updated[index] = value;
    setResumeData({ ...resumeData, [section]: updated });
  };

  const addItem = (section, item) => {
    setResumeData({ ...resumeData, [section]: [...resumeData[section], item] });
  };

  const removeItem = (section, index) => {
    const updated = [...resumeData[section]];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, [section]: updated });
  };

  const handleSubmit = () => {
    const cleanedData = JSON.parse(JSON.stringify(resumeData));
    Object.keys(cleanedData).forEach((key) => {
      const value = cleanedData[key];
      if (Array.isArray(value)) {
        cleanedData[key] = value.filter((item) => {
          if (typeof item === "string") return item.trim() !== "";
          return Object.values(item).some((val) =>
            Array.isArray(val)
              ? val.some((v) => v.trim() !== "")
              : val?.toString().trim() !== ""
          );
        });
        if (cleanedData[key].length === 0) delete cleanedData[key];
      } else if (typeof value === "string" && value.trim() === "") {
        delete cleanedData[key];
      }
    });
    cleanedData.fontStyle = fontStyle;
    cleanedData.textColor = textColor;

    console.log("Submitted Resume Data:", cleanedData);
    alert("Resume submitted successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎨 Customize & Enhance Resume</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Font Style</label>
        <select
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {fontOptions.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Text Color</label>
        <div className="flex gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setTextColor(color)}
              style={{
                backgroundColor: color,
                width: 28,
                height: 28,
                borderRadius: "100%",
                border: textColor === color ? "2px solid #000" : "1px solid #ccc"
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="p-4 border rounded bg-gray-50 mb-8"
        style={{ fontFamily: fontStyle, color: textColor }}
      >

        <h2 className="text-lg font-semibold">Preview</h2>
        <p className="text-sm">Name: {resumeData.name || "Your Name"}</p>
        <p className="text-sm">Role: {resumeData.role || "Your Role"}</p>
        <p className="text-sm">{resumeData.summary || "Your professional summary..."}</p>
      </div>

      {["name", "role", "phone", "email", "linkedin", "location", "summary"].map((field) => (
        <div className="mb-4" key={field}>
          <label className="block capitalize font-medium">{field}</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={resumeData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}

      {["skills", "languages", "hobbies"].map((key) => (
        <div key={key} className="mb-6">
          <label className="font-medium capitalize">{key}</label>
          {resumeData[key].map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="flex-1 border p-2 rounded"
                value={item}
                onChange={(e) => handleListChange(key, i, e.target.value)}
              />
              <button onClick={() => removeItem(key, i)} className="text-red-600">🗑️</button>
            </div>
          ))}
          <button onClick={() => addItem(key, "")} className="text-blue-600 text-sm">➕ Add {key.slice(0, -1)}</button>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
