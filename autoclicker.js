/**
 * Cookie Clicker Custom Autoclicker with Key-Sequence Activation
 * Sequence: Type "cookie" to show/hide the menu.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TARGET_SEQUENCE = ['c', 'o', 'o', 'k', 'i', 'e']; // Type 'cookie' to toggle GUI
  const DEFAULT_SPEED_MS = 10;                           // Default click interval (10ms = ~100 cps)
  
  // --- State Variables ---
  let keyBuffer = [];
  let guiElement = null;
  let clickIntervalId = null;
  let clickSpeedMs = DEFAULT_SPEED_MS;

  // --- Key Sequence Listener ---
  window.addEventListener('keydown', (event) => {
    // Prevent trigger while typing in text inputs or textareas
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    keyBuffer.push(event.key.toLowerCase());

    // Maintain buffer window size
    if (keyBuffer.length > TARGET_SEQUENCE.length) {
      keyBuffer.shift();
    }

    // Check for sequence match
    if (keyBuffer.join('') === TARGET_SEQUENCE.join('')) {
      toggleGUI();
      keyBuffer = []; // Reset buffer
    }
  });

  // --- GUI Toggle & Injection ---
  function toggleGUI() {
    if (guiElement) {
      const isHidden = guiElement.style.display === 'none';
      guiElement.style.display = isHidden ? 'block' : 'none';
      return;
    }

    createGUI();
  }

  // --- GUI Construction ---
  function createGUI() {
    guiElement = document.createElement('div');
    guiElement.id = 'custom-autoclicker-panel';
    
    // UI Styling
    Object.assign(guiElement.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '220px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      color: '#f8fafc',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: '14px',
      zIndex: '999999',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      userSelect: 'none'
    });

    // Inner UI Structure
    guiElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 600; font-size: 15px; color: #38bdf8;">Autoclicker</span>
        <button id="ac-close-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">✕</button>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Click Interval (ms)</label>
        <input id="ac-speed-input" type="number" value="${DEFAULT_SPEED_MS}" min="1" max="1000" style="
          width: 100%;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #334155;
          background: #1e293b;
          color: #f8fafc;
          box-sizing: border-box;
          font-size: 13px;
        " />
      </div>

      <button id="ac-toggle-btn" style="
        width: 100%;
        padding: 8px 0;
        border: none;
        border-radius: 6px;
        background-color: #22c55e;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
      ">Start Clicking</button>
    `;

    document.body.appendChild(guiElement);

    // Event Bindings
    const toggleBtn = guiElement.querySelector('#ac-toggle-btn');
    const closeBtn = guiElement.querySelector('#ac-close-btn');
    const speedInput = guiElement.querySelector('#ac-speed-input');

    closeBtn.addEventListener('click', () => {
      guiElement.style.display = 'none';
    });

    speedInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      clickSpeedMs = isNaN(val) || val < 1 ? 1 : val;

      // If active, restart with new speed
      if (clickIntervalId) {
        stopClicker();
        startClicker();
      }
    });

    toggleBtn.addEventListener('click', () => {
      if (clickIntervalId) {
        stopClicker();
      } else {
        startClicker();
      }
    });
  }

  // --- Autoclicker Engine ---
  function startClicker() {
    // Replace 'bigCookie' with 'cookie'
    const targetElement = document.getElementById('cookie');

    if (!targetElement) {
      alert('Autoclicker error: Could not find #bigCookie on this page.');
      return;
    }

    const toggleBtn = guiElement.querySelector('#ac-toggle-btn');
    toggleBtn.innerText = 'Stop Clicking';
    toggleBtn.style.backgroundColor = '#ef4444';

    clickIntervalId = setInterval(() => {
      targetElement.click();
    }, clickSpeedMs);
  }

  function stopClicker() {
    if (clickIntervalId) {
      clearInterval(clickIntervalId);
      clickIntervalId = null;
    }

    if (guiElement) {
      const toggleBtn = guiElement.querySelector('#ac-toggle-btn');
      toggleBtn.innerText = 'Start Clicking';
      toggleBtn.style.backgroundColor = '#22c55e';
    }
  }

  console.log('Autoclicker script loaded. Type "cookie" anywhere on the page to open the panel.');
})();
