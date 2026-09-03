# --- Stage 1: Build frontend ---
FROM node:20-slim AS frontend
WORKDIR /app/geartree-ui

COPY geartree-ui/package*.json ./
RUN npm ci

COPY geartree-ui/ ./

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

RUN npm run build

# --- Stage 2: Build backend ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend
WORKDIR /app

COPY GearTree/ ./GearTree/
RUN dotnet publish GearTree/GearTree.csproj -c Release -o /out

# Copy frontend build into wwwroot
COPY --from=frontend /app/geartree-ui/dist/ /out/wwwroot/

# --- Stage 3: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=backend /out ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "GearTree.dll"]
