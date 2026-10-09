/**
 * Cookie Clicker In-Game JS Executor
 * Trigger Sequence: Type "cookie" to open/close the code runner GUI.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TARGET_SEQUENCE = ['c', 'o', 'o', 'k', 'i', 'e', 'j', 's'];
  let keyBuffer = [];
  let guiElement = null;

  // --- Key Sequence Listener ---
  document.addEventListener('keydown', (event) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = event.key.toLowerCase();
    if (key.length === 1 && key >= 'a' && key <= 'z') {
      keyBuffer.push(key);
      if (keyBuffer.length > TARGET_SEQUENCE.length) {
        keyBuffer.shift();
      }

      if (keyBuffer.join('') === TARGET_SEQUENCE.join('')) {
        toggleGUI();
        keyBuffer = [];
      }
    }
  });

  // --- GUI Toggle ---
  function toggleGUI() {
    if (!guiElement) {
      createGUI();
    } else {
      guiElement.style.display = guiElement.style.display === 'none' ? 'block' : 'none';
      if (guiElement.style.display === 'block') {
        const textarea = guiElement.querySelector('#js-code-input');
        if (textarea) textarea.focus();
      }
    }
  }

  // --- Create GUI Panel ---
  function createGUI() {
    guiElement = document.createElement('div');
    guiElement.id = 'js-executor-gui';

    Object.assign(guiElement.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '320px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      color: '#f8fafc',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
      fontFamily: 'Segoe UI, monospace, sans-serif',
      fontSize: '13px',
      zIndex: '9999999',
      border: '1px solid #38bdf8',
      backdropFilter: 'blur(8px)',
      userSelect: 'none'
    });

    guiElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-weight: bold; color: #38bdf8;">JS Code Executor</span>
        <button id="js-close-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">✕</button>
      </div>

      <textarea id="js-code-input" placeholder="// Enter JavaScript code here...&#10;// Example: Game.Earn(1000000);" style="
        width: 100%;
        height: 120px;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #334155;
        background: #0f172a;
        color: #f1f5f9;
        font-family: Consolas, Monaco, 'Courier New', monospace;
        font-size: 12px;
        box-sizing: border-box;
        resize: vertical;
        outline: none;
        margin-bottom: 10px;
      "></textarea>

      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <button id="js-run-btn" style="
          flex: 1;
          padding: 8px 0;
          border: none;
          border-radius: 6px;
          background-color: #38bdf8;
          color: #0f172a;
          font-weight: bold;
          cursor: pointer;
        ">Run Code</button>
        <button id="js-clear-btn" style="
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          background-color: #334155;
          color: #f8fafc;
          font-weight: bold;
          cursor: pointer;
        ">Clear</button>
      </div>

      <div id="js-status" style="
        font-size: 11px;
        color: #94a3b8;
        min-height: 16px;
        word-break: break-word;
      ">Press Ctrl+Enter to execute.</div>
    `;

    document.body.appendChild(guiElement);

    const closeBtn = guiElement.querySelector('#js-close-btn');
    const runBtn = guiElement.querySelector('#js-run-btn');
    const clearBtn = guiElement.querySelector('#js-clear-btn');
    const textarea = guiElement.querySelector('#js-code-input');

    closeBtn.onclick = () => {
      guiElement.style.display = 'none';
    };

    clearBtn.onclick = () => {
      textarea.value = '';
      setStatus('Cleared.', '#94a3b8');
    };

    runBtn.onclick = executeCode;

    // Hotkey: Ctrl + Enter / Cmd + Enter to run code directly inside the text area
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      }
    });
  }

  // --- Execution Engine ---
  function executeCode() {
    const textarea = guiElement.querySelector('#js-code-input');
    const code = textarea.value.trim();

    if (!code) {
      setStatus('Please enter some JavaScript code.', '#f87171');
      return;
    }

    try {
      // Execute input code in global context
      const result = new Function(code)();
      const outputMsg = result !== undefined ? String(result) : 'Executed successfully!';
      setStatus('Success: ' + outputMsg, '#4ade80');
    } catch (err) {
      setStatus('Error: ' + err.message, '#f87171');
    }
  }

  function setStatus(text, color) {
    const statusEl = guiElement.querySelector('#js-status');
    if (statusEl) {
      statusEl.innerText = text;
      statusEl.style.color = color;
    }
  }

  console.log('JS Executor loaded. Type "cookie" anywhere on the page to toggle the panel.');
})();
