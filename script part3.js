

(function(){
  'use strict';

  
  const PRODUCTS = [
    { id: 1, title: 'Night Repair Cream', price: 'R150.00', img: 'face-cream-2.avif', desc: 'Lavender & shea butter to nourish while you sleep.' },
    { id: 2, title: 'Revitalizing Serum', price: 'R100.00', img: 'dark-glass-bottles-of-moisturizing-face-serum-cosmetic-oil-and-pebble-stones-on-a-sandy-background-summer-facial-skin-care-concept-photo.jpg', desc: 'Antioxidants for brighter, firmer skin.' },
    { id: 3, title: 'Radiance Restore Lotion', price: 'R250.00', img: 'best-organic-body-lotion-cream.jpeg', desc: 'Hydrate and improve elasticity.' }
  ];

 
  function toggleNav(toggleId, navId){
    const btn = document.getElementById(toggleId);
    const nav = document.getElementById(navId);
    if(!btn || !nav) return;
    btn.addEventListener('click', ()=> {
      if(nav.style.display === 'block'){
        nav.style.display = '';
      } else {
        nav.style.display = 'block';
      }
    });
  }
  toggleNav('nav-toggle','main-nav');
  toggleNav('nav-toggle-2','main-nav-2');
  toggleNav('nav-toggle-3','main-nav-3');
  toggleNav('nav-toggle-4','main-nav-4');
  toggleNav('nav-toggle-5','main-nav-5');

  
  function renderProductsIntoElement(el, list = PRODUCTS){
    if(!el) return;
    el.innerHTML = '';
    if(list.length === 0){
      el.innerHTML = '<p style="padding:20px;text-align:center">No products found.</p>';
      return;
    }
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product';
      card.innerHTML = `
        <img data-src="${p.img}" alt="${p.title}" class="lazy" />
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <p><strong>${p.price}</strong></p>
        <p><button class="btn add-to-cart" data-id="${p.id}">Add to cart</button></p>
      `;
      el.appendChild(card);
    });
    initLazy(); 
  }

  
  document.addEventListener('DOMContentLoaded', ()=> {
    document.querySelectorAll('#products-grid').forEach(el => renderProductsIntoElement(el));

   
    const searchInput = document.getElementById('search-input');
    if(searchInput){
      searchInput.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        const filtered = PRODUCTS.filter(p => (p.title + p.desc).toLowerCase().includes(q));
        renderProductsIntoElement(document.querySelector('#products-grid'), filtered);
      });
    }
    const priceFilter = document.getElementById('price-filter');
    if(priceFilter){
      priceFilter.addEventListener('change', e => {
        const val = e.target.value;
        let filtered = PRODUCTS.slice();
        if(val){
          if(val === '9999'){
            filtered = filtered.filter(p => parseFloat(p.price.replace('R','')) > 250);
          } else {
            filtered = filtered.filter(p => parseFloat(p.price.replace('R','')) <= parseFloat(val));
          }
        }
        renderProductsIntoElement(document.querySelector('#products-grid'), filtered);
      });
    }

   
    document.body.addEventListener('click', (ev) => {
      if(ev.target.matches('.add-to-cart')){
        const id = ev.target.getAttribute('data-id');
        const prod = PRODUCTS.find(p => String(p.id) === String(id));
        if(prod) alert(`${prod.title} added to cart (demo)`);
      }
    });
  });

 
  let io;
  function initLazy(){
    const lazyImgs = document.querySelectorAll('img.lazy');
    if('IntersectionObserver' in window){
      if(!io){
        io = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if(entry.isIntersecting){
              const img = entry.target;
              const src = img.getAttribute('data-src');
              if(src){
                img.src = src;
                img.onload = () => img.classList.add('loaded');
                img.removeAttribute('data-src');
              }
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '60px' });
      }
      lazyImgs.forEach(i => io.observe(i));
    } else {
     
      lazyImgs.forEach(img => {
        const src = img.getAttribute('data-src');
        if(src){ img.src = src; img.classList.add('loaded'); img.removeAttribute('data-src'); }
      });
    }
  }
  window.addEventListener('load', initLazy);

 
  window.initMap = function(){
    if(!document.getElementById('map')) return;
    const coords = { lat: -26.2041, lng: 28.0473 };
    try{
      const map = new google.maps.Map(document.getElementById('map'), { center: coords, zoom: 11 });
      new google.maps.Marker({ position: coords, map });
    }catch(err){
      console.warn('Google Maps did not initialize (no API key or offline).', err);
      const el = document.getElementById('map');
      if(el) el.innerText = 'Map cannot be displayed (check API key).';
    }
  };

})();
