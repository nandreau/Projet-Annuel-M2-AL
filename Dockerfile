# ── STAGE 1: install backend dependencies ────────────────────────────────
FROM node:22 AS backend-deps
WORKDIR /app/backend
COPY Backend/package.json Backend/package-lock.json* ./
RUN npm install --production

# ── STAGE 2: build frontend with a fixed output path ────────────────────
FROM node:22 AS frontend-build
WORKDIR /app/frontend

# 1) Install deps
COPY Frontend/easy-planner/package.json Frontend/easy-planner/package-lock.json* ./
RUN npm install

# 2) Copy source
COPY Frontend/easy-planner .

# 3) Build, forcing the output into dist/ (no nested subfolder)
RUN npm run build -- --output-path=dist

# ── STAGE 3: final image ─────────────────────────────────────────────────
FROM node:22 AS runtime
WORKDIR /app

# 1) Bring in your API
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY Backend ./backend

# 2) Install a static server for Angular
RUN npm install -g serve

# 3) Copy the Angular build from dist/
COPY --from=frontend-build /app/frontend/dist ./frontend

# 4) Expose the ports your services use
EXPOSE 8080 4200

# 5) Start both API (on 8080) and UI (on 4200)
CMD ["sh", "-c", "node backend/server.js & serve -s frontend -l 4200"]