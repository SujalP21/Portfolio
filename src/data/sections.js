/** Single source of truth for section order, numbering and nav labels. */
export const sections = [
  { id: 'summary', index: '01', label: 'Summary', nav: 'Summary' },
  { id: 'experience', index: '02', label: 'Experience', nav: 'Experience' },
  { id: 'work', index: '03', label: 'Selected Work', nav: 'Work' },
  { id: 'recognition', index: '04', label: 'Recognition', nav: 'Recognition' },
  { id: 'certifications', index: '05', label: 'Certifications', nav: 'Certs' },
  { id: 'programming', index: '06', label: 'Competitive Programming', nav: 'Practice' },
  { id: 'contact', index: '07', label: 'Contact', nav: 'Contact' },
]

export const sectionIds = sections.map((s) => s.id)
