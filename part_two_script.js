// =================== STYLES ===================
const style = document.createElement('style');
style.textContent = `
 /* Paste CSS here */
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

  const prevArrow = document.createElement('button');
  prevArrow.className = 'glider-prev';
  prevArrow.textContent = '‹';  // Left arrow

  const pageCount = document.createElement('span');
  pageCount.className = 'page-count';
  pageCount.textContent = '1 / 1'; // will update dynamically

  const nextArrow = document.createElement('button');
  nextArrow.className = 'glider-next';
  nextArrow.textContent = '›';  // Right arrow

  const chevron = document.createElement('span');
  chevron.className = 'chevron';
  chevron.textContent = '⌃';

  const paginationWrapper = document.createElement('div');
  paginationWrapper.className = 'pagination-wrapper';

  paginationWrapper.append(prevArrow, pageCount, nextArrow);
  tab.append(label, paginationWrapper, chevron);

  document.body.appendChild(tab);

  // Toggle drawer
  tab.addEventListener('click', (e) => {
    // Ignore clicks on arrows to avoid toggling drawer
    if (e.target.closest('button.glider-prev') || e.target.closest('button.glider-next')) return;

    const isOpen = drawerContent.classList.toggle('open');
    tab.classList.toggle('open', isOpen);``
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
  const pageCountElem = document.querySelector('#drawer-tab .page-count');

  function getSlidesToShow() {
    const width = window.innerWidth;
    if (width < 400) return 1;
    if (width < 600) return 2;
    return 4;
  }

  function updatePageCount(gliderInstance) {
    const totalSlides = gliderElement.querySelectorAll('.glider-slide').length;
    const currentPage = gliderInstance.page + 1;
    const totalPages = Math.ceil(totalSlides / getSlidesToShow());
    pageCountElem.textContent = `${currentPage} / ${totalPages}`;
  }

  fetch('https://pokeapi.co/api/v2/pokemon?limit=7')
    .then(res => res.json())
    .then(async data => {
      for (const pokemon of data.results) {
        const res = await fetch(pokemon.url);
        const details = await res.json();

        const name = details.name;
        const image = details.sprites.front_default;
        const type = details.types.map(t => t.type.name).join(', ');
        const abilities = details.abilities.map(a => a.ability.name).join(', ');

        const slide = document.createElement('div');
        slide.className = 'glider-slide';
        slide.innerHTML = `
          <div class="slide-content">
            <img src="${image}" alt="${name}" style="max-width: 100px; display:block; margin:auto;" />
            <h3 style="font-size: 20px;">${name}</h3>
            <p style="margin: 0 0 6px;">Type: ${type}</p>
            <div class="tooltip-container" style="position: relative; display: inline-block;">
              <span class="tooltip-icon" style="cursor:pointer;">ℹ️</span>
              <div class="tooltip-text">
                Abilities: ${abilities}
              </div>
            </div>
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" class="button">Learn</a>
          </div>
        `;
        gliderElement.appendChild(slide);
      }

      // Tooltip hover logic
      document.querySelectorAll('.tooltip-container').forEach(container => {
        const icon = container.querySelector('.tooltip-icon');
        const tooltip = container.querySelector('.tooltip-text');
        icon.addEventListener('mouseenter', () => {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        });
        icon.addEventListener('mouseleave', () => {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      });

      // Initialize Glider AFTER slides are populated
      const gliderInstance = new Glider(gliderElement, {
        slidesToShow: getSlidesToShow(),
        slidesToScroll: 1,
        draggable: true,
        scrollLock: true,
        arrows: {
          prev: '#drawer-tab .glider-prev',
          next: '#drawer-tab .glider-next'
        },
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

      updatePageCount(gliderInstance);
      gliderElement.addEventListener('glider-slide-visible', () => updatePageCount(gliderInstance));
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