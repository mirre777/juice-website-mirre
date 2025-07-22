#!/bin/bash

# Quick fix script for deployment issues
echo "🚀 Fixing deployment issues..."

# Remove lockfile and node_modules
echo "🧹 Cleaning up..."
rm -f pnpm-lock.yaml
rm -rf node_modules

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
pnpm install

# Check if lockfile was created
if [ -f "pnpm-lock.yaml" ]; then
    echo "✅ New lockfile created successfully"
    echo "📝 Don't forget to commit pnpm-lock.yaml"
else
    echo "❌ Failed to create lockfile"
    exit 1
fi

echo "🎉 Ready for deployment!"
