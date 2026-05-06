# RegisAI

RegisAI is an AI-powered compliance auditing platform built to automate the analysis of compliance manuals against regulatory standards. Using advanced language models from Anthropic, RegisAI performs gap analysis, identifies missing or non-compliant sections, and assigns risk levels to help firms maintain strict regulatory adherence.

## Features

- **Automated Gap Analysis**: Upload compliance manuals (PDF) to run automatic checks against a comprehensive regulatory library.
- **Risk Assessment**: Issues are categorized by risk level (High, Medium, Low) to help prioritize remediation efforts.
- **Detailed Audit Reports**: View comprehensive reports detailing the specific gaps found, along with context and recommendations.
- **Secure Authentication**: Built with Supabase Auth to ensure that sensitive compliance data is securely managed and isolated by user.
- **Modern Dashboard**: A clean, responsive interface for managing past audits and initiating new ones.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Integration**: [Anthropic Claude API](https://www.anthropic.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PDF Processing**: `pdf-parse`

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- An Anthropic API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bitcoinow/RegisAI.git
   cd RegisAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env.local` and fill in the required values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
