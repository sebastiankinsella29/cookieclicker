/**
 * Cookie Clicker Custom Golden Cookie Spawner
 * Sequence: Type "cookie" or click the bottom-left "🍪 Menu" button.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TARGET_SEQUENCE = ['c', 'o', 'o', 'k', 'i', 'e', 'g'];
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

  // --- Emergency Helper Button (Bottom-Left) ---
  function injectHelperButton() {
    if (document.getElementById('gc-helper-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'gc-helper-btn';
    btn.innerText = '🍪 Menu';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: '999999',
      padding: '8px 12px',
      backgroundColor: '#eab308',
      color: '#000',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      fontFamily: 'Segoe UI, sans-serif'
    });
    btn.onclick = toggleGUI;
    document.body.appendChild(btn);
  }

  // --- GUI Toggle ---
  function toggleGUI() {
    if (!guiElement) {
      createGUI();
    } else {
      guiElement.style.display = guiElement.style.display === 'none' ? 'block' : 'none';
    }
  }

  // --- Create GUI Panel ---
  function createGUI() {
    guiElement = document.createElement('div');
    guiElement.id = 'golden-cookie-spawner-gui';

    Object.assign(guiElement.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '260px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      color: '#f8fafc',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      zIndex: '9999999',
      border: '1px solid #eab308',
      backdropFilter: 'blur(8px)',
      userSelect: 'none'
    });

    guiElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: bold; color: #facc15;">Golden Cookie Spawner</span>
        <button id="gc-close-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">✕</button>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Cookies Granted on Click</label>
        <input id="gc-amount-input" type="number" value="1000000" min="1" style="
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
      </div>

      <button id="gc-spawn-btn" style="
        width: 100%;
        padding: 8px 0;
        border: none;
        border-radius: 6px;
        background-color: #eab308;
        color: #0f172a;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
      ">Spawn Golden Cookie</button>
    `;

    document.body.appendChild(guiElement);

    // Bindings
    guiElement.querySelector('#gc-close-btn').onclick = () => {
      guiElement.style.display = 'none';
    };

    guiElement.querySelector('#gc-spawn-btn').onclick = () => {
      const input = guiElement.querySelector('#gc-amount-input');
      const amount = parseFloat(input.value);

      if (!isNaN(amount) && amount > 0) {
        spawnCustomGoldenCookie(amount);
      } else {
        alert('Please enter a valid positive number.');
      }
    };
  }

  // --- Golden Cookie Spawner Function ---
  function spawnCustomGoldenCookie(cookieReward) {
    if (typeof Game === 'undefined') {
      alert('Cookie Clicker Game object not found.');
      return;
    }

    // Spawn a standard Golden Cookie using native Game engine
    const newShimmer = new Game.shimmer('golden');

    // Override the custom click behavior for this golden cookie
    newShimmer.pop = function () {
      // Award the custom cookie amount
      Game.Earn(cookieReward);

      // Play golden cookie chime sound if available
      if (Game.playGoldCookieSound) {
        Game.playGoldCookieSound();
      }

      // Show floating popup message
      Game.Popup('+' + Math.floor(cookieReward).toLocaleString() + ' cookies!', newShimmer.x + 50, newShimmer.y);

      // Destroy shimmer object safely
      this.die();
    };
  }

  // Inject helper button when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHelperButton);
  } else {
    injectHelperButton();
  }

  console.log('Golden Cookie Spawner script loaded. Type "cookie" or click the bottom-left button.');
})();
