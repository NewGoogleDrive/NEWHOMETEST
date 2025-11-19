// Small script to populate the logo scroller, add subtle interactions and create orbs.
// Replace or add image files into assets/logos/ and edit the logos array below if you want explicit control.

(() => {
  const logos = [
    // Default demo list. Replace these with your filenames like 'assets/logos/game1.png'
    // Example: 'assets/logos/game1.png'
    // If you don't add any, JS will use generated SVG placeholders (so the scroller is never empty).
    'assets/logos/logo1.png',
    'assets/logos/logo2.png',
    'assets/logos/logo3.png',
    'assets/logos/logo4.png',
    'assets/logos/logo5.png'
  ];

  const scroller = document.getElementById('scroller-track');

  // Helper: create a scroller item either with an <img> if exists or with an inline svg placeholder
  function createItem(src, idx) {
    const item = document.createElement('div');
    item.className = 'scroller-item';
    const img = document.createElement('img');
    img.alt = 'Logo ' + (idx + 1);
    img.src = src;
    // If image fails to load, replace with a placeholder
    img.addEventListener('error', () => {
      const svg = placeholderSVG(idx);
      item.innerHTML = '';
      item.appendChild(svg);
    });
    item.appendChild(img);

    // pause on hover
    item.addEventListener('mouseenter', () => {
      scroller.classList.add('paused');
    });
    item.addEventListener('mouseleave', () => {
      scroller.classList.remove('paused');
    });

    // preview interaction: clicking a logo updates hero (simple swap)
    item.addEventListener('click', () => {
      const hero = document.getElementById('hero-logo');
      hero.innerHTML = '';
      const clone = img.cloneNode();
      clone.style.width = '84%';
      clone.style.height = '84%';
      clone.style.objectFit = 'contain';
      // If the image failed earlier and was replaced with svg, then use the svg placeholder
      if (!clone.src || clone.naturalWidth === 0) {
        hero.appendChild(placeholderSVG(idx));
      } else {
        hero.appendChild(clone);
      }
      // subtle pulse
      hero.animate([{ transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
    });

    return item;
  }

  // placeholder svg generator
  function placeholderSVG(i) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '72');
    svg.setAttribute('height', '72');
    svg.setAttribute('viewBox', '0 0 72 72');
    svg.innerHTML = `
      <defs>
        <linearGradient id="g${i}" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#22d3ee"/>
          <stop offset="1" stop-color="#7c3aed"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="72" height="72" rx="12" fill="url(#g${i})"/>
      <text x="36" y="43" text-anchor="middle" fill="white" font-size="26" font-family="Inter, sans-serif">7</text>`;
    return svg;
  }

  // populate scroller with two copies for seamless continuous scrolling
  function populateScroller(list) {
    scroller.innerHTML = '';
    const items = [];
    list.forEach((src, idx) => items.push(createItem(src, idx)));
    // duplicate to make continuous effect
    items.forEach(i => scroller.appendChild(i.cloneNode(true)));
    items.forEach(i => scroller.appendChild(i.cloneNode(true)));
    // adjust animation duration based on number of items
    const singleHeight = 100; // approximate item + gap in px
    const total = items.length * singleHeight;
    const speed = 40; // px per second
    const duration = Math.max(18, Math.round(total / speed));
    scroller.style.animationDuration = duration + 's';
  }

  // If logos exist on disk, the <img> will load; otherwise placeholder appears.
  populateScroller(logos);

  // create a few floating orbs in the background
  const orbsRoot = document.getElementById('orbs');
  function makeOrbs(count = 6) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'orb';
      const size = 80 + Math.random() * 240;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.round(Math.random() * 100) + '%';
      el.style.top = Math.round(Math.random() * 100) + '%';
      el.style.background = `radial-gradient(circle at 30% 30%, rgba(124,58,237,0.24), rgba(34,211,238,0.08))`;
      el.style.opacity = (0.12 + Math.random() * 0.22).toString();
      const dur = 12 + Math.random() * 24;
      el.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: `translateY(${(Math.random() * 30 - 15)}px) scale(1.05)` },
        { transform: 'translateY(0) scale(1)' }
      ], { duration: dur * 1000, iterations: Infinity, easing: 'ease-in-out', direction: 'alternate' });
      orbsRoot.appendChild(el);
    }
  }
  makeOrbs(7);

  // subtle mouse parallax for hero logo
  const hero = document.getElementById('hero-logo');
  document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    hero.style.transform = `translate3d(${dx * 8}px, ${dy * 8}px, 0) rotate3d(0,0,1,${dx * 2}deg)`;
  });
  document.addEventListener('mouseleave', () => hero.style.transform = '');

  // Buttons: basic interactions
  document.getElementById('btn-play').addEventListener('click', () => {
    // This is a placeholder; hook into your launcher or route here
    alert('Play clicked — plug your game or demo here.');
  });

  // Resize handler: if the scroller gets too short, adjust copy count
  function adjustScroller() {
    const h = scroller.scrollHeight;
    const maskH = scroller.parentElement.clientHeight;
    // ensure at least twice the mask height to allow continuous scroll
    if (h < maskH * 2) {
      // add more copies
      const clone = scroller.cloneNode(true);
      scroller.parentElement.appendChild(clone);
    }
  }
  window.addEventListener('resize', adjustScroller);
  adjustScroller();

})();
