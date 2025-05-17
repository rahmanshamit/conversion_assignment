(() => {
  // Inject all required CSS styles into document head
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    /* Button Styles */
    a.button {
      display: inline-block;
      background-color: #90ee90; /* light green */
      color: #000;
      padding: 0.6rem 1.2rem;
      border: 2px solid #5cb85c;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      box-shadow: 0 4px 0 #5cb85c; /* 3D boxy effect */
      transition: all 0.2s ease;
      cursor: pointer;
    }
    a.button:hover {
      background-color: #3e8e41; /* dark green */
      color: #fff;
    }
    a.button:focus {
      outline: none;
      border-color: #007BFF; /* blue border */
      box-shadow: 0 0 0 3px rgba(0,123,255,0.3);
    }
    a.button:disabled,
    a.button.disabled {
      background-color: beige;
      border-color: #d3cfc9;
      color: #999;
      box-shadow: none;
      cursor: not-allowed;
      pointer-events: none;
    }
    a.button:active {
      box-shadow: none; /* flat effect when clicked */
      position: relative;
      top: 2px;
    }

    /* Container styles */
    .contact-form__form.kam-world {
      max-height: 40%;
      overflow: auto;
      position: relative;
      z-index: 10001;
      padding: 1rem;
      box-sizing: border-box;
    }

    /* Wrapper flex container, vertical layout */
    .contact-form__form.kam-world > div {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      align-items: stretch;
    }

    /* Header and paragraph container (left aligned) */
    .contact-form__form.kam-world .header-para-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }

    /* Button wrapper aligned right */
    .contact-form__form.kam-world .button-wrapper {
      display: flex;
      justify-content: flex-end;
    }

    /* Overlay */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      pointer-events: none;
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 11000;
      pointer-events: none;
    }

    /* Modal visible state */
    .modal-backdrop.visible {
      opacity: 1;
      pointer-events: auto;
    }

    /* Modal Box */
    .modal-box {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 2px 15px rgba(0,0,0,0.3);
    }

    /* Close button */
    .modal-box button.close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    /* Responsive Media Queries */
    @media (max-width: 862px) and (min-width: 768px) {
      .contact-form__form.kam-world {
        max-height: 30%;
        width: 75%; /* relative width so it shrinks with viewport */
        max-width: 400px; /* smaller max-width to prevent overflow */
        margin: 0 auto;
        box-sizing: border-box;
        padding: 0 10px; /* less padding for narrow screens */
      }
    }
    @media (max-width: 767px) {
      .contact-form__form.kam-world {
        max-height: none; /* remove max-height */
        width: 95vw;
        margin: 0 auto;
      }
      .contact-form__form.kam-world > div {
        gap: 1rem;
      }
      .contact-form__form.kam-world .button-wrapper {
        justify-content: flex-start; /* button left aligned on small screens */
      }
    }
  `;
  document.head.appendChild(styleTag);

  // Step 1: Identify and store original form wrapper, remove from DOM
  const container = document.querySelector('.contact-form__form.kam-world');
  if (!container) {
    console.error('Form container .contact-form__form.kam-world not found');
    return;
  }

  const hbsptWrapper = container.querySelector('.hbspt-form');
  if (!hbsptWrapper) {
    console.error('No .hbspt-form wrapper found inside the container');
    return;
  }

  // Store form wrapper globally and detach from DOM
  window.originalFormWrapper = hbsptWrapper;
  if (hbsptWrapper.parentNode) {
    hbsptWrapper.parentNode.removeChild(hbsptWrapper);
  }

  // Step 2: Replace container content with custom header, paragraph, button
  container.innerHTML = '';

  const wrapperDiv = document.createElement('div');

  // Header + paragraph container
  const headerParaWrapper = document.createElement('div');
  headerParaWrapper.classList.add('header-para-wrapper');

  const heading = document.createElement('h2');
  heading.classList.add('contact-form__content-title');
  heading.textContent = 'Hello Conversion!';

  const paragraph = document.createElement('p');
  paragraph.textContent = 'Click on the button below to contact us';

  headerParaWrapper.appendChild(heading);
  headerParaWrapper.appendChild(paragraph);

  // Button container
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button-wrapper');

  const buttonLink = document.createElement('a');
  buttonLink.className = 'button';
  buttonLink.href = '#';
  buttonLink.textContent = 'Click here';

  buttonWrapper.appendChild(buttonLink);

  // Append in order: header+para, then button
  wrapperDiv.appendChild(headerParaWrapper);
  wrapperDiv.appendChild(buttonWrapper);

  container.appendChild(wrapperDiv);

  // Step 3: Create dim overlay for spotlight effect (covers everything except container)
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);

  // Step 4: Create modal structure (hidden initially)
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';

  const modalBox = document.createElement('div');
  modalBox.className = 'modal-box';

  // Close button "X"
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close modal');
  closeButton.className = 'close-button';

  modalBox.appendChild(closeButton);
  modalBackdrop.appendChild(modalBox);

  // Step 5: Show modal on button click and append original form wrapper into modal box
  buttonLink.addEventListener('click', (e) => {
    e.preventDefault();

    if (!document.body.contains(modalBackdrop)) {
      document.body.appendChild(modalBackdrop);
    }

    modalBox.appendChild(window.originalFormWrapper);

    // Trigger CSS transition by adding visible class
    requestAnimationFrame(() => {
      modalBackdrop.classList.add('visible');
    });
  });

  // Step 6: Close modal function
  function closeModal() {
    modalBackdrop.classList.remove('visible');

    // Remove form wrapper from modal box (detach from DOM)
    if (window.originalFormWrapper.parentNode === modalBox) {
      modalBox.removeChild(window.originalFormWrapper);
    }

    modalBackdrop.addEventListener(
      'transitionend',
      () => {
        if (modalBackdrop.parentNode) {
          modalBackdrop.parentNode.removeChild(modalBackdrop);
        }
      },
      { once: true }
    );
  }

  // Step 7: Close modal on clicking close button or backdrop outside modal box
  closeButton.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });
})();
