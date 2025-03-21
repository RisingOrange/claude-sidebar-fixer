// ==UserScript==
// @name         Claude Sidebar Fixer
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

    // Function to check if sidebar is currently pinned by checking the pin button's SVG path
    function isSidebarPinned() {
        const pinButton = document.querySelector('[data-testid="pin-sidebar-toggle"]');
        if (!pinButton) return false;

        // Get the SVG path inside the pin button
        const svgPath = pinButton.querySelector('svg path');
        if (!svgPath) return false;

        // The "unpinned" state SVG path starts with "M189.66"
        // The "pinned" state SVG path starts with "M232"
        const pathData = svgPath.getAttribute('d');
        return pathData && pathData.startsWith('M232');
    }

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

        // Check current pin state
        const currentlyPinned = isSidebarPinned();
        const shouldBePinned = sidebarVisible;

        // Only click the pin button if the pin state needs to change
        if (currentlyPinned !== shouldBePinned) {
            const pinButton = document.querySelector('[data-testid="pin-sidebar-toggle"]');
            if (pinButton) {
                pinButton.click();
            }
        }

        // Update toggle button appearance
        const btn = document.getElementById('manual-sidebar-toggle');
        if (btn) {
            btn.innerHTML = sidebarVisible ? '&larr;' : '&rarr;';
            btn.title = sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar';
        }
    }

    // Function to ensure the sidebar is hidden and unpinned
    function hideSidebar() {
        // Get the sidebar element
        const sidebar = document.querySelector('nav[data-testid="menu-sidebar"]');
        if (!sidebar) return;

        // Set our state to hidden
        sidebarVisible = false;

        // Apply our class to hide it
        sidebar.classList.remove('sidebar-visible');

        // Only click the pin button if currently pinned
        if (isSidebarPinned()) {
            const pinButton = document.querySelector('[data-testid="pin-sidebar-toggle"]');
            if (pinButton) {
                pinButton.click();
            }
        }

        // Update toggle button appearance
        const btn = document.getElementById('manual-sidebar-toggle');
        if (btn) {
            btn.innerHTML = '&rarr;';
            btn.title = 'Show Sidebar';
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

    // Function to ensure the sidebar is unpinned when clicking "New chat"
    function setupNewChatButton() {
        // Add click listeners to any "New chat" buttons
        const newChatButtonSelector = 'a[href="/new"]';

        // Use delegation for dynamically added elements
        document.addEventListener('click', function(e) {
            // Check if the clicked element or any of its parents match our selector
            let target = e.target;
            while (target && target !== document) {
                if (target.matches && target.matches(newChatButtonSelector)) {
                    // Hide sidebar and ensure it's unpinned
                    hideSidebar();
                    break;
                }
                target = target.parentElement;
            }
        }, true);
    }

    // Function to handle clicks on suggested/history chats
    function setupChatNavigationHandlers() {
        // This handles clicks on conversation history items and suggested chats
        document.addEventListener('click', function(e) {
            // Look for chat list items or suggested chat links
            let target = e.target;
            while (target && target !== document) {
                // Match any links that point to chat URLs but NOT new chat
                if (target.tagName === 'A' &&
                    target.href &&
                    (target.href.includes('/chat/') ||
                     target.href.includes('/c/') ||
                     target.href.includes('/explore/')) &&
                    !target.href.includes('/new')) {

                    // Ensure sidebar is hidden and layout is correct
                    hideSidebar();
                    break;
                }
                target = target.parentElement;
            }
        }, true);
    }

    // Track URL changes to handle navigation through the app
    function setupNavigationObserver() {
        // Create a MutationObserver to watch for DOM changes that might indicate navigation
        const observer = new MutationObserver((mutations) => {
            // Check if we should adjust the sidebar
            if (document.location.pathname.includes('/c/') ||
                document.location.pathname.includes('/chat/') ||
                document.location.pathname.includes('/explore/')) {

                // Small delay to let the UI update
                setTimeout(() => {
                    if (isSidebarPinned() !== sidebarVisible) {
                        hideSidebar();
                    }
                }, 100);
            }
        });

        // Start observing changes to the document body or the root element
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
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

        // Set up all our event handlers
        setupNewChatButton();
        setupChatNavigationHandlers();
        setupNavigationObserver();

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
