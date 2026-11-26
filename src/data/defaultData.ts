import { PromptItem } from '../types';

export const INITIAL_PROMPT_ITEMS: PromptItem[] = [
  {
    id: 'prox-exec-001',
    title: 'Meeting Transcript Summary & Slack Action Items',
    department: 'executive',
    taskType: 'Meeting Summary',
    description: 'Converts raw Zoom/Teams meeting transcripts or notes into key decisions, action owners, and Slack-ready bullets.',
    basePrompt: `You are an executive assistant. Based on the attached meeting transcript or notes below, identify:
1) Key decisions made during the call.
2) Action items with assigned owners and realistic deadlines.
3) Top 3 strategic takeaways for leadership.

Format as a clean, highly scannable bulleted list ready to paste directly into Slack or Microsoft Teams.

Meeting Title: [Meeting Title]
Attendees / Key Stakeholders: [Key Attendees]
Transcript / Notes:
[Transcript Content]`,
    variables: [
      {
        id: 'var-1',
        name: 'Meeting Title',
        label: 'Meeting Title / Topic',
        placeholder: 'e.g. Q3 Growth Strategy & Client Expansion Sync',
        defaultValue: 'Weekly Operations & Client Review',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Key Attendees',
        label: 'Key Attendees / Stakeholders',
        placeholder: 'e.g. John (Director), Sarah (Account Exec), Mark (Ops VA)',
        defaultValue: 'Account Manager & Client Lead',
        type: 'text',
      },
      {
        id: 'var-3',
        name: 'Transcript Content',
        label: 'Raw Transcript or Notes',
        placeholder: 'Paste the raw Zoom transcript, Otter.ai notes, or rough meeting takeaways here...',
        defaultValue: `Sarah: We finalized the marketing budget for next month. John will approve the contractor invoices by Thursday.
Mark: I will update the CRM records with the new lead statuses by 3 PM tomorrow.
Sarah: Also let's ensure the weekly Loom report is sent to the client every Friday before 5 PM EST.`,
        type: 'textarea',
      },
    ],
    sop: {
      title: 'SOP-EX-04: Post-Meeting Summary & Action Item Distribution',
      summary: 'Follow this process immediately after client or internal Zoom calls to distribute executive recaps within 30 minutes of call conclusion.',
      estimatedTime: '8 - 12 mins',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-meeting-summary-demo',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-04-meeting-distrib',
      prerequisites: [
        'Access to Zoom Cloud Recordings / Otter.ai transcript export',
        'Slack client channel or Microsoft Teams general channel permission',
      ],
      steps: [
        'Log into Zoom Cloud or Otter.ai and download the audio/text transcript (.vtt or .txt).',
        'Review the transcript for speaker names and trim irrelevant banter from the first 2 minutes.',
        'Copy the cleaned transcript into the TaskScript Interactive Studio.',
        'Click "Assemble & Copy" or "Test Run with Gemini AI" to generate the structured summary.',
        'Verify that all action item assignees match the actual attendees.',
        'Post into the dedicated Slack #client-updates or internal sync channel using bold headers.',
      ],
      proTips: [
        'Always tag action item assignees with @mentions in Slack so nothing gets lost.',
        'If a deadline was not verbally specified in the call, add "[EOD Friday - Please Confirm]" as a placeholder.',
      ],
    },
    tags: ['Zoom', 'Slack', 'Executive Support', 'Transcripts'],
    isFavorite: true,
    usageCount: 142,
    createdAt: '2026-08-01',
  },
  {
    id: 'prox-sales-001',
    title: 'LinkedIn Cold Outreach Hook & Personalization',
    department: 'sales',
    taskType: 'Email Outreach',
    description: 'Generates ultra-personalized 1-sentence opening hooks and tailored value propositions from a prospect’s LinkedIn profile.',
    basePrompt: `I am sending a personalized B2B outreach message to [Prospect Name], who is the [Prospect Job Title] at [Company Name].
Based on their background details and recent activity below, write a 1-sentence personalized opening hook that mentions a recent achievement, company milestone, or shared industry challenge.

Tone: [Outreach Tone]
Goal: [Campaign Objective]

Prospect Bio & Recent Posts:
[Prospect LinkedIn Bio]

Value Proposition to bridge into:
[Our Value Proposition]`,
    variables: [
      {
        id: 'var-1',
        name: 'Prospect Name',
        label: 'Prospect Full Name',
        placeholder: 'e.g. Alex Morgan',
        defaultValue: 'David Miller',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Prospect Job Title',
        label: 'Job Title / Position',
        placeholder: 'e.g. VP of Operations',
        defaultValue: 'Head of Operations',
        type: 'text',
      },
      {
        id: 'var-3',
        name: 'Company Name',
        label: 'Target Company Name',
        placeholder: 'e.g. Apex Logistics Tech',
        defaultValue: 'Apex Cloud Logistics',
        type: 'text',
      },
      {
        id: 'var-4',
        name: 'Outreach Tone',
        label: 'Desired Tone',
        type: 'select',
        options: ['Professional and friendly', 'Direct and concise', 'Curious and consultative', 'Executive and peer-to-peer'],
        defaultValue: 'Professional and friendly',
      },
      {
        id: 'var-5',
        name: 'Prospect LinkedIn Bio',
        label: 'LinkedIn Bio / Recent Activity Notes',
        placeholder: 'Paste prospect bio, recent post snippet, or company news...',
        defaultValue: 'Recently posted about expanding the fulfillment logistics team to 5 new hubs across the Midwest and streamlining contractor onboarding.',
        type: 'textarea',
      },
      {
        id: 'var-6',
        name: 'Our Value Proposition',
        label: 'Value Proposition / Bridge',
        placeholder: 'How our operations team solves their problem...',
        defaultValue: 'Our team provides dedicated operations specialists that handle onboarding documentation and logistics reporting with zero ramp-up time.',
        type: 'text',
      },
    ],
    sop: {
      title: 'SOP-SL-02: High-Relevance LinkedIn & Email Personalization',
      summary: 'Standardized SOP for lead generation virtual assistants to research prospects and draft tailored opening hooks without sounding spammy.',
      estimatedTime: '5 - 7 mins per lead',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-sales-personalization',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-sales-02',
      prerequisites: [
        'LinkedIn Sales Navigator / Apollo.io account',
        'Access to CRM Lead Sheet',
      ],
      steps: [
        'Open prospect profile on LinkedIn Sales Navigator.',
        'Locate the "Activity" section to identify posts or comments from the last 30 days.',
        'Extract 1 specific detail: a promotion, hiring surge, podcast appearance, or company expansion.',
        'Feed prospect data into the TaskScript Outreach Personalizer.',
        'Copy the generated hook into your CRM / Lemlist / Apollo sequence.',
        'Verify name spelling and company name accuracy before queuing.',
      ],
      proTips: [
        'Never compliment generic attributes like "Great profile picture" or "Love your experience". Always point to a tangible business event.',
        'Keep the opening sentence under 25 words to optimize mobile preview readability.',
      ],
    },
    tags: ['Sales Navigator', 'Cold Email', 'Lead Gen', 'Personalization'],
    isFavorite: true,
    usageCount: 218,
    createdAt: '2026-08-02',
  },
  {
    id: 'prox-mkt-001',
    title: 'Content Repurposing: 1 Blog to 3 Viral LinkedIn Posts',
    department: 'marketing',
    taskType: 'Social Media',
    description: 'Extracts core concepts from long-form articles/blogs and formats them into 3 distinct high-engagement social media structures.',
    basePrompt: `Take this [Word Count] blog post / transcript excerpt and rewrite it into three distinct LinkedIn posts:
1) A "Controversial Take / Counter-Intuitive Insight" post with an irresistible 1-line hook.
2) A "Step-by-Step Actionable Framework" post with clean bullet points or numbered breakdown.
3) A "Behind-the-Scenes Story / Case Study" post focusing on human lessons learned.

Audience: [Target Audience]
Call to Action: [Desired CTA]
Constraint: Keep each post under 1,200 characters and include 3 relevant hashtags.

Source Content:
[Source Content Text]`,
    variables: [
      {
        id: 'var-1',
        name: 'Word Count',
        label: 'Approximate Source Length',
        defaultValue: '500-word',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Target Audience',
        label: 'Target Audience / Readers',
        defaultValue: 'Startup Founders, COOs, and Remote Operations Leaders',
        type: 'text',
      },
      {
        id: 'var-3',
        name: 'Desired CTA',
        label: 'Call to Action (CTA)',
        defaultValue: 'Comment "SOP" below or click the link in the first comment to grab our free delegation checklist.',
        type: 'text',
      },
      {
        id: 'var-4',
        name: 'Source Content Text',
        label: 'Source Article / Post Excerpt',
        placeholder: 'Paste the blog article, newsletter, or transcript excerpt here...',
        defaultValue: `Most founders fail at hiring virtual assistants because they delegate tasks instead of outcomes. When you tell a VA 'manage my inbox,' they will ask 20 questions a day. When you provide a clear triage decision tree and an AI prompt template, they operate autonomously with 99% accuracy. Systems-first outsourcing is the secret to scaling from $1M to $5M ARR without burning out.`,
        type: 'textarea',
      },
    ],
    sop: {
      title: 'SOP-MK-07: Content Repurposing & Multi-Channel Distribution',
      summary: 'Procedure for Marketing VAs to transform 1 piece of pillar content (blog, webinar, podcast) into a full week of social media assets.',
      estimatedTime: '15 mins',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-content-repurposing',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-marketing-07',
      prerequisites: ['Access to Notion Content Calendar', 'Buffer / Hootsuite scheduling queue'],
      steps: [
        'Review the client’s weekly published article or video transcript.',
        'Extract the single most provocative quote or actionable takeaway.',
        'Run the TaskScript Content Repurposing prompt to assemble 3 creative angles.',
        'Add line breaks every 1-2 sentences to ensure high mobile readability.',
        'Schedule Post 1 for Tuesday 8:30 AM, Post 2 for Thursday 12:15 PM, and Post 3 for Sunday evening.',
      ],
      proTips: [
        'Avoid putting external links in the body of the LinkedIn post; always put the link in the first comment.',
        'Use emojis sparingly as structural bullet markers (e.g., 📌, 💡, ⚡) rather than decorative clutter.',
      ],
    },
    tags: ['LinkedIn', 'Content Marketing', 'Copywriting', 'Repurposing'],
    isFavorite: true,
    usageCount: 189,
    createdAt: '2026-08-05',
  },
  {
    id: 'prox-exec-002',
    title: 'Daily Executive Briefing & Calendar Prioritization',
    department: 'executive',
    taskType: 'Executive Briefing',
    description: 'Assembles a daily 8:00 AM executive digest highlighting today’s top 3 priorities, meeting schedule, urgent emails, and blockers.',
    basePrompt: `You are an elite Executive Assistant for [Executive Name], [Executive Title] at [Company Name].
Based on the schedule and unread priorities provided, compile a crisp, executive-ready "Daily Morning Briefing" organized into:

1. ⚡ Top 3 Critical Focus Items for Today
2. 📅 Meeting Roadmap (Chronological schedule with attendee context & preparation needs)
3. 📬 High-Priority Inquiries Requiring Decisions (with 1-sentence draft recommendation for each)
4. 🛡️ Operational Blockers or Reminders

Tone: Crisp, proactive, and structured.

Raw Calendar Events:
[Calendar Schedule]

Urgent Emails / Pending Decisions:
[Pending Inquiries]`,
    variables: [
      {
        id: 'var-1',
        name: 'Executive Name',
        label: 'Executive Name',
        defaultValue: 'Elena Ramos',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Executive Title',
        label: 'Role / Title',
        defaultValue: 'Chief Executive Officer',
        type: 'text',
      },
      {
        id: 'var-3',
        name: 'Company Name',
        label: 'Company',
        defaultValue: 'Enterprise Client #104',
        type: 'text',
      },
      {
        id: 'var-4',
        name: 'Calendar Schedule',
        label: 'Today’s Calendar Events',
        defaultValue: `9:00 AM - 9:30 AM: Team Standup
11:00 AM - 12:00 PM: Investor Pitch (needs pitch deck v3 opened)
2:00 PM - 2:45 PM: 1-on-1 with VP Engineering
4:30 PM - 5:00 PM: Client Contract Signing Call with Acme Corp`,
        type: 'textarea',
      },
      {
        id: 'var-5',
        name: 'Pending Inquiries',
        label: 'Urgent Emails / Pending Decisions',
        defaultValue: `1) Legal counsel sent final NDA revisions awaiting Elena's sign-off.
2) Vendor invoice from AWS ($4,200) requires credit card authorization.
3) Podcast invite from Modern Scaling Podcast proposing interview next Wednesday.`,
        type: 'textarea',
      },
    ],
    sop: {
      title: 'SOP-EX-01: Daily Morning Executive Briefing Delivery',
      summary: 'Deliver by 7:45 AM local executive time via Slack DM and email so the executive starts the day with total clarity.',
      estimatedTime: '10 - 15 mins',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-daily-briefing',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-01-briefing',
      prerequisites: ['Google Calendar view permissions', 'Delegated email access or Slack digest'],
      steps: [
        'Check executive Google Calendar for conflicting or double-booked slots.',
        'Review starred/urgent messages in Gmail inbox received overnight.',
        'Verify meeting links (Zoom/Google Meet) are populated for all calls.',
        'Generate the briefing via TaskScript.',
        'Send via Slack DM with the greeting "Good morning [Name], here is your Daily Roadmap:"',
      ],
      proTips: [
        'Always link the relevant Google Doc / Slide deck next to each meeting line item.',
      ],
    },
    tags: ['Calendar', 'Executive Support', 'Briefing', 'Productivity'],
    isFavorite: false,
    usageCount: 97,
    createdAt: '2026-08-08',
  },
  {
    id: 'prox-supp-001',
    title: 'Customer De-escalation & Refund Resolution Responder',
    department: 'support',
    taskType: 'Support Ticket',
    description: 'Crafts empathetic, brand-aligned responses to upset customers with clear resolution steps and policy compliance.',
    basePrompt: `You are a Senior Customer Experience Specialist for [Brand / Company Name].
An upset customer has sent the following complaint regarding [Issue Category].

Write a compassionate, empathetic, and professional response that:
1) Acknowledges their frustration sincerely without blaming the customer or making false promises.
2) Explains the direct resolution steps we are taking immediately.
3) Offers [Resolution Offer / Compensation].
4) Closes with reassurance and a direct contact line.

Customer Complaint:
[Customer Message]

Brand Guidelines / Policy Details:
[Internal Policy Notes]`,
    variables: [
      {
        id: 'var-1',
        name: 'Brand / Company Name',
        label: 'Company / Brand Name',
        defaultValue: 'Apex E-Commerce Client',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Issue Category',
        label: 'Issue Category',
        type: 'select',
        options: ['Delayed Delivery / Missing Package', 'Defective Product / Hardware Issue', 'Billing / Unauthorized Renewal', 'Account Access / Login Lockout'],
        defaultValue: 'Delayed Delivery / Missing Package',
      },
      {
        id: 'var-3',
        name: 'Customer Message',
        label: 'Customer Complaint Message',
        placeholder: 'Paste the customer ticket or email...',
        defaultValue: `I ordered priority 2-day shipping 6 days ago for my daughter's birthday gift and tracking still says 'In Transit'. The party is tomorrow! I want a full refund and I am never ordering again.`,
        type: 'textarea',
      },
      {
        id: 'var-4',
        name: 'Resolution Offer / Compensation',
        label: 'Resolution / Remedy Offered',
        defaultValue: '100% shipping fee refund + $20 gift voucher for future purchase + carrier intercept status update.',
        type: 'text',
      },
      {
        id: 'var-5',
        name: 'Internal Policy Notes',
        label: 'Internal Policy / SLA Rules',
        defaultValue: 'Do not debate carrier delays; focus on immediate validation and proactive tracking resolution.',
        type: 'textarea',
      },
    ],
    sop: {
      title: 'SOP-CS-03: Tier-2 Escalation & Empathetic De-escalation',
      summary: 'Protocol for managing dissatisfied customers to achieve satisfaction and prevent negative public reviews.',
      estimatedTime: '6 - 9 mins',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-customer-deescalation',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-cs-03',
      steps: [
        'Look up customer order number in Shopify/Zendesk backend.',
        'Confirm shipping carrier status before replying.',
        'Apply the standard 3-part empathy framework (Acknowledge, Solve, Reassure).',
        'Process the reimbursement/credit in the payment gateway according to client approval limits ($50 max without manager sign-off).',
        'Tag the ticket in Zendesk as "#EscalationResolved".',
      ],
      proTips: [
        'Never use the phrase "As per our policy..." as it inflames customer frustration.',
      ],
    },
    tags: ['Zendesk', 'Customer Success', 'Support', 'De-escalation'],
    isFavorite: false,
    usageCount: 164,
    createdAt: '2026-08-10',
  },
  {
    id: 'prox-ops-001',
    title: 'Weekly Client Project Status & Risk Digest',
    department: 'operations',
    taskType: 'Project Management',
    description: 'Synthesizes weekly task progression, milestone burn-down, pending client approvals, and proactive risk mitigation.',
    basePrompt: `You are a Technical Project Manager managing the [Project Name] project for [Client Name].
Compile a structured "Weekly Project Status Report" for the executive stakeholders based on the data below.

Format:
• 🚦 Overall Project Health (Green / Yellow / Red) with 2-sentence rationale
• 🏆 Key Milestones Completed This Week
• 🎯 Objectives for Next Week
• ⚠️ Active Risks / Client Decisions Needed (Include what we need from the client and by when)

Weekly Notes & Data:
[Status Raw Data]`,
    variables: [
      {
        id: 'var-1',
        name: 'Project Name',
        label: 'Project Name / Scope',
        defaultValue: 'CRM Migration & SOP Knowledge Base Overhaul',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Client Name',
        label: 'Client Company',
        defaultValue: 'Horizon Health Partners',
        type: 'text',
      },
      {
        id: 'var-3',
        name: 'Status Raw Data',
        label: 'Weekly Notes, Milestones, and Blocker Notes',
        defaultValue: `Completed: Cleaned 12,000 legacy CRM records, mapped 4 custom field pipelines, recorded 6 training Loom videos.
In Progress: User permission testing in sandbox environment.
Blocker/Need from Client: Need client IT security admin to approve OAuth API permissions for HubSpot integration by Wednesday 5 PM to stay on target for launch next Monday.`,
        type: 'textarea',
      },
    ],
    sop: {
      title: 'SOP-PM-05: Weekly Stakeholder Project Reporting',
      summary: 'Deliver every Friday by 3:00 PM EST to client executive sponsors to maintain complete transparency.',
      estimatedTime: '12 - 15 mins',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-weekly-project-status',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-pm-05',
      steps: [
        'Review Asana / ClickUp board for all completed sprint tasks this week.',
        'Identify any overdue tickets and tag the root cause.',
        'Populate data into TaskScript Status Generator.',
        'Generate the report and paste into the shared Google Doc or client email update.',
        'Attach the updated Gantt chart or roadmap screenshot.',
      ],
      proTips: [
        'Never report a "Red" status without offering at least 2 potential recovery options.',
      ],
    },
    tags: ['ClickUp', 'Asana', 'Project Management', 'Client Reporting'],
    isFavorite: true,
    usageCount: 112,
    createdAt: '2026-08-11',
  },
  {
    id: 'prox-hr-001',
    title: 'Candidate Screening Summary & Scorecard',
    department: 'hr',
    taskType: 'Talent Screening',
    description: 'Summarizes preliminary virtual assistant or contractor interviews into structured scorecards with hiring recommendations.',
    basePrompt: `You are a Talent Acquisition Specialist.
Summarize the initial screening call for candidate [Candidate Name] applying for the position of [Target Role].

Structure the scorecard as:
1. 👤 Executive Snapshot (Years of experience, primary tech stack, English fluency rating)
2. 💡 Key Strengths & Standout Competencies
3. ⚠️ Potential Growth Areas or Concerns
4. 📊 Hiring Recommendation: (Strong Yes / Yes / Hold / No) with clear justification

Screening Notes & Audio Transcript Excerpt:
[Interview Notes]`,
    variables: [
      {
        id: 'var-1',
        name: 'Candidate Name',
        label: 'Candidate Full Name',
        defaultValue: 'Maria Santos',
        type: 'text',
      },
      {
        id: 'var-2',
        name: 'Target Role',
        label: 'Applied Role',
        defaultValue: 'Senior Operations & Executive VA',
        type: 'text',
      },
      {
        id: 'var-3',
        name: 'Interview Notes',
        label: 'Raw Interview Notes / Transcription',
        defaultValue: `5 years experience working with US-based founders. High proficiency in ClickUp, Slack, Google Workspace, and Canva. English communication is C2 fluent with clear articulation. Handled calendar management for 3 executives simultaneously. Salary expectation: within client budget ($12/hr). Available to start in 2 weeks.`,
        type: 'textarea',
      },
    ],
    sop: {
      title: 'SOP-HR-02: Talent Interview Scorecard Submission',
      summary: 'HR specialists must log candidate summaries into the Talent ATS within 2 hours of interview completion.',
      estimatedTime: '8 mins',
      loomUrl: 'https://www.loom.com/share/taskscript-sop-hr-scorecard',
      docUrl: 'https://docs.google.com/document/d/taskscript-sop-hr-02',
      steps: [
        'Collect notes taken during the 20-minute Zoom screening call.',
        'Evaluate English verbal fluency, tech proficiency, and schedule alignment.',
        'Run the TaskScript HR Scorecard Assembler.',
        'Paste the scorecard into the candidate’s profile in Notion / Greenhouse ATS.',
        'Notify the Account Manager via Slack #talent-pipeline.',
      ],
      proTips: [
        'Highlight any experience the candidate has with specific niche tools required by the client.',
      ],
    },
    tags: ['HR', 'Recruiting', 'Scorecard', 'Talent Ops'],
    isFavorite: false,
    usageCount: 78,
    createdAt: '2026-08-14',
  },
];

