# Deploying Fuel Entry Portal to Vercel

This guide will help you deploy your application to Vercel, a popular platform for hosting frontend applications.

## Prerequisites

*   A [Vercel account](https://vercel.com/signup).
*   Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket) **OR** Vercel CLI installed locally.

## Option 1: Deploy via GitHub (Recommended)

1.  **Push your code** to a GitHub repository.
2.  Log in to your **Vercel Dashboard**.
3.  Click **"Add New..."** -> **"Project"**.
4.  **Import** your `fuel-entries` repository.
5.  Vercel will automatically detect that it's a **Vite** project.
6.  **Build Command:** `npm run build` (or `vite build`) - Vercel usually detects this.
7.  **Output Directory:** `dist` - Vercel usually detects this.
8.  Click **"Deploy"**.

## Option 2: Deploy via Vercel CLI

1.  Open your terminal in the project folder: `d:\DEVELOPMENT REPORTS\fuel entries`
2.  Install Vercel CLI (if not installed):
    ```bash
    npm i -g vercel
    ```
3.  Run the deploy command:
    ```bash
    vercel
    ```
4.  Follow the prompts:
    *   Set up and deploy? **Y**
    *   Which scope? (Select your account)
    *   Link to existing project? **N**
    *   Project name? (Press Enter for default)
    *   In which directory is your code located? (Press Enter for `./`)
    *   Want to modify these settings? **N** (Auto-detection works great for Vite)

## Important Note on Environment Variables

If you used any `.env` files (e.g., for Firebase or Google Sheets URL), you need to add them to Vercel:

1.  Go to your Project Settings on Vercel.
2.  Click **"Environment Variables"**.
3.  Add your variables (e.g., `VITE_GOOGLE_WEB_APP_URL` if you used one, though currently it's hardcoded in `googleSheets.ts`).

## Verifying Deployment

Once deployed, Vercel will give you a URL (e.g., `https://fuel-entries.vercel.app`). Open it on your phone to test the mobile view!
