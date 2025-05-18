// =================== STYLES ===================
const style = document.createElement('style');
style.textContent = `
  #drawer-tab {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(209, 105, 32);
    color: black;
    text-align: left;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    width: 300px;
    border-radius: 12px 12px 0 0;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
    transition: bottom 0.4s ease;
  }

  #drawer-tab .chevron {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  #drawer-tab.open .chevron {
    transform: rotate(180deg);
  }

  #drawer-tab.open {
    background-color: #ffffff;
  }

  #drawer-content {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 300px;
    background: #fff;
    transform: translateY(100%);
    transition: transform 0.4s ease;
    z-index: 10000;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    pointer-events: all;
  }

  #drawer-content.open {
    transform: translateY(0%);
  }

  .slider-container {
    padding: 20px 10px;
  }

  .glider {
    display: flex;
    gap: 16px;
  }

  .glider-slide {
    max-width: 350px;
    flex: 0 0 auto;
    height: 120px;
    background: #e0e0e0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
  }

  @media (max-width: 600px) {
    .glider-slide {
      min-width: 140px;
    }
  }
`;
document.head.appendChild(style);

// =================== HTML STRUCTURE ===================
if (!document.querySelector('#drawer-tab')) {
  // Drawer content
  const drawerContent = document.createElement('div');
  drawerContent.id = 'drawer-content';
  drawerContent.innerHTML = `
    <div class="slider-container">
      <div class="glider">
        <div class="glider-slide">Slide 1</div>
        <div class="glider-slide">Slide 2</div>
        <div class="glider-slide">Slide 3</div>
        <div class="glider-slide">Slide 4</div>
        <div class="glider-slide">Slide 5</div>
        <div class="glider-slide">Slide 6</div>
        <div class="glider-slide">Slide 7</div>
      </div>
    </div>
  `;
  document.body.appendChild(drawerContent);

  // Drawer tab
  const tab = document.createElement('div');
  tab.id = 'drawer-tab';

  const label = document.createElement('span');
  label.className = 'drawer-label';
  label.textContent = 'Sticky Drawer';

  const chevron = document.createElement('span');
  chevron.className = 'chevron';
  chevron.textContent = '⌃';

  tab.append(label, chevron);
  document.body.appendChild(tab);

  // Toggle drawer
  tab.addEventListener('click', () => {
    const isOpen = drawerContent.classList.toggle('open');
    tab.classList.toggle('open', isOpen);
    tab.style.bottom = isOpen ? '300px' : '0';
  });

  // Load Glider.js
  const gliderCss = document.createElement('link');
  gliderCss.rel = 'stylesheet';
  gliderCss.href = 'https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.css';
  document.head.appendChild(gliderCss);

  const gliderScript = document.createElement('script');
  gliderScript.src = 'https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.js';
  gliderScript.onload = () => {
    const gliderElement = drawerContent.querySelector('.glider');
    new Glider(gliderElement, {
      slidesToShow: 4,
      slidesToScroll: 1,
      draggable: true,
      responsive: [
        {
          breakpoint: 600,
          settings: { slidesToShow: 2 }
        },
        {
          breakpoint: 400,
          settings: { slidesToShow: 1 }
        }
      ]
    });
  };
  document.body.appendChild(gliderScript);
}

// =================== AUTO-CLOSE NEAR PAGE BOTTOM ===================
window.addEventListener('scroll', () => {
  const drawerContent = document.getElementById('drawer-content');
  const drawerTab = document.getElementById('drawer-tab');
  if (!drawerContent || !drawerTab) return;

  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.body.scrollHeight;
  const threshold = 20;

  if (drawerContent.classList.contains('open') && (pageHeight - scrollPosition) <= threshold) {
    drawerContent.classList.remove('open');
    drawerTab.classList.remove('open');
    drawerTab.style.bottom = '0';
  }
});