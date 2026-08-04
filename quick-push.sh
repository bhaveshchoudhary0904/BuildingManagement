#!/bin/bash

echo "================================"
echo "Auto Git Commit and Push Script"
echo "================================"
echo ""

# Change to script directory
cd "$(dirname "$0")"

echo "Adding all changes..."
git add -A
if [ $? -ne 0 ]; then
    echo "Error adding files"
    exit 1
fi

echo ""
echo "Committing changes..."
read -p "Enter commit message (or press Enter for auto-message): " message
if [ -z "$message" ]; then
    message="Auto-update: $(date)"
fi
git commit -m "$message"
if [ $? -ne 0 ]; then
    echo "No changes to commit"
    exit 0
fi

echo ""
echo "Pushing to GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    echo "Error pushing to GitHub"
    exit 1
fi

echo ""
echo "================================"
echo "Successfully pushed to GitHub!"
echo "================================"