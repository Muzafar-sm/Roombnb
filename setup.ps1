# Create backend directory and initialize
New-Item -ItemType Directory -Force -Path backend
Set-Location backend
npm init -y

# Install backend dependencies
npm install express cors dotenv mongoose bcryptjs jsonwebtoken
npm install --save-dev typescript ts-node-dev @types/express @types/cors @types/node @types/bcryptjs @types/jsonwebtoken

# Create frontend
Set-Location ..
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

Write-Host "Project setup completed successfully!" 