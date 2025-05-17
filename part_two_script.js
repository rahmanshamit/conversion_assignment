// =================== STYLES ===================
const style = document.createElement('style');
style.textContent = `
  /* Fixed tab at bottom */
  #drawer-tab {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1a1a1a;
    color: white;
    text-align: center;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    width: 200px;
    border-radius: 12px 12px 0 0;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
    transition: bottom 0.4s ease;
  }

  /* Chevron icon */
  #drawer-tab .chevron {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  #drawer-tab.open .chevron {
    transform: rotate(180deg);
  }

  /* Drawer content slides from bottom */
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
    min-width: 200px;
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
  tab.innerHTML = `Sticky Drawer <span class="chevron">⌃</span>`;
  document.body.appendChild(tab);

  // Toggle behavior
  tab.addEventListener('click', () => {
    const isOpen = drawerContent.classList.toggle('open');
    tab.classList.toggle('open', isOpen);
    tab.style.bottom = isOpen ? '300px' : '0';
  });

  // Load Glider.js from CDN
  const gliderCss = document.createElement('link');
  gliderCss.rel = 'stylesheet';
  gliderCss.href = 'https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.css';
  document.head.appendChild(gliderCss);

  const gliderScript = document.createElement('script');
  gliderScript.src = 'https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.js';
  gliderScript.onload = () => {
    new Glider(drawerContent.querySelector('.glider'), {
      slidesToShow: 3,
      slidesToScroll: 1,
      draggable: true,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  };
  document.body.appendChild(gliderScript);
}
