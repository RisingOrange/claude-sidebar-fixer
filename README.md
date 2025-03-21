# Claude Sidebar Fixer

A userscript that fixes Claude AI's sidebar behavior by hiding it by default and adding a toggle button in the top-left corner - similar to ChatGPT's sidebar behavior.

## The Problem

Claude's default sidebar behavior can be frustrating:
- The sidebar opens automatically when hovering over the left edge of the screen
- This is especially annoying when moving your cursor from the browser to another window positioned to the left

## The Solution

This userscript:
1. Completely hides the sidebar by default (no hover activation)
2. Adds a small toggle button in the top-left corner
3. Clicking the button shows/hides the sidebar and activates Claude's built-in pinning mechanism

## Features

- 🚫 **No Hover Activation**: Sidebar stays hidden until explicitly toggled
- 👆 **Simple Toggle**: One click to show/hide the sidebar
- 📌 **Uses Native Pinning**: Leverages Claude's built-in sidebar pinning mechanism
- 🔄 **State Indicators**: Button shows left/right arrows based on current state
- 🎨 **Clean Design**: Minimal, non-intrusive toggle button
- 📱 **More Screen Space**: Maximizes content area by default (especially helpful on smaller screens)

## Installation

1. Install a userscript manager extension:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari, Opera)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Install the script:
   - Click on the userscript manager icon in your browser
   - Select "Create a new script" or "Add a new script"
   - Copy and paste the entire script from `claude-sidebar-fixer.user.js`
   - Save the script

Alternatively, if viewing this on GitHub:
- Click on the `claude-sidebar-fixer.user.js` file in the repository
- Click the "Raw" button
- Your userscript manager should detect the script and prompt you to install it

## Usage

1. Visit Claude AI (claude.ai or anthropic.com)
2. The sidebar will be hidden by default
3. Click the arrow button (→) in the top-left corner to show the sidebar
4. Click the arrow button (←) again to hide the sidebar
