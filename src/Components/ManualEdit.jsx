import React, { useRef, useState, useEffect } from "react";
import { Upload, ZoomIn, ZoomOut, User, GraduationCap, Briefcase, Brain, Download, Palette, Type, Plus, X } from "lucide-react";
import html2canvas from "html2canvas";

import jsPDF from "jspdf";

const ManualEdit = () => {
  const fileInputRef = useRef();
  const [zoom, setZoom] = useState(100);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(14);
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [showCustomization, setShowCustomization] = useState(false);
  const printRef = useRef(); 

  const [resumeData, setResumeData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    linkedin: "",
    location: "",
    summary: "",
    experience: [
      {
        title: "",
        companyName: "",
        date: "",
        companyLocation: "",
        accomplishment: [""]
      }
    ],
    education: [
      {
        degree: "",
        institution: "",
        duration: "",
        location: ""
      }
    ],
    achievements: [
      {
        keyAchievements: "",
        describe: ""
      }
    ],
    skills: [""],
    languages: [""],
    projects: [
      {
        title: "",
        description: "",
        duration: ""
      }
    ],
    courses: [
      {
        title: "",
        description: ""
      }
    ]
  });

  const fonts = ["Arial", "Times New Roman", "Helvetica", "Georgia", "Lato", "Roboto"];
  const colorPresets = ["#3B82F6", "#10B981", "#8B5CF6", "#1F2937"];

  const handleZoom = (value) => setZoom((z) => Math.min(200, Math.max(50, z + value)));

  const updateResumeData = (path, value) => {
    setResumeData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];

        if (!isNaN(nextKey)) {
          if (!current[key]) current[key] = [];
        } else {
          if (!current[key]) current[key] = {};
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (path, defaultItem) => {
    setResumeData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      if (!current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = [];
      }
      current[keys[keys.length - 1]].push(defaultItem);
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setResumeData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]].splice(index, 1);
      return newData;
    });
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current; 
    if (!element) {
      alert("Resume preview element not found for PDF generation.");
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2 }); 
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgWidth = 595; 
      const pageHeight = 842; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('my-resume.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadJSON = () => {
    try {
      const json = JSON.stringify(resumeData, null, 2); // null, 2 for pretty-printing
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading JSON:", error);
      alert("Failed to download JSON data.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setResumeData(data);
          alert('Resume data loaded successfully!');
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid resume JSON file.');
          console.error("JSON parsing error:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
     
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCustomization(!showCustomization)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700"
        >
          <Palette size={16} /> Customize Resume
        </button>

        <div className="flex items-center gap-2">
      
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden" 
            accept=".json"
          />
         
          <button onClick={() => handleZoom(25)} className="p-2 text-gray-700 hover:text-black border rounded">
            <ZoomIn size={20} />
          </button>
          <span className="text-sm font-medium">{zoom}%</span>
          <button onClick={() => handleZoom(-25)} className="p-2 text-gray-700 hover:text-black border rounded">
            <ZoomOut size={20} />
          </button>
        </div>
      </div>

      {showCustomization && (
        <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-semibold mb-4">Customize Resume</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {fonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <input
                type="range"
                min="10"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{fontSize}px</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color Presets</label>
              <div className="flex gap-2">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
       
        <div className="w-1/2 bg-white rounded-lg p-6 shadow-sm max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Edit Resume</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <User size={18} style={{ color: selectedColor }} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={resumeData.name}
                onChange={(e) => updateResumeData('name', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Role or Designation"
                value={resumeData.role}
                onChange={(e) => updateResumeData('role', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={resumeData.phone}
                onChange={(e) => updateResumeData('phone', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={resumeData.email}
                onChange={(e) => updateResumeData('email', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={resumeData.linkedin}
                onChange={(e) => updateResumeData('linkedin', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Location (City, State)"
                value={resumeData.location}
                onChange={(e) => updateResumeData('location', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Professional Summary</h3>
            <textarea
              placeholder="Professional summary text here..."
              value={resumeData.summary}
              onChange={(e) => updateResumeData('summary', e.target.value)}
              className="w-full p-2 border rounded-lg h-24 resize-none"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Briefcase size={18} style={{ color: selectedColor }} />
                Work Experience
              </h3>
              <button
                onClick={() => addArrayItem('experience', { title: "", companyName: "", date: "", companyLocation: "", accomplishment: [""] })}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => updateResumeData(`experience.${index}.title`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.companyName}
                      onChange={(e) => updateResumeData(`experience.${index}.companyName`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Start - End Dates"
                      value={exp.date}
                      onChange={(e) => updateResumeData(`experience.${index}.date`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Company Location"
                      value={exp.companyLocation}
                      onChange={(e) => updateResumeData(`experience.${index}.companyLocation`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('experience', index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
                {exp.accomplishment.map((acc, accIndex) => (
                  <div key={accIndex} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      placeholder={`Accomplishment ${accIndex + 1}`}
                      value={acc}
                      onChange={(e) => {
                        const newAccomplishments = [...exp.accomplishment];
                        newAccomplishments[accIndex] = e.target.value;
                        updateResumeData(`experience.${index}.accomplishment`, newAccomplishments);
                      }}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() => {
                        const newAccomplishments = exp.accomplishment.filter((_, i) => i !== accIndex);
                        updateResumeData(`experience.${index}.accomplishment`, newAccomplishments);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newAccomplishments = [...exp.accomplishment, ""];
                    updateResumeData(`experience.${index}.accomplishment`, newAccomplishments);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Accomplishment
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <GraduationCap size={18} style={{ color: selectedColor }} />
                Education
              </h3>
              <button
                onClick={() => addArrayItem('education', { degree: "", institution: "", duration: "", location: "" })}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Degree Name"
                      value={edu.degree}
                      onChange={(e) => updateResumeData(`education.${index}.degree`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => updateResumeData(`education.${index}.institution`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Start - End Dates"
                      value={edu.duration}
                      onChange={(e) => updateResumeData(`education.${index}.duration`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Institution Location"
                      value={edu.location}
                      onChange={(e) => updateResumeData(`education.${index}.location`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('education', index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Brain size={18} style={{ color: selectedColor }} />
                Achievements
              </h3>
              <button
                onClick={() => addArrayItem('achievements', { keyAchievements: "", describe: "" })}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.achievements.map((achievement, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Achievement Title"
                      value={achievement.keyAchievements}
                      onChange={(e) => updateResumeData(`achievements.${index}.keyAchievements`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="Description of the achievement"
                      value={achievement.describe}
                      onChange={(e) => updateResumeData(`achievements.${index}.describe`, e.target.value)}
                      className="w-full p-2 border rounded h-20 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('achievements', index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Brain size={18} style={{ color: selectedColor }} />
                Skills
              </h3>
              <button
                onClick={() => addArrayItem('skills', "")}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Skill ${index + 1}`}
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...resumeData.skills];
                    newSkills[index] = e.target.value;
                    updateResumeData('skills', newSkills);
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => removeArrayItem('skills', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Brain size={18} style={{ color: selectedColor }} />
                Languages
              </h3>
              <button
                onClick={() => addArrayItem('languages', "")}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.languages.map((language, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Language ${index + 1}`}
                  value={language}
                  onChange={(e) => {
                    const newLanguages = [...resumeData.languages];
                    newLanguages[index] = e.target.value;
                    updateResumeData('languages', newLanguages);
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => removeArrayItem('languages', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Brain size={18} style={{ color: selectedColor }} />
                Projects
              </h3>
              <button
                onClick={() => addArrayItem('projects', { title: "", description: "", duration: "" })}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e) => updateResumeData(`projects.${index}.title`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) => updateResumeData(`projects.${index}.description`, e.target.value)}
                      className="w-full p-2 border rounded h-20 resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Project Duration"
                      value={project.duration}
                      onChange={(e) => updateResumeData(`projects.${index}.duration`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('projects', index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Brain size={18} style={{ color: selectedColor }} />
                Courses
              </h3>
              <button
                onClick={() => addArrayItem('courses', { title: "", description: "" })}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {resumeData.courses.map((course, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Course Title"
                      value={course.title}
                      onChange={(e) => updateResumeData(`courses.${index}.title`, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="Course Description"
                      value={course.description}
                      onChange={(e) => updateResumeData(`courses.${index}.description`, e.target.value)}
                      className="w-full p-2 border rounded h-20 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('courses', index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={printRef}
          className="w-1/2 bg-white border rounded-lg p-6 shadow-sm max-h-screen overflow-y-auto"
          style={{
            zoom: `${zoom}%`,
            fontFamily: selectedFont,
            fontSize: `${fontSize}px`
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: selectedColor }}>
              {resumeData.name || "Full Name"}
            </h1>
            <p className="text-lg mb-3" style={{ color: selectedColor }}>
              {resumeData.role || "Role or Designation"}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span>{resumeData.phone || "Phone Number"}</span>
              <span>{resumeData.email || "Email Address"}</span>
              <span>{resumeData.linkedin || "LinkedIn URL"}</span>
            </div>
            <p className="text-sm mt-1">{resumeData.location || "Location"}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Professional Summary
            </h2>
            <p className="text-justify">
              {resumeData.summary || "Professional summary text here."}
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Work Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold">{exp.title || "Job Title"}</h3>
                    <p className="text-sm">{exp.companyName || "Company Name"}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{exp.date || "Start - End Dates"}</p>
                    <p>{exp.companyLocation || "Company Location"}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside text-sm">
                  {exp.accomplishment.map((acc, accIndex) => (
                    acc && <li key={accIndex}>{acc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree || "Degree Name"}</h3>
                    <p className="text-sm">{edu.institution || "Institution Name"}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{edu.duration || "Start - End Dates"}</p>
                    <p>{edu.location || "Institution Location"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Achievements
            </h2>
            {resumeData.achievements.map((achievement, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{achievement.keyAchievements || "Achievement Title"}</h3>
                <p className="text-sm text-justify">{achievement.describe || "Description of the achievement"}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                skill && (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                )
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.languages.map((lang, index) => (
                lang && (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                )
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Projects
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.title || "Project Title"}</h3>
                    <p className="text-sm text-justify">{project.description || "Project Description"}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{project.duration || "Project Duration"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: selectedColor }}>
              Courses
            </h2>
            {resumeData.courses.map((course, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{course.title || "Course Title"}</h3>
                <p className="text-sm text-justify">{course.description || "Course Description"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 text-lg hover:bg-green-700 shadow-lg"
        >
          <Download size={24} /> Download Resume as PDF
        </button>
      </div>
    </div>
  );
};

export default ManualEdit;