import { useState, useRef } from "react";

const SECTION_FIELDS = {
  personal: [
    { key: "name", label: "Full Name", placeholder: "Jane Doe" },
    { key: "title", label: "Job Title", placeholder: "Senior Frontend Engineer" },
    { key: "email", label: "Email", placeholder: "jane@example.com" },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
    { key: "location", label: "Location", placeholder: "San Francisco, CA" },
    { key: "linkedin", label: "LinkedIn / Portfolio", placeholder: "linkedin.com/in/janedoe" },
  ],
};

const defaultResume = {
  personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "" },
  summary: "",
  experience: [{ company: "", role: "", duration: "", bullets: "" }],
  education: [{ institution: "", degree: "", year: "" }],
  skills: "",
};

const TABS = ["Personal", "Summary", "Experience", "Education", "Skills"];

export default function ResumeBuilder() {
  const [resume, setResume] = useState(defaultResume);
  const [activeTab, setActiveTab] = useState(0);
  const [preview, setPreview] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const printRef = useRef();

  const updatePersonal = (key, val) =>
    setResume((r) => ({ ...r, personal: { ...r.personal, [key]: val } }));

  const updateExp = (i, key, val) => {
    const exp = [...resume.experience];
    exp[i] = { ...exp[i], [key]: val };
    setResume((r) => ({ ...r, experience: exp }));
  };

  const updateEdu = (i, key, val) => {
    const edu = [...resume.education];
    edu[i] = { ...edu[i], [key]: val };
    setResume((r) => ({ ...r, education: edu }));
  };

  const addExp = () =>
    setResume((r) => ({ ...r, experience: [...r.experience, { company: "", role: "", duration: "", bullets: "" }] }));

  const addEdu = () =>
    setResume((r) => ({ ...r, education: [...r.education, { institution: "", degree: "", year: "" }] }));

  const removeExp = (i) =>
    setResume((r) => ({ ...r, experience: r.experience.filter((_, idx) => idx !== i) }));

  const removeEdu = (i) =>
    setResume((r) => ({ ...r, education: r.education.filter((_, idx) => idx !== i) }));

  const getAISuggestions = async () => {
    setAiLoading(true);
    setAiError("");
    setAiSuggestions([]);
    setAiOpen(true);
    try {
      const resumeText = `
Name: ${resume.personal.name}
Title: ${resume.personal.title}
Summary: ${resume.summary}
Experience: ${resume.experience.map((e) => `${e.role} at ${e.company} (${e.duration}): ${e.bullets}`).join(" | ")}
Education: ${resume.education.map((e) => `${e.degree} from ${e.institution}`).join(" | ")}
Skills: ${resume.skills}
      `.trim();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a professional resume coach. Review this resume and provide exactly 5 specific, actionable improvement suggestions. Format your response as a JSON array of objects with "section" and "suggestion" keys. Only output the JSON array, nothing else.\n\nResume:\n${resumeText}`,
            },
          ],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiSuggestions(parsed);
    } catch (e) {
      setAiError("Could not fetch AI suggestions. Please try again.");
    }
    setAiLoading(false);
  };

  const handlePrint = () => {
    setPreview(true);
    setTimeout(() => window.print(), 300);
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", background: "#f5f0e8", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0e8; }
        .app { font-family: 'Source Sans 3', sans-serif; }
        .header { background: #1a1a2e; color: #f5f0e8; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #c9a84c; }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 1.8rem; letter-spacing: 1px; }
        .header span { font-size: 0.75rem; color: #c9a84c; letter-spacing: 3px; text-transform: uppercase; display: block; margin-top: 2px; }
        .main { display: grid; grid-template-columns: 340px 1fr; min-height: calc(100vh - 72px); }
        .sidebar { background: #1a1a2e; padding: 0; border-right: 1px solid #2d2d4a; }
        .tab-list { display: flex; flex-direction: column; padding: 24px 0; }
        .tab-btn { background: none; border: none; color: #9999bb; padding: 14px 32px; text-align: left; font-family: 'Source Sans 3', sans-serif; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; }
        .tab-btn:hover { color: #f5f0e8; background: rgba(201,168,76,0.05); }
        .tab-btn.active { color: #c9a84c; border-left-color: #c9a84c; background: rgba(201,168,76,0.08); }
        .ai-btn { margin: 16px 24px; padding: 12px 20px; background: linear-gradient(135deg, #c9a84c, #a07830); color: #1a1a2e; border: none; border-radius: 6px; font-family: 'Source Sans 3', sans-serif; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .ai-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,168,76,0.4); }
        .preview-btn { margin: 8px 24px; padding: 12px 20px; background: transparent; color: #c9a84c; border: 1px solid #c9a84c; border-radius: 6px; font-family: 'Source Sans 3', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .preview-btn:hover { background: rgba(201,168,76,0.1); }
        .print-btn { margin: 8px 24px; padding: 12px 20px; background: transparent; color: #9999bb; border: 1px solid #2d2d4a; border-radius: 6px; font-family: 'Source Sans 3', sans-serif; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .print-btn:hover { color: #f5f0e8; border-color: #4d4d6a; }
        .content { padding: 40px; overflow-y: auto; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #1a1a2e; margin-bottom: 8px; }
        .section-subtitle { font-size: 0.85rem; color: #666; letter-spacing: 1px; margin-bottom: 28px; text-transform: uppercase; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 8px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: #666; font-weight: 600; }
        .field input, .field textarea { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 10px 14px; font-family: 'Source Sans 3', sans-serif; font-size: 0.95rem; color: #1a1a2e; outline: none; transition: border-color 0.2s; resize: vertical; }
        .field input:focus, .field textarea:focus { border-color: #c9a84c; }
        .field textarea { min-height: 100px; }
        .exp-card { background: white; border: 1px solid #e8e0d0; border-radius: 8px; padding: 24px; margin-bottom: 16px; position: relative; }
        .exp-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .exp-label { font-family: 'Playfair Display', serif; font-size: 1rem; color: #1a1a2e; }
        .remove-btn { background: none; border: 1px solid #ddd; color: #999; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
        .remove-btn:hover { color: #c04; border-color: #c04; }
        .add-btn { background: none; border: 1px dashed #c9a84c; color: #c9a84c; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s; margin-top: 8px; }
        .add-btn:hover { background: rgba(201,168,76,0.08); }
        
        /* AI Panel */
        .ai-panel { position: fixed; right: 0; top: 0; width: 380px; height: 100vh; background: #1a1a2e; border-left: 2px solid #c9a84c; z-index: 100; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s ease; }
        .ai-panel.open { transform: translateX(0); }
        .ai-panel-header { padding: 24px; border-bottom: 1px solid #2d2d4a; display: flex; justify-content: space-between; align-items: center; }
        .ai-panel-title { font-family: 'Playfair Display', serif; color: #c9a84c; font-size: 1.2rem; }
        .close-btn { background: none; border: none; color: #9999bb; font-size: 1.4rem; cursor: pointer; }
        .close-btn:hover { color: #f5f0e8; }
        .ai-suggestions { padding: 24px; overflow-y: auto; flex: 1; }
        .suggestion-card { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .suggestion-section { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #c9a84c; margin-bottom: 6px; font-weight: 700; }
        .suggestion-text { font-size: 0.9rem; color: #ccc; line-height: 1.6; }
        .ai-loading { color: #c9a84c; text-align: center; padding: 40px; font-family: 'Playfair Display', serif; font-size: 1rem; }
        .ai-error { color: #ff6b6b; padding: 20px; font-size: 0.9rem; }

        /* Resume Preview */
        .resume-preview { background: white; max-width: 800px; margin: 0 auto; box-shadow: 0 8px 40px rgba(0,0,0,0.15); }
        .resume-header-sec { background: #1a1a2e; color: white; padding: 40px 48px 36px; }
        .resume-name { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 900; letter-spacing: 1px; margin-bottom: 4px; }
        .resume-title { color: #c9a84c; font-size: 1rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; }
        .resume-contact { display: flex; gap: 24px; flex-wrap: wrap; font-size: 0.85rem; color: #aaa; }
        .resume-body { display: grid; grid-template-columns: 1fr 280px; }
        .resume-main { padding: 36px 40px; border-right: 1px solid #f0ece4; }
        .resume-side { padding: 36px 32px; background: #faf8f4; }
        .res-section { margin-bottom: 32px; }
        .res-section-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #1a1a2e; border-bottom: 2px solid #c9a84c; padding-bottom: 6px; margin-bottom: 16px; letter-spacing: 1px; }
        .res-exp-item { margin-bottom: 20px; }
        .res-exp-header { display: flex; justify-content: space-between; align-items: baseline; }
        .res-role { font-weight: 700; font-size: 1rem; }
        .res-company { color: #c9a84c; font-size: 0.9rem; }
        .res-duration { font-size: 0.8rem; color: #888; letter-spacing: 1px; }
        .res-bullets { margin-top: 8px; }
        .res-bullets li { font-size: 0.88rem; color: #444; line-height: 1.7; margin-left: 16px; }
        .res-summary { font-size: 0.92rem; color: #444; line-height: 1.8; }
        .res-skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .res-skill { background: #1a1a2e; color: #c9a84c; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; letter-spacing: 1px; }
        .res-edu-item { margin-bottom: 14px; }
        .res-degree { font-weight: 600; font-size: 0.9rem; }
        .res-institution { color: #666; font-size: 0.85rem; }
        .res-year { font-size: 0.8rem; color: #c9a84c; margin-top: 2px; }

        @media print {
          .sidebar, .header, .ai-panel, .no-print { display: none !important; }
          .main { grid-template-columns: 1fr; }
          .content { padding: 0; }
          .resume-preview { box-shadow: none; }
        }
      `}</style>

      <div className="app">
        {/* Header */}
        <div className="header no-print">
          <div>
            <h1>ResuméCraft</h1>
            <span>AI-Powered Resume Builder</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#c9a84c", letterSpacing: "1px" }}>
            {preview ? "📄 Preview Mode" : "✏️ Edit Mode"}
          </div>
        </div>

        <div className="main">
          {/* Sidebar */}
          {!preview && (
            <div className="sidebar no-print">
              <div className="tab-list">
                {TABS.map((t, i) => (
                  <button key={t} className={`tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
                    {t}
                  </button>
                ))}
              </div>
              <button className="ai-btn" onClick={getAISuggestions}>✦ Get AI Suggestions</button>
              <button className="preview-btn" onClick={() => setPreview(true)}>Preview Resume</button>
              <button className="print-btn" onClick={handlePrint}>⬇ Export / Print</button>
            </div>
          )}

          {/* Main content */}
          <div className="content">
            {!preview ? (
              <>
                {/* Personal */}
                {activeTab === 0 && (
                  <div>
                    <div className="section-title">Personal Information</div>
                    <div className="section-subtitle">Your contact details</div>
                    <div className="field-grid">
                      {SECTION_FIELDS.personal.map((f) => (
                        <div className="field" key={f.key}>
                          <label>{f.label}</label>
                          <input
                            type="text"
                            placeholder={f.placeholder}
                            value={resume.personal[f.key]}
                            onChange={(e) => updatePersonal(f.key, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {activeTab === 1 && (
                  <div>
                    <div className="section-title">Professional Summary</div>
                    <div className="section-subtitle">2–4 sentences about your expertise</div>
                    <div className="field">
                      <label>Summary</label>
                      <textarea
                        style={{ minHeight: 160 }}
                        placeholder="Results-driven engineer with 5+ years of experience building scalable web applications..."
                        value={resume.summary}
                        onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {/* Experience */}
                {activeTab === 2 && (
                  <div>
                    <div className="section-title">Work Experience</div>
                    <div className="section-subtitle">Most recent first</div>
                    {resume.experience.map((exp, i) => (
                      <div className="exp-card" key={i}>
                        <div className="exp-card-header">
                          <span className="exp-label">Experience {i + 1}</span>
                          {resume.experience.length > 1 && (
                            <button className="remove-btn" onClick={() => removeExp(i)}>Remove</button>
                          )}
                        </div>
                        <div className="field-grid">
                          <div className="field">
                            <label>Company</label>
                            <input placeholder="Acme Corp" value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Role / Title</label>
                            <input placeholder="Software Engineer" value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Duration</label>
                            <input placeholder="Jan 2022 – Present" value={exp.duration} onChange={(e) => updateExp(i, "duration", e.target.value)} />
                          </div>
                        </div>
                        <div className="field" style={{ marginTop: 12 }}>
                          <label>Key Achievements (one per line)</label>
                          <textarea
                            placeholder={"Increased performance by 40% by optimizing database queries\nLed a team of 4 engineers to deliver project ahead of schedule"}
                            value={exp.bullets}
                            onChange={(e) => updateExp(i, "bullets", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <button className="add-btn" onClick={addExp}>+ Add Experience</button>
                  </div>
                )}

                {/* Education */}
                {activeTab === 3 && (
                  <div>
                    <div className="section-title">Education</div>
                    <div className="section-subtitle">Degrees and certifications</div>
                    {resume.education.map((edu, i) => (
                      <div className="exp-card" key={i}>
                        <div className="exp-card-header">
                          <span className="exp-label">Education {i + 1}</span>
                          {resume.education.length > 1 && (
                            <button className="remove-btn" onClick={() => removeEdu(i)}>Remove</button>
                          )}
                        </div>
                        <div className="field-grid">
                          <div className="field">
                            <label>Institution</label>
                            <input placeholder="MIT" value={edu.institution} onChange={(e) => updateEdu(i, "institution", e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Degree</label>
                            <input placeholder="B.S. Computer Science" value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Year</label>
                            <input placeholder="2020" value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="add-btn" onClick={addEdu}>+ Add Education</button>
                  </div>
                )}

                {/* Skills */}
                {activeTab === 4 && (
                  <div>
                    <div className="section-title">Skills</div>
                    <div className="section-subtitle">Comma-separated list</div>
                    <div className="field">
                      <label>Technical & Soft Skills</label>
                      <textarea
                        style={{ minHeight: 120 }}
                        placeholder="React, Node.js, TypeScript, MongoDB, REST APIs, Agile, Leadership"
                        value={resume.skills}
                        onChange={(e) => setResume((r) => ({ ...r, skills: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Preview
              <div>
                <div className="no-print" style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                  <button className="preview-btn" style={{ margin: 0 }} onClick={() => setPreview(false)}>← Back to Edit</button>
                  <button className="ai-btn" style={{ margin: 0 }} onClick={handlePrint}>⬇ Print / Export PDF</button>
                </div>
                <div className="resume-preview" ref={printRef}>
                  <div className="resume-header-sec">
                    <div className="resume-name">{resume.personal.name || "Your Name"}</div>
                    <div className="resume-title">{resume.personal.title || "Professional Title"}</div>
                    <div className="resume-contact">
                      {resume.personal.email && <span>✉ {resume.personal.email}</span>}
                      {resume.personal.phone && <span>☎ {resume.personal.phone}</span>}
                      {resume.personal.location && <span>⌖ {resume.personal.location}</span>}
                      {resume.personal.linkedin && <span>⟐ {resume.personal.linkedin}</span>}
                    </div>
                  </div>
                  <div className="resume-body">
                    <div className="resume-main">
                      {resume.summary && (
                        <div className="res-section">
                          <div className="res-section-title">Profile</div>
                          <p className="res-summary">{resume.summary}</p>
                        </div>
                      )}
                      {resume.experience.some((e) => e.company || e.role) && (
                        <div className="res-section">
                          <div className="res-section-title">Experience</div>
                          {resume.experience.map((exp, i) =>
                            exp.company || exp.role ? (
                              <div className="res-exp-item" key={i}>
                                <div className="res-exp-header">
                                  <div>
                                    <div className="res-role">{exp.role}</div>
                                    <div className="res-company">{exp.company}</div>
                                  </div>
                                  <div className="res-duration">{exp.duration}</div>
                                </div>
                                {exp.bullets && (
                                  <ul className="res-bullets">
                                    {exp.bullets.split("\n").filter(Boolean).map((b, j) => (
                                      <li key={j}>{b}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                    <div className="resume-side">
                      {resume.skills && (
                        <div className="res-section">
                          <div className="res-section-title">Skills</div>
                          <div className="res-skills">
                            {resume.skills.split(",").filter(Boolean).map((s, i) => (
                              <span className="res-skill" key={i}>{s.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {resume.education.some((e) => e.institution || e.degree) && (
                        <div className="res-section">
                          <div className="res-section-title">Education</div>
                          {resume.education.map((edu, i) =>
                            edu.institution || edu.degree ? (
                              <div className="res-edu-item" key={i}>
                                <div className="res-degree">{edu.degree}</div>
                                <div className="res-institution">{edu.institution}</div>
                                <div className="res-year">{edu.year}</div>
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Panel */}
        <div className={`ai-panel ${aiOpen ? "open" : ""}`}>
          <div className="ai-panel-header">
            <div className="ai-panel-title">✦ AI Suggestions</div>
            <button className="close-btn" onClick={() => setAiOpen(false)}>✕</button>
          </div>
          <div className="ai-suggestions">
            {aiLoading && (
              <div className="ai-loading">
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>✦</div>
                Analyzing your resume...
              </div>
            )}
            {aiError && <div className="ai-error">{aiError}</div>}
            {!aiLoading && aiSuggestions.map((s, i) => (
              <div className="suggestion-card" key={i}>
                <div className="suggestion-section">{s.section}</div>
                <div className="suggestion-text">{s.suggestion}</div>
              </div>
            ))}
            {!aiLoading && aiSuggestions.length === 0 && !aiError && (
              <div style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.7 }}>
                Fill in your resume details and click <strong style={{ color: "#c9a84c" }}>Get AI Suggestions</strong> to receive personalized improvements from Claude AI.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
