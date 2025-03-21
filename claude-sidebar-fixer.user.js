// ==UserScript==
// @name         Claude Sidebar Controller
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides Claude's sidebar by default and adds a toggle button in the top-left corner
// @author       Claude User
// @match        https://*.claude.ai/*
// @match        https://claude.ai/*
// @match        https://*.anthropic.com/chat/*
// @match        https://console.anthropic.com/chat/*
// @grant        GM_addStyle
// @run-at       document-start
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS that hides the sidebar by default but shows it when our custom class is present
    GM_addStyle(`
        /* Hide sidebar by default */
        nav[data-testid="menu-sidebar"] {
            transform: translateX(-500%) !important;
            transition: transform 0.3s ease !important;
        }

        /* When our class is added, show the sidebar */
        nav[data-testid="menu-sidebar"].sidebar-visible {
            transform: translateX(0%) !important;
        }

        /* Toggle button styling */
        #manual-sidebar-toggle {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            width: 40px;
            height: 40px;
            border-radius: 6px;
            background: rgba(60, 60, 60, 0.8);
            color: white;
            border: none;
            font-size: 22px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            pointer-events: all !important;
        }

        #manual-sidebar-toggle:hover {
            background: rgba(80, 80, 80, 0.9);
        }
    `);

    // Track sidebar visibility state
    let sidebarVisible = false;

    // Function to toggle sidebar visibility
    function toggleSidebar() {
        // Get the sidebar element
        const sidebar = document.querySelector('nav[data-testid="menu-sidebar"]');
        if (!sidebar) return;

        // Toggle our state
        sidebarVisible = !sidebarVisible;

        // Apply our class to control visibility
        if (sidebarVisible) {
            sidebar.classList.add('sidebar-visible');
        } else {
            sidebar.classList.remove('sidebar-visible');
        }

        // Always click Claude's pin button when we toggle our sidebar
        const pinButton = document.querySelector('[data-testid="pin-sidebar-toggle"]');
        if (pinButton) {
            // Directly click the pin button every time
            pinButton.click();
        }

        // Update toggle button appearance
        const btn = document.getElementById('manual-sidebar-toggle');
        if (btn) {
            btn.innerHTML = sidebarVisible ? '&larr;' : '&rarr;';
            btn.title = sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar';
        }
    }

    // Function to create the toggle button
    function createToggleButton() {
        // Remove existing button if present
        const existingBtn = document.getElementById('manual-sidebar-toggle');
        if (existingBtn) existingBtn.remove();

        // Create new button
        const btn = document.createElement('button');
        btn.id = 'manual-sidebar-toggle';
        btn.innerHTML = '&rarr;';
        btn.title = 'Show Sidebar';
        btn.addEventListener('click', toggleSidebar);

        // Add to document
        document.body.appendChild(btn);
        return btn;
    }

    // Function to initialize everything
    function initialize() {
        const btn = createToggleButton();

        // Check initial state and update our class if needed
        const sidebar = document.querySelector('nav[data-testid="menu-sidebar"]');
        if (sidebar) {
            // Initially hide sidebar
            sidebar.classList.remove('sidebar-visible');
            sidebarVisible = false;
        }

        // Set up observer to ensure our button persists
        const observer = new MutationObserver(() => {
            if (!document.getElementById('manual-sidebar-toggle')) {
                createToggleButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1000));
    } else {
        setTimeout(initialize, 1000);
    }
})();