export const DEPARTMENT_CONFIG: Record<
  string,
  { label: string; iconName: string; color: string; bgLight: string; border: string; description: string }
> = {
  all: {
    label: 'All Departments',
    iconName: 'LayoutGrid',
    color: 'text-slate-800',
    bgLight: 'bg-slate-100',
    border: 'border-slate-300',
    description: 'Central knowledge vault across all outsourcing divisions',
  },
  executive: {
    label: 'Executive & Admin',
    iconName: 'Briefcase',
    color: 'text-sky-700',
    bgLight: 'bg-sky-50',
    border: 'border-sky-200',
    description: 'Meeting notes, calendar roadmap, inbox triage, executive briefs',
  },
  marketing: {
    label: 'Marketing & Content',
    iconName: 'Sparkles',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'Social repurposing, LinkedIn hooks, copywriting, newsletters',
  },
  sales: {
    label: 'Sales & Lead Gen',
    iconName: 'Target',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'Outreach hooks, objection handling, lead qualification, CRM',
  },
  operations: {
    label: 'Operations & PM',
    iconName: 'Cpu',
    color: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
    description: 'Project reports, client onboarding, incident management, sprint recaps',
  },
  support: {
    label: 'Customer Support',
    iconName: 'Headphones',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    description: 'De-escalation macros, ticket resolution, refund handling, FAQs',
  },
  hr: {
    label: 'HR & Talent Ops',
    iconName: 'Users',
    color: 'text-purple-700',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
    description: 'Candidate screening, talent scorecards, contractor onboarding',
  },
};
