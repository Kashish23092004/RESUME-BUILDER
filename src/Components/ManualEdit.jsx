import React, { useRef, useState } from "react";
import { ZoomIn, ZoomOut, Upload } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const ManualEdit = () => {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("text-base");
  const [theme, setTheme] = useState("light");
  const [fontFamily, setFontFamily] = useState("font-sans");
  const printRef = useRef();

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const resumeData = {
    personalInfo: {
      firstName: "Kashish",
      lastName: "Singh",
      email: "kashish2392004@gmail.com",
      phone: "+91 8802273406",
      address: "Jaitpur, Badarpur, South Delhi-110044",
      jobTitle: "Full-Stack Web Developer"
    },
    education: [{
      institution: "GURU GOBIND SINGH INDRAPRASTHA UNIVERSITY",
      degree: "B.Tech",
      location: "New Delhi, India",
      startDate: "2022-01-01",
      endDate: "2026-01-01",
      gpa: "8.3"
    }],
    experience: [{
      company: "CANTILEVER",
      position: "Web Developer Intern",
      location: "New Delhi, India",
      startDate: "2024-06-01",
      endDate: "2024-07-01",
      description: "Learned full-stack web development and worked on real-world projects."
    }],
    skills: {
      programmingLanguages: ["HTML", "CSS", "JavaScript", "C++", "Python"],
      frameworks: ["React", "Node.js", "Tailwind", "Bootstrap"],
      tools: ["VS Code", "GitHub"],
      databases: ["MongoDB"]
    },
    projects: [{
      name: "Online Code Editor",
      technologies: "JavaScript, HTML",
      description: "Built an online code editor using JS and HTML.",
      link: "#"
    }],
    certifications: [{
      name: "INTERNSHIP CERTIFICATE",
      issuer: "Cantilever",
      description: "Certified successfully."
    }, {
      name: "IDEATHON PARTICIPATION",
      issuer: "GGSIPU",
      description: "Participated in Ideathon event by GGSIPU."
    }]
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">🎯 AI Resume Auto-Fill</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={() => setZoom(z => Math.min(200, z + 25))}><ZoomIn /></button>
          <button onClick={() => setZoom(z => Math.max(50, z - 25))}><ZoomOut /></button>

          <select onChange={(e) => setFontSize(e.target.value)} className="border px-2 py-1 rounded">
            <option value="text-sm">Small</option>
            <option value="text-base" selected>Medium</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">X-Large</option>
          </select>

          <select onChange={(e) => setTheme(e.target.value)} className="border px-2 py-1 rounded">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <select onChange={(e) => setFontFamily(e.target.value)} className="border px-2 py-1 rounded">
            <option value="font-sans">Sans-serif</option>
            <option value="font-serif">Serif</option>
            <option value="font-mono">Monospace</option>
          </select>

          <button onClick={handlePrint} className="bg-green-600 text-white px-3 py-1 rounded">Download PDF</button>
        </div>
      </div>

      <div
        ref={printRef}
        className={`max-w-4xl mx-auto rounded shadow-md transition-all duration-300 p-6 ${fontSize} ${fontFamily} ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
        style={{ zoom: `${zoom}%` }}
      >
        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">👤 Personal Info</h3>
          <p><b>Name:</b> {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</p>
          <p><b>Email:</b> {resumeData.personalInfo.email}</p>
          <p><b>Phone:</b> {resumeData.personalInfo.phone}</p>
          <p><b>Job Title:</b> {resumeData.personalInfo.jobTitle}</p>
          <p><b>Address:</b> {resumeData.personalInfo.address}</p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">🎓 Education</h3>
          {resumeData.education.map((edu, i) => (
            <div key={i}>
              <p><b>{edu.degree}</b> - {edu.institution} ({edu.location})</p>
              <p>{edu.startDate} to {edu.endDate}</p>
              <p>GPA: {edu.gpa}</p>
            </div>
          ))}
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">💼 Experience</h3>
          {resumeData.experience.map((exp, i) => (
            <div key={i}>
              <p><b>{exp.position}</b> at {exp.company}</p>
              <p>{exp.startDate} to {exp.endDate} | {exp.location}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">🧠 Skills</h3>
          <p><b>Languages:</b> {resumeData.skills.programmingLanguages.join(', ')}</p>
          <p><b>Frameworks:</b> {resumeData.skills.frameworks.join(', ')}</p>
          <p><b>Tools:</b> {resumeData.skills.tools.join(', ')}</p>
          <p><b>Databases:</b> {resumeData.skills.databases.join(', ')}</p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">🚀 Projects</h3>
          {resumeData.projects.map((p, i) => (
            <div key={i}>
              <p><b>{p.name}</b> - {p.technologies}</p>
              <p>{p.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-blue-600">🎓 Certifications</h3>
          {resumeData.certifications.map((c, i) => (
            <div key={i}>
              <p><b>{c.name}</b> - {c.issuer}</p>
              <p>{c.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ManualEdit;