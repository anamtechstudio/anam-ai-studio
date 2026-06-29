/* ANAM AI STUDIO — script.js v3 */

/* Loader */
window.addEventListener('load',()=>{
  const l=document.getElementById('loader');
  if(l)setTimeout(()=>l.classList.add('done'),800);
});

/* Nav scroll + active link */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav?.classList.toggle('scrolled',window.scrollY>40);
  document.getElementById('top-f')?.classList.toggle('show',window.scrollY>420);
  let cur='';
  document.querySelectorAll('section[id]').forEach(s=>{
    if(window.scrollY>=s.offsetTop-130)cur=s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.toggle('active',a.getAttribute('href')==='#'+cur);
  });
},{passive:true});

/* Mobile drawer */
const burger=document.getElementById('burger');
const mobNav=document.getElementById('mob-nav');
const overlay=document.getElementById('mob-overlay');
const openM=()=>{burger.classList.add('open');mobNav.classList.add('open');overlay.classList.add('on');document.body.style.overflow='hidden'};
const closeM=()=>{burger.classList.remove('open');mobNav.classList.remove('open');overlay.classList.remove('on');document.body.style.overflow=''};
burger?.addEventListener('click',()=>mobNav.classList.contains('open')?closeM():openM());
document.getElementById('mob-close')?.addEventListener('click',closeM);
overlay?.addEventListener('click',closeM);
mobNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeM));

/* Theme */
const applyTheme=m=>{document.body.classList.toggle('light',m==='light');
  const i=document.getElementById('theme-icon');if(i)i.textContent=m==='light'?'☀️':'🌙';
  localStorage.setItem('aas-theme',m)};
applyTheme(localStorage.getItem('aas-theme')||'dark');
document.getElementById('theme-btn')?.addEventListener('click',()=>
  applyTheme(document.body.classList.contains('light')?'dark':'light'));

/* Search toggle */
const sw=document.getElementById('sw');
document.getElementById('s-btn')?.addEventListener('click',()=>{
  sw?.classList.toggle('open');
  if(sw?.classList.contains('open'))document.getElementById('s-inp')?.focus();
});
document.addEventListener('click',e=>{if(sw&&!sw.contains(e.target)&&e.target.id!=='s-btn')sw.classList.remove('open')});

/* Reveal */
new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');} });
},{threshold:.1}).observe||null;
const ro=new IntersectionObserver(ee=>{ee.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on')}})},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

/* Counter */
const co=new IntersectionObserver(ee=>{
  ee.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,end=parseInt(el.dataset.count),dur=1800;
    let cur=0;const step=end/(dur/16);
    const tick=()=>{cur=Math.min(cur+step,end);el.textContent=Math.floor(cur);if(cur<end)requestAnimationFrame(tick)};
    requestAnimationFrame(tick);co.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));

/* Skill bars */
const so=new IntersectionObserver(ee=>{
  ee.forEach(e=>{if(!e.isIntersecting)return;
    e.target.querySelectorAll('.skill-fill').forEach(b=>{b.style.width=b.dataset.w||'0%'});
    so.unobserve(e.target);});
},{threshold:.4});
document.querySelectorAll('.cv-preview').forEach(el=>so.observe(el));

/* Testimonials slider */
let ti=0;
const tt=document.getElementById('tt');
const perV=()=>window.innerWidth<768?1:window.innerWidth<1024?2:3;
const slideTo=i=>{
  if(!tt)return;
  const cards=tt.querySelectorAll('.testi-card'),max=Math.max(0,cards.length-perV());
  ti=Math.max(0,Math.min(i,max));
  const cw=(tt.parentElement.offsetWidth+22)/perV();
  tt.style.transform=`translateX(-${ti*cw}px)`;
};
document.getElementById('t-prev')?.addEventListener('click',()=>slideTo(ti-1));
document.getElementById('t-next')?.addEventListener('click',()=>slideTo(ti+1));
window.addEventListener('resize',()=>slideTo(ti));
setInterval(()=>{
  if(!tt)return;
  const max=tt.querySelectorAll('.testi-card').length-perV();
  slideTo(ti>=max?0:ti+1);
},5000);

/* FAQ */
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item'),body=item.querySelector('.faq-body'),isOpen=item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('active');i.querySelector('.faq-body').style.maxHeight=null});
    if(!isOpen){item.classList.add('active');body.style.maxHeight=body.scrollHeight+'px';}
  });
});

/* AI Tools filter + search */
const toolCards=document.querySelectorAll('.tool-card[data-cat]');
const filterBtns=document.querySelectorAll('.filter-btn');
let activeCat='all';
const filterTools=()=>{
  const q=(document.getElementById('tool-search')?.value||'').toLowerCase();
  toolCards.forEach(c=>{
    const cat=c.dataset.cat||'';
    const name=c.querySelector('.tool-name')?.textContent.toLowerCase()||'';
    const desc=c.querySelector('.tool-desc')?.textContent.toLowerCase()||'';
    const catMatch=activeCat==='all'||cat===activeCat;
    const searchMatch=!q||name.includes(q)||desc.includes(q)||cat.includes(q);
    c.style.display=catMatch&&searchMatch?'':'none';
  });
};
filterBtns.forEach(b=>{
  b.addEventListener('click',()=>{
    filterBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');activeCat=b.dataset.cat||'all';filterTools();
  });
});
document.getElementById('tool-search')?.addEventListener('input',filterTools);

/* Contact form — Web3Forms */
document.getElementById('contact-form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=e.target.querySelector('.submit-btn');
  btn.textContent='Sending…';btn.disabled=true;
  const data=new FormData(e.target);
  try{
    const r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data});
    const j=await r.json();
    if(j.success){e.target.style.display='none';document.getElementById('form-ok').style.display='block';}
    else{btn.textContent='Try Again';btn.disabled=false;}
  }catch{btn.textContent='Try Again';btn.disabled=false;}
});

/* Newsletter */
document.getElementById('nl-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const btn=e.target.querySelector('button'),inp=e.target.querySelector('input');
  btn.textContent='✓ Subscribed!';btn.style.cssText='background:#22C55E;box-shadow:0 4px 18px rgba(34,197,94,.4)';
  inp.value='';
  setTimeout(()=>{btn.textContent='Subscribe';btn.style.cssText=''},3000);
});

/* Back to top */
document.getElementById('top-f')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* Smooth anchors */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});
