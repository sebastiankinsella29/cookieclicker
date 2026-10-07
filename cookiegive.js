(function () {
  'use strict';

  const TARGET_SEQUENCE = ['c', 'o', 'o', 'k', 'i', 'e', 'g'];
  let keyBuffer = [];
  let guiElement = null;

  // Listen for key presses
  document.addEventListener('keydown', (event) => {
    // Ignore input inside text boxes
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    // Use event.key.toLowerCase() to handle Caps Lock / Shift
    const key = event.key.toLowerCase();
    
    // Only capture single alphabet letters
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

  // Emergency Trigger Button (Bottom Left)
  function injectHelperButton() {
    if (document.getElementById('ce-helper-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'ce-helper-btn';
    btn.innerText = '🍪 Menu';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: '999999',
      padding: '8px 12px',
      backgroundColor: '#f97316',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      fontFamily: 'sans-serif'
    });
    btn.onclick = toggleGUI;
    document.body.appendChild(btn);
  }

  function toggleGUI() {
    if (!guiElement) {
      createGUI();
    } else {
      guiElement.style.display = guiElement.style.display === 'none' ? 'block' : 'none';
    }
    updateDisplay();
  }

  function createGUI() {
    guiElement = document.createElement('div');
    guiElement.id = 'cookie-editor-gui';

    Object.assign(guiElement.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '240px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      zIndex: '9999999',
      border: '1px solid #334155'
    });

    guiElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: bold; color: #f97316;">Cookie Spawner</span>
        <button id="ce-close-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer;">✕</button>
      </div>
      <div style="margin-bottom: 12px; background: #1e293b; padding: 8px; border-radius: 6px; text-align: center;">
        <span style="font-size: 11px; color: #94a3b8; display: block;">Current Cookies</span>
        <span id="ce-count" style="font-size: 16px; font-weight: bold; color: #fdba74;">0</span>
      </div>
      <button id="ce-add-1m" style="width:100%; margin-bottom: 6px; padding: 6px; background:#f97316; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">+1 Million</button>
      <button id="ce-add-1b" style="width:100%; margin-bottom: 6px; padding: 6px; background:#ea580c; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">+1 Billion</button>
    `;

    document.body.appendChild(guiElement);

    guiElement.querySelector('#ce-close-btn').onclick = () => guiElement.style.display = 'none';
    guiElement.querySelector('#ce-add-1m').onclick = () => { if (window.Game) Game.Earn(1000000); updateDisplay(); };
    guiElement.querySelector('#ce-add-1b').onclick = () => { if (window.Game) Game.Earn(1000000000); updateDisplay(); };
  }

  function updateDisplay() {
    if (guiElement && window.Game) {
      const countLabel = guiElement.querySelector('#ce-count');
      if (countLabel) countLabel.innerText = Math.floor(Game.cookies).toLocaleString();
    }
  }

  // Ensure DOM is ready before adding helper button
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHelperButton);
  } else {
    injectHelperButton();
  }
})();
