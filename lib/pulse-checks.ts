// ─────────────────────────────────────────────────────────────────────────────
// Survey question data — all 4 Pulse Checks
// To edit questions, change the text/options here. Do not change the 'id' fields
// as they are used as database column keys.
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionType =
  | 'scale'           // 5-point labeled scale (radio buttons)
  | 'ranked_choice'   // Click items in order of preference
  | 'multi_select'    // Tick all that apply
  | 'single_choice'   // Pick exactly one from a list
  | 'binary'          // Yes / No

export interface Question {
  id: string
  label: string        // Short tag shown above the question, e.g. "The Priority"
  text: string
  type: QuestionType
  options: string[]
  required?: boolean
}

export interface PulseCheck {
  id: number
  title: string
  subtitle: string
  intro: string        // Shown at the top of the survey page
  questions: Question[]
}

export const pulseChecks: PulseCheck[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // PULSE CHECK 1 — The Core Mandate
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'Pulse Check 1',
    subtitle: 'The Core Mandate',
    intro: 'Help us understand the state of society's support for health and wellbeing — and what needs to change.',
    questions: [
      {
        id: 'pc1_q1_pulse_check',
        label: 'Pulse Check',
        text: 'Do you feel society today is becoming more supportive of people\'s health and wellbeing, or is it falling behind?',
        type: 'scale',
        options: [
          'Improving significantly',
          'Improving slightly',
          'Staying the same',
          'Falling behind slightly',
          'Falling behind rapidly',
        ],
        required: true,
      },
      {
        id: 'pc1_q2_priority',
        label: 'The Priority',
        text: 'If society could solve ONE issue affecting women\'s wellbeing in the next five years, what should it be? Rank these in order of importance to you.',
        type: 'ranked_choice',
        options: [
          'Healthcare access',
          'Workplace equality',
          'Financial security',
          'Safety',
          'Mental wellbeing',
        ],
        required: true,
      },
      {
        id: 'pc1_q3_responsibility',
        label: 'Responsibility',
        text: 'Who is best placed to lead the change required to help individuals and society improve? Select all that apply.',
        type: 'multi_select',
        options: [
          'Governments',
          'Healthcare systems',
          'Employers',
          'Brands / Companies',
          'Communities',
        ],
        required: true,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PULSE CHECK 2 — The Data Frontier
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'Pulse Check 2',
    subtitle: 'The Data Frontier',
    intro: 'Share your views on data ownership and how personal health data should be used.',
    questions: [
      {
        id: 'pc2_q1_ownership',
        label: 'Ownership',
        text: 'Would you support a shift where individuals, rather than "Big Tech" or large organisations, own and control their own health and wellbeing data?',
        type: 'scale',
        options: [
          'Strongly support',
          'Somewhat support',
          'Neutral',
          'Somewhat oppose',
          'Strongly oppose',
        ],
        required: true,
      },
      {
        id: 'pc2_q2_trust',
        label: 'Conditions of Trust',
        text: 'What is the most important factor for you to share your data anonymously for research? Select all that apply.',
        type: 'multi_select',
        options: [
          'I must own it',
          'I choose who accesses it',
          'I can withdraw it at any time',
          'Independent oversight',
        ],
        required: true,
      },
      {
        id: 'pc2_q3_value',
        label: 'The Value Exchange',
        text: 'If you share your "lived experience" to help research, what is the most meaningful value you should receive in return?',
        type: 'single_choice',
        options: [
          'Personal health insights',
          'Better community care',
          'Financial rewards / Discounts',
          'Supporting global research',
        ],
        required: true,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PULSE CHECK 3 — The Brand Mandate & Media Platform
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'Pulse Check 3',
    subtitle: 'The Brand Mandate',
    intro: 'Tell us how you feel about health information online — and the role brands should play.',
    questions: [
      {
        id: 'pc3_q1_trust_gap',
        label: 'The Trust Gap',
        text: 'How often do you feel overwhelmed or misled by health information managed by social media algorithms?',
        type: 'scale',
        options: [
          'Always',
          'Often',
          'Sometimes',
          'Rarely',
          'Never',
        ],
        required: true,
      },
      {
        id: 'pc3_q2_brand_behaviour',
        label: 'Brand Behaviour',
        text: 'If brands invested part of their advertising budget into improving societal health infrastructure (like this platform) rather than just ads, how would you feel about them?',
        type: 'scale',
        options: [
          'Much more positive',
          'Somewhat more positive',
          'No difference',
          'Somewhat more negative',
          'More negative',
        ],
        required: true,
      },
      {
        id: 'pc3_q3_brand_boundaries',
        label: 'Brand Boundaries',
        text: 'What role should brands be allowed to play on a health and wellbeing platform? Select all that apply.',
        type: 'multi_select',
        options: [
          'Fund research',
          'Share educational content',
          'Offer products / services',
          'No role at all',
        ],
        required: true,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PULSE CHECK 4 — The Impact Fund & Marketplace
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    title: 'Pulse Check 4',
    subtitle: 'The Impact Fund',
    intro: 'Help us understand your appetite for social investment and the role of data in driving positive change.',
    questions: [
      {
        id: 'pc4_q1_social_investment',
        label: 'Social Investment',
        text: 'Would you favour a brand that contributes a portion of its profits to a "Wellbeing Impact Fund" to solve societal health gaps?',
        type: 'binary',
        options: ['Yes', 'No'],
        required: true,
      },
      {
        id: 'pc4_q2_commercial',
        label: 'Commercial Participation',
        text: 'Would you choose to share anonymised data for commercial innovation (e.g. travel companies exploring travel stress) if you benefited directly from better services?',
        type: 'single_choice',
        options: [
          'Yes, if I benefit directly',
          'Yes, for the greater good',
          'No',
        ],
        required: true,
      },
    ],
  },
]

// Helper — look up a pulse check by id
export function getPulseCheck(id: number): PulseCheck | undefined {
  return pulseChecks.find((p) => p.id === id)
}
