// seed.js
// ─────────────────────────────────────────────────────────────────────────────
// This script FILLS YOUR DATABASE with all the data from your frontend.
// Run it ONE TIME using: node seed.js
//
// It will create:
//   1. 3 demo users  (1 admin, 1 recruiter, 1 candidate)
//   2. 12 jobs       (all the jobs from your frontend jobs.js)
//   3. 2 sample applications
//   4. 2 sample saved jobs
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

// Import all our Mongoose models
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');

// ─── ALL 12 JOBS FROM YOUR FRONTEND jobs.js ───────────────────────────────────
// This is the exact same data that was in your frontend's static data/jobs.js
// We are now moving it from the frontend to MongoDB!

const jobsData = [
  {
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Bangalore, India (Hybrid)",
    salary: "$90,000 - $120,000",
    jobType: "Full Time",
    experience: "3-5 years",
    category: "Software Development",
    description:
      "TechNova Solutions is seeking an experienced Frontend Developer to lead the development of our customer-facing web applications. You will collaborate with product designers, backend engineers, and product managers to build scalable, high-performance web experiences using React, modern JavaScript, and modern UI libraries.",
    requirements: [
      "Minimum 3+ years of professional experience with React and modern JavaScript (ES6+).",
      "Proficient understanding of web markup, CSS3, responsive design, and CSS architecture.",
      "Experience with state management, client-side routing, and RESTful API integration.",
      "Familiarity with code versioning tools such as Git and GitHub.",
      "Strong problem-solving ability and excellent communication skills."
    ],
    requiredSkills: ["React", "JavaScript", "HTML5", "CSS3", "Git", "REST APIs", "Redux", "Webpack"],
    status: "open"
  },
  {
    title: "Full Stack Engineer",
    company: "CloudScale Systems",
    location: "Remote",
    salary: "$95,000 - $130,000",
    jobType: "Remote",
    experience: "2-4 years",
    category: "Software Development",
    description:
      "Join our distributed engineering team building next-generation cloud infrastructure management tools. You will work across both client and server applications, architecting robust backend APIs and intuitive web interfaces.",
    requirements: [
      "2+ years of hands-on full stack development experience.",
      "Strong proficiency in Node.js, Express, and React.",
      "Hands-on experience with SQL (PostgreSQL) and NoSQL (MongoDB) databases.",
      "Understanding of serverless architectures and cloud deployment on AWS or GCP.",
      "Ability to write clean, maintainable, and well-tested code."
    ],
    requiredSkills: ["Node.js", "React", "Express", "MongoDB", "PostgreSQL", "AWS", "Docker"],
    status: "open"
  },
  {
    title: "UI/UX Product Designer",
    company: "PixelCraft Studio",
    location: "San Francisco, CA (On-site)",
    salary: "$85,000 - $110,000",
    jobType: "Full Time",
    experience: "2-4 years",
    category: "UI/UX Design",
    description:
      "PixelCraft Studio is looking for a talented UI/UX Product Designer to craft intuitive, user-centered digital interfaces for SaaS products and mobile applications. You will create user personas, wireframes, high-fidelity prototypes, and design systems.",
    requirements: [
      "Strong portfolio demonstrating user-centered design process and visual aesthetics.",
      "Proficiency in Figma, Adobe XD, or Sketch.",
      "Experience conducting user interviews, usability testing, and persona creation.",
      "Understanding of design systems, typography, color theory, and responsive grids.",
      "Basic understanding of HTML/CSS capabilities and constraints."
    ],
    requiredSkills: ["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping", "Design Systems"],
    status: "open"
  },
  {
    title: "Data Scientist & AI Specialist",
    company: "InsightAI Analytics",
    location: "Hyderabad, India (Hybrid)",
    salary: "$100,000 - $140,000",
    jobType: "Full Time",
    experience: "3-6 years",
    category: "Data Science",
    description:
      "InsightAI is looking for a passionate Data Scientist to extract meaningful insights from massive enterprise datasets. You will develop predictive models, machine learning algorithms, and interactive dashboards to drive business decision-making.",
    requirements: [
      "B.Tech/M.S. in Computer Science, Statistics, Mathematics, or a related quantitative field.",
      "Strong expertise in Python, Pandas, NumPy, Scikit-Learn, and PyTorch or TensorFlow.",
      "Solid foundation in statistical methods, regression, classification, and deep learning.",
      "Experience with SQL and big data querying tools.",
      "Ability to convey complex data findings through visualization tools like PowerBI or Tableau."
    ],
    requiredSkills: ["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "PyTorch", "Tableau"],
    status: "open"
  },
  {
    title: "Digital Marketing Specialist",
    company: "GrowthWave Media",
    location: "Austin, TX (Remote)",
    salary: "$60,000 - $80,000",
    jobType: "Remote",
    experience: "1-3 years",
    category: "Marketing",
    description:
      "We are seeking an energetic Digital Marketing Specialist to execute high-impact multi-channel marketing campaigns. You will oversee paid advertising (Google Ads, Meta Ads), search engine optimization (SEO), email marketing, and content distribution.",
    requirements: [
      "Bachelor's degree in Marketing, Communications, or related discipline.",
      "Proven track record managing paid search and social ad budgets with positive ROI.",
      "Deep understanding of SEO tools (Ahrefs, SEMrush) and Google Analytics 4.",
      "Excellent copywriting and content strategy skills.",
      "Experience with email marketing automation tools like HubSpot or Mailchimp."
    ],
    requiredSkills: ["SEO", "Google Ads", "Content Strategy", "Email Marketing", "Social Media", "Analytics"],
    status: "open"
  },
  {
    title: "Financial Analyst",
    company: "Apex Capital Partners",
    location: "New York, NY (On-site)",
    salary: "$80,000 - $105,000",
    jobType: "Full Time",
    experience: "2-4 years",
    category: "Finance",
    description:
      "Apex Capital Partners is looking for a sharp Financial Analyst to assist in quantitative modeling, portfolio valuation, variance analysis, and preparing quarterly financial reports for senior executives and investors.",
    requirements: [
      "Bachelor's degree in Finance, Accounting, Economics, or related field.",
      "Advanced proficiency in Microsoft Excel (VLOOKUP, Pivot Tables, financial modeling).",
      "Experience with financial forecasting, variance analysis, and cash flow modeling.",
      "Strong analytical, organizational, and presentation skills.",
      "Knowledge of ERP systems (SAP, Oracle) is a plus."
    ],
    requiredSkills: ["Financial Modeling", "Excel", "Forecasting", "Valuation", "Accounting", "Risk Analysis"],
    status: "open"
  },
  {
    title: "Human Resources Coordinator",
    company: "Vanguard Global Solutions",
    location: "Mumbai, India (On-site)",
    salary: "$45,000 - $65,000",
    jobType: "Full Time",
    experience: "1-3 years",
    category: "Human Resources",
    description:
      "Vanguard Global Solutions is seeking an enthusiastic HR Coordinator to manage talent acquisition workflows, onboarding programs, employee engagement initiatives, and HR documentation.",
    requirements: [
      "Bachelor's degree in Human Resources, Business Administration, or Psychology.",
      "1+ years of experience in recruitment coordination or HR operations.",
      "Hands-on experience with Applicant Tracking Systems (ATS) and HRIS platforms.",
      "Strong interpersonal skills and an empathetic approach to employee relations.",
      "Proficient in labor compliance guidelines and document management."
    ],
    requiredSkills: ["Recruitment", "Employee Onboarding", "HRIS", "Talent Acquisition", "Employee Relations"],
    status: "open"
  },
  {
    title: "React Native Mobile Developer",
    company: "AppSphere Technologies",
    location: "Remote",
    salary: "$85,000 - $115,000",
    jobType: "Remote",
    experience: "2-5 years",
    category: "Software Development",
    description:
      "Build high-performance cross-platform iOS and Android mobile applications. You will be responsible for translating wireframes into smooth mobile user interfaces and integrating native hardware APIs.",
    requirements: [
      "2+ years of mobile application development using React Native.",
      "Firm grasp of JavaScript/TypeScript, JSX, and mobile layout mechanics.",
      "Experience publishing apps to Google Play Store and Apple App Store.",
      "Knowledge of native build tools like Xcode and Android Studio.",
      "Experience with offline storage, push notifications, and geolocation services."
    ],
    requiredSkills: ["React Native", "JavaScript", "iOS", "Android", "Redux", "REST APIs", "Mobile UI"],
    status: "open"
  },
  {
    title: "Junior Backend Developer (Node.js)",
    company: "NextGen Software",
    location: "Pune, India (Hybrid)",
    salary: "$50,000 - $70,000",
    jobType: "Full Time",
    experience: "0-2 years",
    category: "Software Development",
    description:
      "An exciting entry-level to junior opportunity for aspiring backend developers! You will work under senior engineering mentorship to build REST APIs, database schemas, and microservice integrations.",
    requirements: [
      "Degree in Computer Science, IT, or equivalent practical project experience.",
      "Good working knowledge of JavaScript, Node.js, and Express.",
      "Basic understanding of SQL queries and relational database concepts.",
      "Familiarity with Postman or curl for API testing.",
      "Eagerness to learn, collaborate, and adapt to modern backend best practices."
    ],
    requiredSkills: ["Node.js", "Express", "JavaScript", "SQL", "Git", "REST APIs", "Postman"],
    status: "open"
  },
  {
    title: "Product Marketing Intern",
    company: "BrandCraft Agency",
    location: "Chicago, IL (Hybrid)",
    salary: "$30,000 - $40,000",
    jobType: "Internship",
    experience: "Fresher / 0-1 year",
    category: "Marketing",
    description:
      "Kickstart your marketing career with our 6-month structured internship program. You will create engaging social media campaigns, assist in product launches, write blog content, and track campaign metrics.",
    requirements: [
      "Currently pursuing or recently graduated with a degree in Marketing, PR, or English.",
      "Exceptional written English skills and creative storytelling flair.",
      "Familiarity with Canva, Instagram, LinkedIn, and TikTok marketing strategies.",
      "Enthusiastic team player with an analytical mindset.",
      "Ability to commit full-time or part-time for at least 6 months."
    ],
    requiredSkills: ["Social Media Marketing", "Content Writing", "Canva", "Market Research", "SEO Basics"],
    status: "open"
  },
  {
    title: "Junior UI Designer",
    company: "CreativeFlow Agency",
    location: "Remote",
    salary: "$50,000 - $68,000",
    jobType: "Part Time",
    experience: "1-2 years",
    category: "UI/UX Design",
    description:
      "CreativeFlow is looking for a creative Part-Time UI Designer to design responsive landing pages, mobile interfaces, and web application dashboards. Great for freelancers or students looking for flexible hours.",
    requirements: [
      "Strong portfolio showcasing responsive web design and UI craft.",
      "Proficient with Figma components, auto-layout, and prototyping.",
      "Eye for typography, visual hierarchy, and iconography.",
      "Ability to deliver clean, developer-ready assets."
    ],
    requiredSkills: ["Figma", "UI Design", "Visual Design", "Wireframing", "Mobile Design"],
    status: "open"
  },
  {
    title: "Senior Cloud DevOps Engineer",
    company: "SkyHigh Cloud Systems",
    location: "Bangalore, India (Remote)",
    salary: "$110,000 - $150,000",
    jobType: "Remote",
    experience: "4-7 years",
    category: "Software Development",
    description:
      "Help us scale our globally distributed cloud architecture. You will manage CI/CD pipelines, container orchestration with Kubernetes, and infrastructure-as-code deployments across AWS and Azure.",
    requirements: [
      "4+ years experience in DevOps, SRE, or Cloud Infrastructure engineering.",
      "Deep expertise with Docker, Kubernetes, Terraform, and AWS/Azure.",
      "Hands-on scripting in Python or Bash.",
      "Experience with observability stacks (Prometheus, Grafana, ELK).",
      "Strong knowledge of network security and cloud compliance."
    ],
    requiredSkills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux", "Python"],
    status: "open"
  }
];

// ─── DEMO USERS DATA ──────────────────────────────────────────────────────────
const usersData = [
  {
    name: "Admin User",
    email: "admin@jobportal.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Rajesh Kumar",       // Demo Recruiter
    email: "recruiter@jobportal.com",
    password: "recruiter123",
    role: "recruiter"
  },
  {
    name: "Alex Johnson",       // Demo Candidate
    email: "candidate@jobportal.com",
    password: "candidate123",
    role: "candidate",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    headline: "Senior Full Stack & React Developer",
    bio: "Passionate software engineer with 3+ years of experience building modern web applications.",
    skills: ["React", "JavaScript", "Node.js", "HTML5/CSS3", "Git", "REST APIs"]
  }
];

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    // Step 1: Connect to MongoDB
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected!');

    // Step 2: Clear existing data (so we can run seed multiple times safely)
    console.log('\n🧹 Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await SavedJob.deleteMany({});
    console.log('✅ Existing data cleared!');

    // Step 3: Create Users
    // We hash passwords manually here because the pre-save hook handles it
    console.log('\n👤 Creating demo users...');
    const createdUsers = await User.create(usersData);

    // Find our specific users from what was created
    const admin = createdUsers.find(u => u.role === 'admin');
    const recruiter = createdUsers.find(u => u.role === 'recruiter');
    const candidate = createdUsers.find(u => u.role === 'candidate');

    console.log('  ✅ Admin:     admin@jobportal.com     (password: admin123)');
    console.log('  ✅ Recruiter: recruiter@jobportal.com (password: recruiter123)');
    console.log('  ✅ Candidate: candidate@jobportal.com (password: candidate123)');

    // Step 4: Create all 12 Jobs
    // We add the recruiter's ID to each job (because recruiter field is required)
    console.log('\n💼 Creating 12 jobs from your website...');
    const jobsWithRecruiter = jobsData.map(job => ({
      ...job,
      recruiter: recruiter._id   // Every job is posted by our demo recruiter
    }));

    const createdJobs = await Job.create(jobsWithRecruiter);
    console.log(`  ✅ ${createdJobs.length} jobs added to database!`);

    // Step 5: Create sample Applications
    // Our demo candidate applies to 2 jobs
    console.log('\n📝 Creating sample applications...');
    await Application.create([
      {
        job: createdJobs[0]._id,       // Applied to "Senior Frontend Developer"
        candidate: candidate._id,
        status: 'Shortlisted',
        coverLetter: 'I am very interested in this position and believe my skills in React and JavaScript make me a great fit.',
        appliedDate: new Date('2026-08-24')
      },
      {
        job: createdJobs[2]._id,       // Applied to "UI/UX Product Designer"
        candidate: candidate._id,
        status: 'Under Review',
        coverLetter: 'I have strong UI/UX skills and would love to contribute to your design team.',
        appliedDate: new Date('2026-08-26')
      }
    ]);
    console.log('  ✅ 2 sample applications created!');

    // Step 6: Create sample Saved Jobs
    console.log('\n🔖 Creating sample saved jobs...');
    await SavedJob.create([
      { candidate: candidate._id, job: createdJobs[1]._id },  // Saved "Full Stack Engineer"
      { candidate: candidate._id, job: createdJobs[3]._id }   // Saved "Data Scientist"
    ]);
    console.log('  ✅ 2 sample saved jobs created!');

    // Final Summary
    console.log('\n' + '='.repeat(55));
    console.log('🎉  DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(55));
    console.log('\n📊 What was added to MongoDB:');
    console.log(`   👤 Users:        ${createdUsers.length} (admin, recruiter, candidate)`);
    console.log(`   💼 Jobs:         ${createdJobs.length} (all from your website)`);
    console.log(`   📝 Applications: 2 (sample applications)`);
    console.log(`   🔖 Saved Jobs:   2 (sample bookmarks)`);
    console.log('\n🔑 Demo Login Credentials:');
    console.log('   Role:       Email                        Password');
    console.log('   ─────────────────────────────────────────────────');
    console.log('   Admin     → admin@jobportal.com        → admin123');
    console.log('   Recruiter → recruiter@jobportal.com    → recruiter123');
    console.log('   Candidate → candidate@jobportal.com    → candidate123');
    console.log('\n🚀 Now run: npm run dev  to start your backend!');
    console.log('='.repeat(55) + '\n');

    // Close the database connection
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seed Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
