# CarbonLedger UserApp

The CarbonLedger UserApp is a frontend application for managing and visualizing carbon emissions data. Built using modern web development tools like Vue.js, Vite, and Tailwind CSS, this application delivers a seamless and responsive user experience.

Features
	•	User Authentication: Secure login and account management.
	•	Dashboard: Overview of carbon footprint metrics and trends.
	•	Energy Usage Tracking: Visualize and track energy consumption over time.
	•	Settings Management: Customize application preferences.
	•	Privacy First: Transparent policies with the Privacy Policy and Terms of Service views.
	•	Fast Deployment: Optimized build pipeline using Vite and Cloudflare Workers.

Technology Stack
	•	Framework: Vue.js
	•	Build Tool: Vite
	•	CSS Framework: Tailwind CSS
	•	Backend Integration: Cloudflare Workers
	•	Language: TypeScript
	•	Deployment: Cloudflare Pages

Getting Started

Prerequisites
	•	Node.js (v16 or later)
	•	Yarn (preferred) or npm
	•	Wrangler CLI for Cloudflare deployments
	•	Git for version control

Installation
	1.	Clone the repository:

git clone git@github.com:iolloyd/carbonledger-userapp.git
cd carbonledger-userapp


	2.	Install dependencies:

yarn install


	3.	Set up environment variables:
Create a .env file in the root directory with the required variables. Use .env.example as a template if available.

Development

Run the application locally:

yarn dev

Access the app at http://localhost:3000.

Building for Production

Build the application for production:

yarn build

The output will be available in the dist/ directory.

Deployment

Deploy the app using Cloudflare Workers:
	1.	Configure wrangler.toml with your Worker settings.
	2.	Deploy using Wrangler:

wrangler deploy


## Directory Structure

carbonledger-userapp/
├── dist/                   # Build output
├── src/                    # Source files
│   ├── components/         # Reusable Vue components
│   ├── views/              # Application views (e.g., Dashboard, Settings)
│   ├── assets/             # Static assets (images, icons)
│   └── App.vue             # Root Vue component
├── public/                 # Static files (served as-is)
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
├── deploy.sh               # Deployment script
└── README.md               # Project documentation

## Contributing
	1.	Fork the repository.
	2.	Create a feature branch:

git checkout -b feature/your-feature


	3.	Commit your changes:

git commit -m "Add your message here"


	4.	Push your branch and submit a Pull Request.

License

This project is licensed under the MIT License.
