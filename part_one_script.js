(() => {
  // Inject all required CSS styles into document head
  const styleTag = document.createElement('style');
  styleTag.textContent = `
  /* Paste CSS here */
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

    // Inject progress bar and initialize step logic here:
    injectProgressBar(window.originalFormWrapper.querySelector('form'));
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

 function injectProgressBar(form) {
  if (!form || document.getElementById('progress-bar')) return;

  const steps = [
    { id: 1, label: 'Step 1', icon: '👤' },
    { id: 2, label: 'Step 2', icon: '✉️' },
    { id: 3, label: 'Step 3', icon: '✅' },
  ];

  let currentStep = 1;
  const completedSteps = new Set();

  // Create Progress Bar
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';

  const stepElements = steps.map(({ id, label, icon }) => {
    const el = document.createElement('div');
    el.className = 'progress-step';
    el.dataset.step = id;

    el.innerHTML = `
      <div class="progress-icon-wrapper">
        <div class="step-icon-circle">
          <div class="step-icon">${icon}</div>
        </div>
        <div class="progress-checkmark">✓</div>
      </div>
      <div class="step-label">${label}</div>
    `;

    el.addEventListener('click', () => {
      if (id === currentStep || completedSteps.has(id)) {
        goToStep(id);
      }
    });

    progressBar.appendChild(el);
    return el;
  });

  form.insertBefore(progressBar, form.firstChild);

  const firstname = form.querySelector('input[name="firstname"]');
  const lastname = form.querySelector('input[name="lastname"]');
  const email = form.querySelector('input[name="email"]');
  const textarea = form.querySelector('textarea[name="how_can_we_help_you___contact_us_form_"]');
  const textarea_two = form.querySelector('input[name="conversion__how_did_you_hear_about_us_"]');
  const submitBtn = form.querySelector('input[type="submit"]');
  // Hide submit button initially
  if (submitBtn) submitBtn.style.display = 'none';

  function updateProgressBarUI() {
    stepElements.forEach((el) => {
      const stepId = Number(el.dataset.step);
      el.classList.toggle('active', stepId === currentStep);
      el.classList.toggle('completed', completedSteps.has(stepId));
    });
  }

  function goToStep(step) {
    currentStep = step;

    const showStep1 = step === 1;
    const showStep2 = step === 2;
    const showStep3 = step === 3;

    [firstname, lastname, email].forEach(f => {
      if (f) f.closest('fieldset')?.style?.setProperty('display', showStep1 ? '' : 'none');
    });

    [textarea, textarea_two].forEach(f => {
      if (f) f.closest('fieldset')?.style?.setProperty('display', showStep2 ? '' : 'none');
    });

    if (submitBtn) submitBtn.style.display = showStep3 ? '' : 'none';

    updateProgressBarUI();
  }

  function checkStepCompletion() {
    const step1Complete =
      firstname?.value.trim() &&
      lastname?.value.trim() &&
      email?.value.trim();

    const step2Complete =
      textarea?.value.trim() &&
      textarea_two?.value.trim()

    if (step1Complete) {
      completedSteps.add(1);
      if (currentStep === 1) goToStep(2);
    }

    if (step2Complete) {
      completedSteps.add(2);
      completedSteps.add(3);  
    }

    if (submitBtn) {
      submitBtn.style.display = step2Complete ? '' : 'none';
    }

    updateProgressBarUI();
  }

  [firstname, lastname, email].forEach(el => {
    el?.addEventListener('blur', checkStepCompletion);
  });

  [textarea, textarea_two].forEach(el => {
    el?.addEventListener('input', checkStepCompletion);
    el?.addEventListener('change', checkStepCompletion);
  });

  goToStep(1); // Initial render
}



})();
