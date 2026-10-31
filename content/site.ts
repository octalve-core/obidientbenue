export const site = {
  name: 'Obidient Benue',
  domain: 'obidientbenue.com',
  tagline: 'Civic participation. Public information. Accountable leadership.',
  note: 'This community website is not operated by INEC and does not register anyone to vote.',
  contactEmail: '', // Publish only after an approved campaign contact is provided.
} as const;

// Only public, maintained routes appear in primary navigation.
export const navigation = [
  {href:'/',label:'Home'},
  {href:'/about',label:'About'},
  {href:'/leadership',label:'The Candidates'},
  {href:'/policy-priorities',label:'Policy Priorities'},
  {href:'/register',label:'Register'},
] as const;
export const priorities = [
  {number:'01',title:'Safety & Stability',detail:'Public discussion of community security, peaceful coexistence, recovery and lawful protection of communities.'},
  {number:'02',title:'Farming & Enterprise',detail:'Agricultural productivity, market access, rural infrastructure, small businesses and local value creation.'},
  {number:'03',title:'Education & Skills',detail:'Accessible learning, employable skills, responsible innovation and opportunities for young people.'},
  {number:'04',title:'Health & Community Wellbeing',detail:'Primary care, maternal health, clean water and support for communities affected by displacement.'},
  {number:'05',title:'Transparent Public Service',detail:'Budget clarity, public procurement oversight, responsive institutions and measurable outcomes.'},
  {number:'06',title:'Infrastructure & Inclusion',detail:'Roads, rural connectivity, disability inclusion and services across all local government areas.'},
] as const;
export const sources = [
 {label:'INEC — recognised political parties',href:'https://www.inecnigeria.org/parties/nigeria-democratic-congress'},
 {label:'Nigeria Democratic Congress — policy information',href:'https://ndcnigeria.com/'},
 {label:'INEC polling unit locator',href:'https://cvr.inecnigeria.org/pu'},
 {label:'Save the Children — Benue needs assessment',href:'https://resourcecentre.savethechildren.net/document/multi-sectoral-needs-assessment-benue-state-nigeria-april-2024'},
] as const;
