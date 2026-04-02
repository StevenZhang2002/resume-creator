import type { ResumeData } from '../types/resume';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const updateConfig = (field: keyof typeof data.config, value: any) => {
    onChange({
      ...data,
      config: { ...data.config, [field]: value },
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#374151',
    color: '#fff',
    border: '1px solid #4b5563',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    boxSizing: 'border-box',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '60px',
    resize: 'vertical' as const,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '12px',
    color: '#9ca3af',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontWeight: 500,
  };

  const sectionStyle = {
    marginBottom: '32px',
    padding: '16px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #4b5563',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  };

  const itemCardStyle = {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#252526',
    borderRadius: '6px',
    border: '1px solid #374151',
  };

  const removeButtonStyle = {
    padding: '4px 8px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  };

  const addButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    marginTop: '8px',
  };

  // 渲染数组输入框
  const renderArrayInput = (
    items: string[],
    onChange: (items: string[]) => void,
    placeholder: string = 'comma separated...'
  ) => (
    <input
      style={inputStyle}
      value={items.join(', ')}
      onChange={(e) => onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
      placeholder={placeholder}
    />
  );

  return (
    <div style={{ padding: '20px', color: '#fff', overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>

      {/* 个人信息 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Personal Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={data.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input style={inputStyle} value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} value={data.personalInfo.address || ''} onChange={(e) => updatePersonalInfo('address', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Website</label>
            <input style={inputStyle} value={data.personalInfo.website || ''} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>GitHub</label>
            <input style={inputStyle} value={data.personalInfo.github || ''} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Google Scholar</label>
            <input style={inputStyle} value={data.personalInfo.googleScholar || ''} onChange={(e) => updatePersonalInfo('googleScholar', e.target.value)} />
          </div>
        </div>
      </section>

      {/* 教育背景 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Education
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            education: [...data.education, { institution: '', degree: '', major: '', location: '', startDate: '', endDate: '', gpa: '', ranking: '', honors: [] }]
          })}>+ Add</button>
        </h3>
        {data.education.map((edu, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {edu.institution || 'New Education'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, education: data.education.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Institution</label>
                <input style={inputStyle} value={edu.institution} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, institution: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Degree</label>
                <input style={inputStyle} value={edu.degree} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, degree: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Major</label>
                <input style={inputStyle} value={edu.major} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, major: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} value={edu.location} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, location: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input style={inputStyle} value={edu.startDate} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, startDate: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input style={inputStyle} value={edu.endDate || ''} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, endDate: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>GPA</label>
                <input style={inputStyle} value={edu.gpa || ''} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, gpa: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Ranking</label>
                <input style={inputStyle} value={edu.ranking || ''} onChange={(e) => {
                  const items = [...data.education];
                  items[idx] = { ...edu, ranking: e.target.value };
                  onChange({ ...data, education: items });
                }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Honors (comma separated)</label>
              {renderArrayInput(edu.honors || [], (items) => {
                const eduItems = [...data.education];
                eduItems[idx] = { ...edu, honors: items };
                onChange({ ...data, education: eduItems });
              })}
            </div>
          </div>
        ))}
      </section>

      {/* 科研经历 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Research Experience
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            researchExperience: [...data.researchExperience, { title: '', role: '', institution: '', location: '', startDate: '', endDate: '', advisor: '', description: [] }]
          })}>+ Add</button>
        </h3>
        {data.researchExperience.map((research, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {research.title || 'New Research'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, researchExperience: data.researchExperience.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={research.title} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, title: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <input style={inputStyle} value={research.role} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, role: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Institution</label>
                <input style={inputStyle} value={research.institution} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, institution: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} value={research.location} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, location: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input style={inputStyle} value={research.startDate} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, startDate: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input style={inputStyle} value={research.endDate || ''} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, endDate: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Advisor</label>
                <input style={inputStyle} value={research.advisor || ''} onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, advisor: e.target.value };
                  onChange({ ...data, researchExperience: items });
                }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Description (one per line)</label>
              <textarea
                style={textareaStyle}
                value={research.description.join('\n')}
                onChange={(e) => {
                  const items = [...data.researchExperience];
                  items[idx] = { ...research, description: e.target.value.split('\n').filter(Boolean) };
                  onChange({ ...data, researchExperience: items });
                }}
                rows={3}
              />
            </div>
          </div>
        ))}
      </section>

      {/* 论文发表 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Publications
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            publications: [...data.publications, { title: '', authors: [], venue: '', year: new Date().getFullYear(), status: 'published', doi: '', url: '', arxiv: '' }]
          })}>+ Add</button>
        </h3>
        {data.publications.map((pub, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {pub.title || 'New Publication'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, publications: data.publications.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={pub.title} onChange={(e) => {
                  const items = [...data.publications];
                  items[idx] = { ...pub, title: e.target.value };
                  onChange({ ...data, publications: items });
                }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Authors (comma separated, use * for yourself)</label>
                {renderArrayInput(pub.authors, (items) => {
                  const pubItems = [...data.publications];
                  pubItems[idx] = { ...pub, authors: items };
                  onChange({ ...data, publications: pubItems });
                })}
              </div>
              <div>
                <label style={labelStyle}>Venue</label>
                <input style={inputStyle} value={pub.venue} onChange={(e) => {
                  const items = [...data.publications];
                  items[idx] = { ...pub, venue: e.target.value };
                  onChange({ ...data, publications: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <input style={inputStyle} type="number" value={pub.year} onChange={(e) => {
                  const items = [...data.publications];
                  items[idx] = { ...pub, year: parseInt(e.target.value) };
                  onChange({ ...data, publications: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={pub.status} onChange={(e) => {
                  const items = [...data.publications];
                  items[idx] = { ...pub, status: e.target.value };
                  onChange({ ...data, publications: items });
                }}>
                  <option value="published">Published</option>
                  <option value="accepted">Accepted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_preparation">In Preparation</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>DOI</label>
                <input style={inputStyle} value={pub.doi || ''} onChange={(e) => {
                  const items = [...data.publications];
                  items[idx] = { ...pub, doi: e.target.value };
                  onChange({ ...data, publications: items });
                }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 实习经历 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Professional Experience
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            internshipExperience: [...data.internshipExperience, { company: '', position: '', location: '', startDate: '', endDate: '', description: [] }]
          })}>+ Add</button>
        </h3>
        {data.internshipExperience.map((internship, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {internship.company || 'New Experience'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, internshipExperience: data.internshipExperience.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} value={internship.company} onChange={(e) => {
                  const items = [...data.internshipExperience];
                  items[idx] = { ...internship, company: e.target.value };
                  onChange({ ...data, internshipExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Position</label>
                <input style={inputStyle} value={internship.position} onChange={(e) => {
                  const items = [...data.internshipExperience];
                  items[idx] = { ...internship, position: e.target.value };
                  onChange({ ...data, internshipExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} value={internship.location} onChange={(e) => {
                  const items = [...data.internshipExperience];
                  items[idx] = { ...internship, location: e.target.value };
                  onChange({ ...data, internshipExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input style={inputStyle} value={internship.startDate} onChange={(e) => {
                  const items = [...data.internshipExperience];
                  items[idx] = { ...internship, startDate: e.target.value };
                  onChange({ ...data, internshipExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input style={inputStyle} value={internship.endDate || ''} onChange={(e) => {
                  const items = [...data.internshipExperience];
                  items[idx] = { ...internship, endDate: e.target.value };
                  onChange({ ...data, internshipExperience: items });
                }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Description (one per line)</label>
              <textarea
                style={textareaStyle}
                value={internship.description.join('\n')}
                onChange={(e) => {
                  const items = [...data.internshipExperience];
                  items[idx] = { ...internship, description: e.target.value.split('\n').filter(Boolean) };
                  onChange({ ...data, internshipExperience: items });
                }}
                rows={3}
              />
            </div>
          </div>
        ))}
      </section>

      {/* 项目经历 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Projects
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            projectExperience: [...data.projectExperience, { name: '', role: '', startDate: '', endDate: '', url: '', description: [], technologies: [] }]
          })}>+ Add</button>
        </h3>
        {data.projectExperience.map((project, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {project.name || 'New Project'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, projectExperience: data.projectExperience.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Name</label>
                <input style={inputStyle} value={project.name} onChange={(e) => {
                  const items = [...data.projectExperience];
                  items[idx] = { ...project, name: e.target.value };
                  onChange({ ...data, projectExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <input style={inputStyle} value={project.role} onChange={(e) => {
                  const items = [...data.projectExperience];
                  items[idx] = { ...project, role: e.target.value };
                  onChange({ ...data, projectExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input style={inputStyle} value={project.startDate} onChange={(e) => {
                  const items = [...data.projectExperience];
                  items[idx] = { ...project, startDate: e.target.value };
                  onChange({ ...data, projectExperience: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input style={inputStyle} value={project.endDate || ''} onChange={(e) => {
                  const items = [...data.projectExperience];
                  items[idx] = { ...project, endDate: e.target.value };
                  onChange({ ...data, projectExperience: items });
                }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>URL</label>
                <input style={inputStyle} value={project.url || ''} onChange={(e) => {
                  const items = [...data.projectExperience];
                  items[idx] = { ...project, url: e.target.value };
                  onChange({ ...data, projectExperience: items });
                }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Description (one per line)</label>
              <textarea
                style={textareaStyle}
                value={project.description.join('\n')}
                onChange={(e) => {
                  const items = [...data.projectExperience];
                  items[idx] = { ...project, description: e.target.value.split('\n').filter(Boolean) };
                  onChange({ ...data, projectExperience: items });
                }}
                rows={3}
              />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Technologies (comma separated)</label>
              {renderArrayInput(project.technologies || [], (items) => {
                const projItems = [...data.projectExperience];
                projItems[idx] = { ...project, technologies: items };
                onChange({ ...data, projectExperience: projItems });
              })}
            </div>
          </div>
        ))}
      </section>

      {/* 奖项荣誉 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Honors & Awards
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            awards: [...data.awards, { title: '', issuer: '', date: '', description: '' }]
          })}>+ Add</button>
        </h3>
        {data.awards.map((award, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {award.title || 'New Award'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, awards: data.awards.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={award.title} onChange={(e) => {
                  const items = [...data.awards];
                  items[idx] = { ...award, title: e.target.value };
                  onChange({ ...data, awards: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Issuer</label>
                <input style={inputStyle} value={award.issuer} onChange={(e) => {
                  const items = [...data.awards];
                  items[idx] = { ...award, issuer: e.target.value };
                  onChange({ ...data, awards: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input style={inputStyle} value={award.date} onChange={(e) => {
                  const items = [...data.awards];
                  items[idx] = { ...award, date: e.target.value };
                  onChange({ ...data, awards: items });
                }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={textareaStyle}
                  value={award.description || ''}
                  onChange={(e) => {
                    const items = [...data.awards];
                    items[idx] = { ...award, description: e.target.value };
                    onChange({ ...data, awards: items });
                  }}
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 技能 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Skills
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            skills: [...data.skills, { category: '', items: [] }]
          })}>+ Add</button>
        </h3>
        {data.skills.map((skill, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {skill.category || 'New Skill'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, skills: data.skills.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Category</label>
                <input style={inputStyle} value={skill.category} onChange={(e) => {
                  const items = [...data.skills];
                  items[idx] = { ...skill, category: e.target.value };
                  onChange({ ...data, skills: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Items (comma separated)</label>
                {renderArrayInput(skill.items, (items) => {
                  const skillItems = [...data.skills];
                  skillItems[idx] = { ...skill, items: items };
                  onChange({ ...data, skills: skillItems });
                })}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 学术服务 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Academic Service
          <button style={addButtonStyle} onClick={() => onChange({
            ...data,
            academicService: [...data.academicService, { role: '', organization: '', startDate: '', endDate: '', description: '' }]
          })}>+ Add</button>
        </h3>
        {data.academicService.map((service, idx) => (
          <div key={idx} style={itemCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>#{idx + 1} {service.role || 'New Service'}</span>
              <button style={removeButtonStyle} onClick={() => onChange({ ...data, academicService: data.academicService.filter((_, i) => i !== idx) })}>Remove</button>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Role</label>
                <input style={inputStyle} value={service.role} onChange={(e) => {
                  const items = [...data.academicService];
                  items[idx] = { ...service, role: e.target.value };
                  onChange({ ...data, academicService: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Organization</label>
                <input style={inputStyle} value={service.organization} onChange={(e) => {
                  const items = [...data.academicService];
                  items[idx] = { ...service, organization: e.target.value };
                  onChange({ ...data, academicService: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input style={inputStyle} value={service.startDate} onChange={(e) => {
                  const items = [...data.academicService];
                  items[idx] = { ...service, startDate: e.target.value };
                  onChange({ ...data, academicService: items });
                }} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input style={inputStyle} value={service.endDate || ''} onChange={(e) => {
                  const items = [...data.academicService];
                  items[idx] = { ...service, endDate: e.target.value };
                  onChange({ ...data, academicService: items });
                }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={textareaStyle}
                  value={service.description || ''}
                  onChange={(e) => {
                    const items = [...data.academicService];
                    items[idx] = { ...service, description: e.target.value };
                    onChange({ ...data, academicService: items });
                  }}
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 设置 */}
      <section style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Settings</h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Font Size</label>
            <select style={inputStyle} value={data.config.fontSize} onChange={(e) => updateConfig('fontSize', e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Page Margin</label>
            <select style={inputStyle} value={data.config.pageMargin} onChange={(e) => updateConfig('pageMargin', Number(e.target.value))}>
              <option value="15">Narrow (15mm)</option>
              <option value="20">Medium (20mm)</option>
              <option value="25">Wide (25mm)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={data.config.showSectionBorders}
              onChange={(e) => updateConfig('showSectionBorders', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>Show Section Borders</label>
          </div>
        </div>
      </section>
    </div>
  );
}
