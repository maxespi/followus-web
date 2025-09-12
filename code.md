# 1. Crear proyecto
npm create vite@latest trackminero-web -- --template react-ts
cd trackminero-web

# 2. Instalar dependencias
npm install
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Git y GitHub
git init
git add .
git commit -m "Initial commit: followus-web application setup"
git remote add origin https://github.com/maxespi/followus-web.git
git branch -M main
git push -u origin main

# 4. Ejecutar localmente
npm run dev
