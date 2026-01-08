# GitHub Repository Setup Guide

Follow these steps to create and push your project to GitHub.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: **`medora-health`**
4. Description: **"HealthTech Adoption & Conversion Engineering Website"**
5. Visibility: Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
# Make sure you're in the project directory
cd /Users/solo/Desktop/Medora

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Medora Health website"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/medora-health.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Go to your repository on GitHub
2. You should see all your files
3. The README.md should display on the repository homepage

## Step 4: Set Up GitHub Actions (Optional)

You can add a workflow file for automated testing/deployment:

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - run: npm run lint
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

**Option 1: Use Personal Access Token**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when pushing

**Option 2: Use SSH**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH URL:
git remote set-url origin git@github.com:YOUR_USERNAME/medora-health.git
```

### Large Files

If you have large files that shouldn't be committed:
- Check `.gitignore` includes them
- Use `git rm --cached <file>` to remove from git but keep locally

## Next Steps

After pushing to GitHub:

1. **Set up deployment** (see `DEPLOYMENT.md`)
2. **Add repository description** on GitHub
3. **Add topics/tags** for discoverability
4. **Set up branch protection** (Settings → Branches)
5. **Add collaborators** if needed (Settings → Collaborators)

## Repository Settings

Recommended settings in GitHub:

- **Settings → General → Features**
  - ✅ Issues
  - ✅ Projects
  - ✅ Wiki (optional)
  - ✅ Discussions (optional)

- **Settings → Pages** (if using GitHub Pages)
  - Source: Deploy from a branch
  - Branch: `main` / `root`

## Security

- ✅ `.env` is in `.gitignore` (never commit secrets)
- ✅ API keys should be in environment variables only
- ✅ Use GitHub Secrets for CI/CD if needed

