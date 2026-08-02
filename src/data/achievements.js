/**
 * Proof assets live under /public/proof/ with URL-safe kebab-case names.
 * Intrinsic width/height are recorded so every image can reserve its box and
 * contribute zero cumulative layout shift.
 */

const A = '/proof/achievements'
const T = '/proof/thumbs'

export const achievements = [
  {
    id: 'big-code-challenge',
    title: 'The Big Code Challenge 2026',
    organisation: 'Google',
    date: 'April 2026',
    result: 'Top 1,500',
    detail:
      'Placed in the Top 1,500 out of 70,000+ candidates nationwide in this national coding competition.',
    // No plate for this one — the proof is a document, not a photograph.
    gallery: [],
    document: {
      href: '/proof/certs/big-code-challenge.pdf',
      label: 'View Google confirmation',
    },
  },
  {
    id: 'code-for-good',
    title: 'Code For Good',
    organisation: 'JPMorgan Chase & Co.',
    date: 'June 2025',
    result: 'Runner-up',
    detail:
      'Selected from over 15,000 applicants to join this hackathon; led engineering for the team, which finished runner-up among 20+ competing teams.',
    gallery: [
      {
        src: `${A}/code-for-good.jpg`,
        thumb: `${A}/code-for-good-thumb.jpg`,
        width: 1600,
        height: 1200,
        caption: 'Code for <good> 2025 — the team at the JPMorgan Chase campus.',
      },
    ],
  },
  {
    id: 'ossome-hacks',
    title: 'Ossome Hacks 2.0',
    organisation: 'GitHub Community SRM',
    date: 'March 2025',
    result: '1st place',
    detail:
      'Shipped an AI-powered Ed-Tech application during a 36-hour hackathon and won 1st place among all competing teams.',
    gallery: [
      {
        src: `${A}/ossome-hacks-stage.jpg`,
        thumb: `${A}/ossome-hacks-stage-thumb.jpg`,
        width: 1200,
        height: 1600,
        caption: 'Prize ceremony — Ossome Hacks 2.0, GitHub Community SRM.',
      },
      {
        src: `${A}/ossome-hacks-cert-edtech.jpg`,
        thumb: `${A}/ossome-hacks-cert-edtech-thumb.jpg`,
        width: 1080,
        height: 756,
        caption: 'Certificate — Best Team of the EdTech Track, team Tech Wizards.',
      },
      {
        src: `${A}/ossome-hacks-cert-product.jpg`,
        thumb: `${A}/ossome-hacks-cert-product-thumb.jpg`,
        width: 1080,
        height: 900,
        caption: 'Certificate — Best Product Idea, team Tech Wizards.',
      },
    ],
  },
  {
    id: 'techknow',
    title: 'TechKnow 2023–2024',
    organisation: 'SRM Institute of Science & Technology',
    date: 'April 2024',
    result: 'Certificate of Merit',
    detail:
      'Recognised for an Anti-Sleep Alarm project showcased at the institute’s annual technical exhibition, organised by the Department of Physics and Nanotechnology.',
    gallery: [
      {
        src: `${A}/techknow-cert.jpg`,
        thumb: `${A}/techknow-cert-thumb.jpg`,
        width: 1600,
        height: 1141,
        caption: 'Certificate of Merit — TechKnow 2023–2024, SRMIST.',
      },
      {
        src: `${A}/techknow-team.jpg`,
        thumb: `${A}/techknow-team-thumb.jpg`,
        width: 1078,
        height: 1280,
        caption: 'Project team after the TechKnow exhibition.',
      },
    ],
  },
]

export const certifications = [
  {
    id: 'aws-cloud-practitioner',
    issuer: 'Amazon AWS',
    name: 'Certified Cloud Practitioner',
    date: 'March 2026',
    thumb: `${T}/aws-cloud-practitioner.png`,
    href: '/proof/certs/aws-cloud-practitioner.pdf',
  },
  {
    id: 'aws-ai-practitioner',
    issuer: 'Amazon AWS',
    name: 'Certified AI Practitioner',
    date: 'February 2026',
    thumb: `${T}/aws-ai-practitioner.png`,
    href: '/proof/certs/aws-ai-practitioner.pdf',
  },
  {
    id: 'snow-sys-admin',
    issuer: 'ServiceNow',
    name: 'Certified System Administrator',
    date: 'October 2025',
    thumb: `${T}/servicenow-csa.png`,
    href: '/proof/certs/servicenow-csa.pdf',
  },
  {
    id: 'snow-app-developer',
    issuer: 'ServiceNow',
    name: 'Certified Application Developer',
    date: 'April 2026',
    thumb: `${T}/servicenow-cad.png`,
    href: '/proof/certs/servicenow-cad.pdf',
  },
]

export const competitive = [
  {
    id: 'leetcode',
    platform: 'LeetCode',
    handle: 'SujalP21',
    figureValue: 450,
    figureSuffix: '+',
    figureLabel: 'Problems solved',
    note: 'Data structures, algorithms and daily contest practice.',
    href: 'https://leetcode.com/SujalP21',
    badge: {
      src: `${A}/leetcode-500-days.jpg`,
      width: 900,
      height: 1602,
      // Deliberately worded as days, not problems — the badge certifies
      // submission days, which is a different metric from the count above.
      caption: '500 Days Badge — submitted code on 500 or more days.',
    },
  },
  {
    id: 'hackerrank',
    platform: 'HackerRank',
    handle: 'Sujalpareek21',
    figureValue: 100,
    figureSuffix: '+',
    figureLabel: 'Problems solved',
    note: 'Gold Badge.',
    href: 'https://www.hackerrank.com/Sujalpareek21',
    badge: null,
  },
]
