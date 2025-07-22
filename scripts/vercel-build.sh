#!/bin/bash

# Custom build script for Vercel that handles pnpm lockfile issues
set -e

echo "🔧 Starting Vercel build with lockfile handling..."

# Check if pnpm is available, if not use npm
if command -v pnpm &> /dev/null; then
    echo "📦 Using pnpm..."
    
    # Remove lockfile if it's out of sync
    if [ -f "pnpm-lock.yaml" ] && [ -f "package.json" ]; then
        echo "🔍 Checking lockfile sync..."
        if ! pnpm install --frozen-lockfile --dry-run &> /dev/null; then
            echo "⚠️  Lockfile out of sync, regenerating..."
            rm -f pnpm-lock.yaml
            pnpm install
        else
            echo "✅ Lockfile is in sync"
            pnpm install --frozen-lockfile
        fi
    else
        pnpm install
    fi
    
    echo "🏗️  Building with pnpm..."
    pnpm run build
else
    echo "📦 pnpm not found, using npm..."
    
    # Clean install with npm
    if [ -f "pnpm-lock.yaml" ]; then
        echo "🗑️  Removing pnpm-lock.yaml..."
        rm -f pnpm-lock.yaml
    fi
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    echo "🏗️  Building with npm..."
    npm run build
fi

echo "✅ Build completed successfully!"
