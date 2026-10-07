/**
 * Cookie Clicker Sugar Lump Editor with Key-Sequence Activation
 * Sequence: Type "cookie" to show/hide the menu.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TARGET_SEQUENCE = ['c', 'o', 'o', 'k', 'i', 'e', 'l', 'u', 'm', 'p']; // Type 'cookie' to toggle GUI

  // --- State Variables ---
  let keyBuffer = [];
  let guiElement = null;

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
      if (!isHidden) updateDisplay();
      return;
    }

    createGUI();
  }

  // --- GUI Construction ---
  function createGUI() {
    guiElement = document.createElement('div');
    guiElement.id = 'sugarlump-gui-panel';

    // UI Styling
    Object.assign(guiElement.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '240px',
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
        <span style="font-weight: 600; font-size: 15px; color: #facc15;">Sugar Lump Editor</span>
        <button id="sl-close-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">✕</button>
      </div>

      <div style="margin-bottom: 12px; background: #1e293b; padding: 10px; border-radius: 6px; text-align: center;">
        <span style="font-size: 12px; color: #94a3b8; display: block;">Current Sugar Lumps</span>
        <span id="sl-current-count" style="font-size: 20px; font-weight: bold; color: #fef08a;">0</span>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button id="sl-sub-btn" style="
          flex: 1;
          padding: 8px 0;
          border: none;
          border-radius: 6px;
          background-color: #ef4444;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        ">-10</button>
        <button id="sl-add-btn" style="
          flex: 1;
          padding: 8px 0;
          border: none;
          border-radius: 6px;
          background-color: #22c55e;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        ">+10</button>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Set Custom Amount</label>
        <input id="sl-custom-input" type="number" placeholder="Enter amount..." min="0" style="
          width: 100%;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #334155;
          background: #1e293b;
          color: #f8fafc;
          box-sizing: border-box;
          font-size: 13px;
          margin-bottom: 8px;
        " />
        <button id="sl-set-btn" style="
          width: 100%;
          padding: 6px 0;
          border: none;
          border-radius: 6px;
          background-color: #38bdf8;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        ">Set Lumps</button>
      </div>
    `;

    document.body.appendChild(guiElement);

    // Event Bindings
    const closeBtn = guiElement.querySelector('#sl-close-btn');
    const addBtn = guiElement.querySelector('#sl-add-btn');
    const subBtn = guiElement.querySelector('#sl-sub-btn');
    const setBtn = guiElement.querySelector('#sl-set-btn');
    const customInput = guiElement.querySelector('#sl-custom-input');

    closeBtn.addEventListener('click', () => {
      guiElement.style.display = 'none';
    });

    addBtn.addEventListener('click', () => {
      modifySugarLumps(10);
    });

    subBtn.addEventListener('click', () => {
      modifySugarLumps(-10);
    });

    setBtn.addEventListener('click', () => {
      const val = parseInt(customInput.value, 10);
      if (!isNaN(val) && val >= 0) {
        setSugarLumps(val);
        customInput.value = '';
      }
    });

    updateDisplay();
  }

  // --- Sugar Lump Functions ---
  function getGameLumps() {
    if (typeof Game !== 'undefined' && typeof Game.lumps !== 'undefined') {
      return Game.lumps;
    }
    return 0;
  }

  function modifySugarLumps(amount) {
    if (typeof Game !== 'undefined' && typeof Game.lumps !== 'undefined') {
      Game.lumps = Math.max(0, Game.lumps + amount);
      if (typeof Game.lumpsTotal !== 'undefined') {
        Game.lumpsTotal = Math.max(Game.lumpsTotal, Game.lumps);
      }
      updateDisplay();
    } else {
      alert('Cookie Clicker game object (Game.lumps) not detected.');
    }
  }

  function setSugarLumps(amount) {
    if (typeof Game !== 'undefined' && typeof Game.lumps !== 'undefined') {
      Game.lumps = amount;
      if (typeof Game.lumpsTotal !== 'undefined' && amount > Game.lumpsTotal) {
        Game.lumpsTotal = amount;
      }
      updateDisplay();
    } else {
      alert('Cookie Clicker game object (Game.lumps) not detected.');
    }
  }

  function updateDisplay() {
    if (guiElement) {
      const countLabel = guiElement.querySelector('#sl-current-count');
      if (countLabel) {
        countLabel.innerText = Math.floor(getGameLumps()).toLocaleString();
      }
    }
  }

  console.log('Sugar Lump Editor script loaded. Type "cookie" anywhere on the page to open the panel.');
})();
