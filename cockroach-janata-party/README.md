# 🪳 Cockroach Janata Party
### *Survive. Thrive. Multiply.*
> **College Assignment** — Full CI/CD Pipeline using GitHub + AWS (CodePipeline + CodeBuild + Elastic Beanstalk)

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Architecture Diagram](#3-architecture-diagram)
4. [AWS Deployment Steps](#4-aws-deployment-steps)
5. [GitHub Setup](#5-github-setup)
6. [CI/CD Pipeline Setup](#6-cicd-pipeline-setup)
7. [Git Commands](#7-git-commands)
8. [Viva Questions & Answers](#8-viva-questions--answers)
9. [Report Content](#9-report-content)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

| Field | Details |
|-------|---------|
| **Project Name** | Cockroach Janata Party Website |
| **Type** | Political Satire Blog (Static + Node.js server) |
| **Purpose** | Demonstrate a complete CI/CD pipeline on AWS |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js + Express (serves static files) |
| **Hosting** | AWS Elastic Beanstalk |
| **CI/CD** | GitHub → CodePipeline → CodeBuild → Elastic Beanstalk |
| **Version Control** | GitHub |

### What this project demonstrates:
- ✅ Responsive website with dark theme and animations
- ✅ Automated CI/CD pipeline — push to GitHub → live on AWS automatically
- ✅ AWS CodeBuild compiles and tests the project
- ✅ AWS CodePipeline orchestrates the entire workflow
- ✅ AWS Elastic Beanstalk hosts the Node.js app

---

## 2. Folder Structure

```
cockroach-janata-party/
│
├── index.html          ← Main website (all sections)
├── style.css           ← All styling (dark theme, animations)
├── script.js           ← Interactivity (countdown, counters, form)
├── server.js           ← Express server (required for Elastic Beanstalk)
├── package.json        ← Node.js project config + dependencies
├── buildspec.yml       ← AWS CodeBuild instructions
├── .gitignore          ← Files Git should NOT track
└── README.md           ← This file
```

---

## 3. Architecture Diagram

```
DEVELOPER (You)
      │
      │  git push
      ▼
┌─────────────┐
│   GitHub    │  ← Your code lives here
│ Repository  │
└──────┬──────┘
       │  Webhook triggers automatically
       ▼
┌─────────────────┐
│  AWS            │
│  CodePipeline   │  ← The "conductor" — manages the whole flow
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  AWS            │
│  CodeBuild      │  ← Reads buildspec.yml, runs npm install & npm test
└──────┬──────────┘
       │  If build passes ✅
       ▼
┌──────────────────────┐
│  AWS                 │
│  Elastic Beanstalk   │  ← Deploys your Node.js app automatically
└──────┬───────────────┘
       │
       ▼
┌─────────────────┐
│  Live Website   │  ← Accessible via public URL
│  🪳 CJP Online  │     e.g., http://cjp.ap-south-1.elasticbeanstalk.com
└─────────────────┘
```

**Simple explanation:**
> You write code → push to GitHub → CodePipeline detects the change → CodeBuild tests the code → Elastic Beanstalk deploys it → website updates automatically!

---

## 4. AWS Deployment Steps

### STEP 4.1 — Create AWS Account
1. Go to **https://aws.amazon.com**
2. Click **"Create an AWS Account"**
3. Fill in email, password, and account name
4. Enter credit card (you won't be charged if you stay in Free Tier)
5. Choose **"Basic Support (Free)"**
6. Sign in to **AWS Console**

> 💡 **Tip:** Always select region **"Asia Pacific (Mumbai) ap-south-1"** in the top-right dropdown for best performance in India.

---

### STEP 4.2 — Create Elastic Beanstalk Application

Elastic Beanstalk is like a smart hosting service — you give it your code and it handles servers, load balancers, and deployment automatically.

1. In AWS Console search bar, type **"Elastic Beanstalk"** and click it
2. Click **"Create Application"**
3. Fill in:
   - **Application name:** `cockroach-janata-party`
   - **Platform:** Node.js
   - **Platform branch:** Node.js 18 running on 64bit Amazon Linux 2023
   - **Platform version:** (leave as recommended)
4. Under **"Application code"**:
   - Select **"Sample application"** (we'll replace this via CodePipeline later)
5. Under **"Presets"**, select **"Single instance (Free Tier eligible)"**
6. Click **"Next"**

**Configure Service Access:**
- Select **"Create and use new service role"**
- Service role name: `aws-elasticbeanstalk-service-role`
- EC2 instance profile: If there's a dropdown, select `aws-elasticbeanstalk-ec2-role`
  - If it doesn't exist, click **"View permission details"** → create it (see Step 4.3 below)

7. Click **"Skip to Review"** → **"Submit"**
8. Wait 3–5 minutes for environment to launch (status: **Green ✅**)
9. Note the **Environment URL** shown (e.g., `http://cockroachjanataparty.ap-south-1.elasticbeanstalk.com`)

---

### STEP 4.3 — Create EC2 IAM Role (if needed)

If Elastic Beanstalk asks for an EC2 instance profile:

1. Open a **new browser tab** → go to AWS Console
2. Search for **"IAM"** → click it
3. In left sidebar, click **"Roles"**
4. Click **"Create role"**
5. **Trusted entity type:** AWS service
6. **Use case:** EC2
7. Click **"Next"**
8. Search and select these policies (tick the checkboxes):
   - `AWSElasticBeanstalkWebTier`
   - `AWSElasticBeanstalkWorkerTier`
   - `AWSElasticBeanstalkMulticontainerDocker`
9. Click **"Next"**
10. **Role name:** `aws-elasticbeanstalk-ec2-role`
11. Click **"Create role"**
12. Go back to Elastic Beanstalk tab and select this role

---

### STEP 4.4 — Create S3 Bucket for Artifacts

CodePipeline needs an S3 bucket to store build artifacts between stages.

1. In AWS Console, search **"S3"** → click it
2. Click **"Create bucket"**
3. Fill in:
   - **Bucket name:** `cjp-pipeline-artifacts-[your-name]` (must be globally unique, e.g., `cjp-pipeline-artifacts-abc123`)
   - **Region:** Asia Pacific (Mumbai) ap-south-1
4. **Block all public access:** Keep all 4 checkboxes TICKED ✅ (good for security)
5. **Versioning:** Enable
6. Click **"Create bucket"**

---

## 5. GitHub Setup

### STEP 5.1 — Create GitHub Account
1. Go to **https://github.com**
2. Click **"Sign Up"**
3. Follow the steps (verify email)

### STEP 5.2 — Create New Repository
1. Click the **"+"** icon (top right) → **"New repository"**
2. Fill in:
   - **Repository name:** `cockroach-janata-party`
   - **Description:** `CJP - Political Satire Blog with AWS CI/CD Pipeline`
   - **Visibility:** Public (or Private — both work)
   - **DO NOT** initialize with README (we already have one)
3. Click **"Create repository"**
4. **Copy the repository URL** shown (looks like: `https://github.com/yourusername/cockroach-janata-party.git`)

---

## 6. CI/CD Pipeline Setup

### STEP 6.1 — Connect GitHub to AWS (CodeStar Connection)

1. In AWS Console, search **"CodePipeline"** → click it
2. Click **"Create pipeline"**
3. Fill in:
   - **Pipeline name:** `cjp-cicd-pipeline`
   - **Pipeline type:** V2
   - **Execution mode:** Superseded
   - **Service role:** New service role (auto-fills name)
   - **Artifact store:** Custom location → select the S3 bucket you created
4. Click **"Next"**

**Source Stage:**
5. **Source provider:** GitHub (Version 2)
6. Click **"Connect to GitHub"**
   - A popup appears → click **"Install a new app"**
   - Authorize AWS Connector on your GitHub account
   - Select your repository → click **"Connect"**
7. **Repository name:** select `cockroach-janata-party`
8. **Branch name:** `main`
9. **Output artifact format:** CodePipeline default
10. Click **"Next"**

---

### STEP 6.2 — Configure CodeBuild Stage

1. **Build provider:** AWS CodeBuild
2. **Region:** Asia Pacific (Mumbai)
3. Click **"Create project"** (opens a popup)

In the CodeBuild popup:
- **Project name:** `cjp-build`
- **Environment image:** Managed image
- **Operating system:** Amazon Linux
- **Runtime:** Standard
- **Image:** aws/codebuild/amazonlinux2-x86_64-standard:5.0
- **Service role:** New service role (auto-fills)
- **Buildspec:** Use a buildspec file (CodeBuild will find `buildspec.yml` in your repo)
- Click **"Continue to CodePipeline"**

4. Back in pipeline wizard, click **"Next"**

---

### STEP 6.3 — Configure Deploy Stage

1. **Deploy provider:** AWS Elastic Beanstalk
2. **Region:** Asia Pacific (Mumbai)
3. **Application name:** `cockroach-janata-party` (select from dropdown)
4. **Environment name:** select the environment you created
5. Click **"Next"**
6. Review everything → click **"Create pipeline"**

🎉 **Your pipeline is now created!**

The first run starts automatically. Watch the pipeline stages:
- **Source** → fetches code from GitHub ✅
- **Build** → runs CodeBuild (npm install, npm test) ✅
- **Deploy** → pushes to Elastic Beanstalk ✅

After ~5 minutes, visit your Elastic Beanstalk URL — your website is LIVE!

---

## 7. Git Commands

Open your terminal (Command Prompt / Git Bash / Terminal). Run these commands one by one:

```bash
# STEP 1: Check if Git is installed
git --version
# Expected output: git version 2.x.x
# If not installed: download from https://git-scm.com

# STEP 2: Configure Git (only needed once)
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"

# STEP 3: Navigate to your project folder
# (Change the path to where you saved your project)
cd path/to/cockroach-janata-party

# STEP 4: Initialize a Git repository
git init

# STEP 5: Connect to your GitHub repository
# (Replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cockroach-janata-party.git

# STEP 6: Check which files will be added
git status

# STEP 7: Stage all files for commit
git add .

# STEP 8: Commit with a message
git commit -m "Initial commit: Cockroach Janata Party website with CI/CD config"

# STEP 9: Rename branch to 'main' (modern standard)
git branch -M main

# STEP 10: Push to GitHub
git push -u origin main
# (It will ask for GitHub username and password/token)
```

**For future changes:**
```bash
# After editing any file, run:
git add .
git commit -m "Update: describe what you changed"
git push

# CodePipeline will AUTOMATICALLY detect this push
# and re-deploy your updated website!
```

**Useful Git commands to know:**
```bash
git status           # See what files have changed
git log --oneline    # See commit history
git diff             # See exact changes in files
git pull             # Fetch latest changes from GitHub
git branch           # List all branches
```

---

## 8. Viva Questions & Answers

### DevOps & CI/CD

**Q1. What is DevOps?**
> DevOps is a set of practices that combines software **Dev**elopment and IT **Op**erations. The goal is to shorten the software development lifecycle and deliver software continuously with high quality. It promotes automation, collaboration, and monitoring throughout the development process.

**Q2. What is CI/CD? Explain the difference between CI and CD.**
> - **CI (Continuous Integration):** Developers frequently merge code into a shared repository. Each merge triggers an automated build and test process. This catches bugs early.
> - **CD (Continuous Delivery):** After CI, the code is automatically prepared and validated for release to production. The release still requires a manual approval.
> - **CD (Continuous Deployment):** Goes one step further — every change that passes tests is automatically deployed to production with NO manual step.
> In this project: GitHub push → CodeBuild (CI) → Elastic Beanstalk (CD).

**Q3. What is a CI/CD pipeline?**
> A CI/CD pipeline is an automated sequence of steps that takes code from a developer's machine to production. It typically includes: Source → Build → Test → Deploy stages. In our project: GitHub → CodePipeline → CodeBuild → Elastic Beanstalk.

**Q4. What are the benefits of CI/CD?**
> - **Faster releases:** Deploy multiple times a day instead of monthly
> - **Early bug detection:** Tests run automatically on every commit
> - **Reduced manual effort:** No one needs to manually build or deploy
> - **Consistency:** Every deployment follows the same automated process
> - **Rollback ability:** Easy to go back to a previous working version

**Q5. What is the difference between Continuous Delivery and Continuous Deployment?**
> Continuous Delivery stops just before production — a human must click "deploy." Continuous Deployment goes all the way to production automatically. Our AWS CodePipeline setup is Continuous Deployment since it deploys to Elastic Beanstalk without human intervention.

---

### AWS Services

**Q6. What is AWS?**
> Amazon Web Services (AWS) is a cloud computing platform by Amazon. It offers 200+ services including computing (EC2), storage (S3), databases (RDS), and developer tools (CodePipeline, CodeBuild). You pay only for what you use ("pay-as-you-go").

**Q7. What is AWS CodePipeline?**
> AWS CodePipeline is a fully managed Continuous Delivery service. It automates the build, test, and deploy phases whenever code changes. Think of it as the "orchestrator" or "conductor" — it connects GitHub, CodeBuild, and Elastic Beanstalk together into a workflow.

**Q8. What is AWS CodeBuild?**
> AWS CodeBuild is a fully managed build service. It compiles source code, runs tests, and produces deployment-ready artifacts. It reads the `buildspec.yml` file to know what commands to run. You don't need to manage any build servers — AWS handles all of that.

**Q9. What is AWS Elastic Beanstalk?**
> AWS Elastic Beanstalk is a Platform-as-a-Service (PaaS) that makes it easy to deploy and scale web applications. You upload your code and Elastic Beanstalk automatically handles: EC2 instances, load balancing, auto-scaling, and health monitoring. Supported platforms include Node.js, Python, Java, PHP, Ruby, and more.

**Q10. What is the difference between IaaS, PaaS, and SaaS?**
> - **IaaS (Infrastructure as a Service):** You get virtual machines, storage, networking. You manage OS and software. Example: AWS EC2.
> - **PaaS (Platform as a Service):** You get a platform to run your app. The cloud manages OS, runtime, scaling. Example: **AWS Elastic Beanstalk**.
> - **SaaS (Software as a Service):** A complete application available over the internet. Example: Gmail, Salesforce.

---

### GitHub & Version Control

**Q11. What is Git? How is it different from GitHub?**
> **Git** is a version control system — software installed on your computer that tracks changes to files. **GitHub** is a cloud platform that hosts Git repositories online, enabling collaboration and serving as the "source of truth" for your code. Git is the tool; GitHub is the hosting service.

**Q12. What is a Git branch? Why do we use branches?**
> A branch is an independent copy of the codebase where you can make changes without affecting the main code. We use branches to develop features, fix bugs, or experiment — then merge them back into `main` when ready. This prevents broken code from reaching production.

**Q13. What is `git push` vs `git pull`?**
> - `git push`: Uploads your local commits to the remote repository (GitHub)
> - `git pull`: Downloads the latest changes from GitHub to your local machine
> Rule of thumb: `pull` before you start working, `push` after you're done.

**Q14. What does `git commit` do?**
> `git commit` saves a snapshot of your staged changes to the local repository with a message describing what changed. It's like creating a save point in a video game. Commits build up a history of your project that you can always go back to.

---

### Technical Questions

**Q15. What is `buildspec.yml`? What are its main sections?**
> `buildspec.yml` is a YAML file that tells AWS CodeBuild exactly what to do during a build. Main sections:
> - `install`: Install runtimes (e.g., Node.js 18) and run `npm install`
> - `pre_build`: Commands to run before the build (version checks, etc.)
> - `build`: Main build commands (run tests, compile code)
> - `post_build`: Commands after the build (packaging, notifications)
> - `artifacts`: Files to pass on to the next stage (deploy stage)

**Q16. What is `package.json` in a Node.js project?**
> `package.json` is the manifest file for a Node.js project. It contains:
> - Project name, version, description
> - `scripts`: Shortcuts for commands (e.g., `npm start` runs `node server.js`)
> - `dependencies`: Packages needed to run the app (e.g., express)
> - `devDependencies`: Packages only needed during development (e.g., nodemon)
> - `engines`: Specifies which Node.js version to use

**Q17. Why do we use `express` in this project?**
> AWS Elastic Beanstalk runs Node.js apps — it expects a server process listening on a PORT. A plain HTML file can't "listen" on a port. So we use Express (a Node.js web framework) to create a simple server that: (1) serves our static files, and (2) listens on `process.env.PORT` which Elastic Beanstalk provides.

**Q18. What is an S3 bucket used for in the pipeline?**
> S3 (Simple Storage Service) acts as an artifact store between pipeline stages. After CodeBuild finishes, it zips up the built files and stores them in S3. Then Elastic Beanstalk picks them up from S3 to deploy. It's the "handoff" storage between CI and CD.

**Q19. What is IAM in AWS?**
> IAM (Identity and Access Management) controls WHO can do WHAT in AWS. We create IAM roles for:
> - CodePipeline: permission to trigger CodeBuild and deploy to Elastic Beanstalk
> - CodeBuild: permission to access S3 and logs
> - EC2 (Elastic Beanstalk): permission for the server to access other AWS services
> Without the right IAM roles, services can't communicate with each other.

**Q20. What happens if you push broken code to GitHub?**
> With CI/CD: CodeBuild runs `npm test`. If tests fail, CodeBuild marks the build as FAILED. CodePipeline stops — it does NOT deploy the broken code to Elastic Beanstalk. The current working version remains live. You get notified of the failure, fix the code, push again, and the pipeline retries automatically. This is the key safety benefit of CI/CD!

---

## 9. Report Content

### Introduction
The Cockroach Janata Party project is a full-stack web development and cloud deployment assignment that demonstrates the implementation of a complete CI/CD (Continuous Integration and Continuous Deployment) pipeline using industry-standard tools and services. The project consists of a satirical political blog website built with HTML, CSS, and JavaScript, served via a Node.js/Express server, and deployed automatically to AWS using GitHub, CodePipeline, CodeBuild, and Elastic Beanstalk.

### Objective
The primary objectives of this project are:
1. To design and develop a responsive, modern web application
2. To understand and implement the concept of DevOps and CI/CD pipelines
3. To gain hands-on experience with AWS cloud services
4. To automate the software delivery lifecycle from code commit to live deployment
5. To understand version control using Git and GitHub

### Methodology
The project followed an agile development approach:
1. **Planning:** Defined website structure, sections, and technology stack
2. **Development:** Built the frontend (HTML/CSS/JS) and backend (Node.js server) locally
3. **Version Control:** Initialized Git repository, committed code, pushed to GitHub
4. **Infrastructure Setup:** Created AWS Elastic Beanstalk environment and S3 bucket
5. **Pipeline Creation:** Configured CodePipeline connecting GitHub → CodeBuild → Elastic Beanstalk
6. **Testing:** Verified automated deployment by making a small code change and pushing
7. **Documentation:** Prepared README, architecture diagram, and this report

### Tools Used

| Tool | Category | Purpose |
|------|----------|---------|
| HTML5, CSS3, JavaScript | Frontend | Website structure, styling, interactivity |
| Node.js + Express | Backend | HTTP server for Elastic Beanstalk |
| Git | Version Control | Local code tracking |
| GitHub | Source Code Management | Remote repository hosting |
| AWS CodePipeline | CI/CD Orchestration | Automates the complete pipeline |
| AWS CodeBuild | Build Service | Installs dependencies, runs tests |
| AWS Elastic Beanstalk | Deployment Platform | Hosts and serves the Node.js application |
| AWS S3 | Artifact Storage | Stores build artifacts between stages |
| AWS IAM | Security | Manages permissions between AWS services |

### Advantages of CI/CD
1. **Speed:** Deploying takes seconds after a push, not hours of manual work
2. **Reliability:** Automated tests catch bugs before they reach production
3. **Consistency:** Every deployment follows the exact same process — no human error
4. **Collaboration:** Multiple developers can push code; the pipeline handles integration
5. **Rollback:** Previous working versions are preserved for easy rollback
6. **Visibility:** Pipeline dashboard shows exactly which stage passed or failed and why

### Conclusion
This project successfully demonstrates the implementation of a modern DevOps workflow using AWS cloud services. By building the Cockroach Janata Party website, we have gained practical experience in frontend web development, server-side Node.js programming, cloud deployment on AWS Elastic Beanstalk, and — most importantly — the design and implementation of an automated CI/CD pipeline.

The pipeline ensures that any code change pushed to the GitHub repository is automatically built, tested, and deployed to the live website without any manual intervention. This mirrors real-world professional software development practices used by companies worldwide. The project reinforces that DevOps is not just a set of tools, but a culture of collaboration, automation, and continuous improvement.

---

## 10. Troubleshooting

### ❌ Problem: `git push` asks for username/password but fails
**Solution:** GitHub no longer accepts passwords. Use a Personal Access Token:
1. GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token → select `repo` scope → copy the token
3. Use this token as the password when Git asks

### ❌ Problem: Elastic Beanstalk environment shows "Red" (degraded)
**Solution:**
1. Click on the environment → click **"Logs"** → **"Request last 100 lines"**
2. Look for the error (usually: wrong Node.js version, or app crashed)
3. Common fix: Make sure `package.json` has `"start": "node server.js"` in scripts
4. Make sure `server.js` uses `process.env.PORT || 8080` (not a hardcoded port)

### ❌ Problem: CodeBuild fails with "npm install: command not found"
**Solution:** Check your `buildspec.yml` — make sure `runtime-versions: nodejs: 18` is present under the `install` phase.

### ❌ Problem: CodePipeline shows "GitHub connection failed"
**Solution:**
1. Go to CodePipeline → Settings → Connections
2. Find your GitHub connection → click **"Update pending connection"**
3. Re-authorize GitHub in the popup

### ❌ Problem: "Access Denied" error during pipeline execution
**Solution:** The IAM role for CodePipeline or CodeBuild doesn't have enough permissions.
1. Go to IAM → Roles
2. Find the CodePipeline service role (named like `AWSCodePipelineServiceRole-...`)
3. Click **"Add permissions"** → **"Attach policies"**
4. Add: `AWSCodeBuildAdminAccess`, `AWSElasticBeanstalkFullAccess`, `AmazonS3FullAccess`

### ❌ Problem: Website loads but CSS/JS not working
**Solution:** This usually means the static files aren't being served. Check `server.js`:
```javascript
app.use(express.static(path.join(__dirname)));
```
This line must be present to serve CSS and JS files.

### ❌ Problem: Port error — "App crashed, port already in use"
**Solution:** Elastic Beanstalk assigns a port via environment variable. Change `server.js`:
```javascript
const PORT = process.env.PORT || 8080;  // Always use this pattern
```

---

## Screenshots Placeholder

> Add screenshots of:
> - [ ] Live website (Home page)
> - [ ] AWS CodePipeline — all stages green ✅
> - [ ] AWS CodeBuild — successful build logs
> - [ ] AWS Elastic Beanstalk — environment health: OK (Green)
> - [ ] GitHub repository with all files
> - [ ] Pipeline triggered after a `git push`

---

## Learning Outcomes

After completing this project, students will be able to:
- ✅ Build a responsive website using HTML, CSS, and JavaScript
- ✅ Create and manage a Node.js server with Express
- ✅ Use Git for version control (init, add, commit, push)
- ✅ Host code on GitHub and manage repositories
- ✅ Create and configure AWS Elastic Beanstalk environments
- ✅ Write a valid `buildspec.yml` for AWS CodeBuild
- ✅ Set up an end-to-end CI/CD pipeline with AWS CodePipeline
- ✅ Understand DevOps principles and their real-world application
- ✅ Troubleshoot common AWS deployment issues

---

*🪳 Built with cockroach-level resilience | Cockroach Janata Party | For Educational Purposes Only*
