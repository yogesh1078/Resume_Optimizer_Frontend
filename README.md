# Resume Optimizer - Mini Flashfire System

A full-stack application that automates resume optimization using AI (OpenAI GPT or Google Gemini) and syncs updates to a job card dashboard in real-time.

## Features

 **Job Card Dashboard**: Create, edit, delete, and manage job cards
 **Resume Optimization**: AI-powered resume optimization using OpenAI or Gemini
 **Automatic Sync**: Job cards automatically update when resumes are optimized
**Change Tracking**: View side-by-side comparison of original vs optimized resumes
**Real-time Status Updates**: Status changes from "Pending Optimization" to "Optimized"
**Dual Interface**: Dashboard for job management and standalone optimizer

## Tech Stack

- **Frontend**: Next.js 14 + React 18
- **Backend**: Node.js + Express
- **Database**: MongoDB (with Mongoose)
- **AI Integration**: OpenAI GPT-4o-mini / Google Gemini
- **Styling**: Custom CSS with modern gradient design

## Project Structure

```
Resume_Optimizer/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── utils/          # AI services (OpenAI/Gemini)
│   └── server.js       # Express server
├── frontend/
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   └── styles/         # CSS styling
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- OpenAI API key OR Google Gemini API key

### Step 1: Clone and Setup

```bash
cd "D:\Web development course\Resume_Optimizer"
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume_optimizer
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_optimizer

# Choose AI provider: 'openai' or 'gemini'
AI_PROVIDER=openai

# For OpenAI (get key from https://platform.openai.com)
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini

# For Gemini (get key from https://makersuite.google.com)
# GEMINI_API_KEY=your-gemini-key-here
```

Start the backend server:

```bash
npm run dev
# Server will run on http://localhost:5000
```

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
# Open http://localhost:3000
```

## Usage

### 1. Dashboard (Main Page)

- **Add Job Card**: Click "+ Add Job Card" to create a new job card
- **Fill in details**: Client name, company, position, job description, application link
- **Paste base resume**: Add the original resume content
- **Click Save**: Job card is created with status "Pending Optimization"

### 2. Optimize Resume

- **Click "Optimize Resume"** on any job card
- AI processes the resume using the job description
- **Automatically updates**: Status → "Optimized", timestamp added, changes summary added
- **View Changes**: Click "View Changes" to see side-by-side comparison

### 3. Standalone Optimizer

- Navigate to `/optimize` page
- Enter client name, job description, and resume
- Click "Optimize Resume" to get instant AI-optimized version
- No job card is created (for quick testing)

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all job cards
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job card
- `PUT /api/jobs/:id` - Update job card
- `DELETE /api/jobs/:id` - Delete job card

### Resumes
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes/:id` - Get specific resume

### Optimization
- `POST /api/optimization/optimize` - Optimize resume (updates job card)
- `POST /api/optimization/direct` - Direct optimization (standalone)
- `GET /api/optimization/history/:jobId` - Get optimization history

## Automation Logic

When you click "Optimize Resume" on a job card:

1. **Fetch base resume** from the job card
2. **Send to AI** (OpenAI/Gemini) with job description
3. **Receive optimized version** and changes summary
4. **Auto-update job card**:
   - Status → "Optimized"
   - `optimizedOn` → current timestamp
   - `changes` → AI-generated summary
   - `optimizedResumeId` → new resume document ID
5. **Refresh dashboard** to show updated status

## AI Configuration

### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add to `.env`:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini  # Recommended for cost efficiency
   ```

### Gemini Setup

1. Go to [Google AI Studio](https://makersuite.google.com)
2. Click "Get API Key"
3. Create a new key
4. Copy the key and add to `.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-key-here
   ```

## Database Schema

### Job Model
```javascript
{
  clientName: String,
  companyName: String,
  position: String,
  jobDescription: String,
  jobLink: String,
  status: "Pending Optimization" | "Optimized" | "In Progress",
  optimizedOn: Date,
  changes: String,
  baseResumeId: ObjectId,
  optimizedResumeId: ObjectId
}
```

### Resume Model
```javascript
{
  clientName: String,
  content: String,
  version: "base" | "optimized",
  jobId: ObjectId,
  changesSummary: String
}
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas connection string
- Check `.env` MONGODB_URI is correct

### API Key Errors
- Verify API key is set in `.env`
- Check API key is valid and has credits
- OpenAI: Check usage at https://platform.openai.com/usage
- Gemini: Free tier has generous limits

### CORS Errors
- Backend is configured with CORS middleware
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

## Development

### Backend Scripts
```bash
cd backend
npm start      # Production mode
npm run dev    # Development with nodemon
```

### Frontend Scripts
```bash
cd frontend
npm run dev    # Development server
npm run build  # Production build
npm start      # Production server
```

## Future Enhancements

- [ ] Add user authentication
- [ ] Resume file upload (PDF/DOCX parsing)
- [ ] Multiple resume versions tracking
- [ ] AI model selection per job
- [ ] Email notifications on optimization
- [ ] Analytics dashboard
- [ ] Export optimized resume as PDF
- [ ] ATS compatibility scoring

## Credits

Built as a mini version of Flashfire's internal resume optimization system.

---

**Questions?** Check the code comments or open an issue on the repository.

