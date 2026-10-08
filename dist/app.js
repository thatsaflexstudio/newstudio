'use strict';
const config = window.FLEX_CONFIG || {};
const contact = window.FLEX_CONTACT;
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const safeUrl = value => { try { const u = new URL(value, location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
const whatsapp = (config.whatsapp || '').replace(/\D/g, '');
const whatsappReady = /^\d{8,15}$/.test(whatsapp);
const header = $('#header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 24), {passive:true});
header.classList.toggle('scrolled', scrollY > 24);
$('#year').textContent = new Date().getFullYear();
const menu = $('#mobile-menu'), menuButton = $('.menu-toggle');
menuButton.addEventListener('click', () => {menu.showModal();document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');});
function closeMenu(){menu.close();}
$('.menu-close').addEventListener('click', closeMenu);
menu.addEventListener('close', () => {document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');});
$$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 851px)').addEventListener('change', e => {if(e.matches && menu.open) closeMenu();});
if ('IntersectionObserver' in window) {
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-motion');
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}), {threshold:.08});
    $$('.reveal').forEach(el=>revealObserver.observe(el));
  }
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){$$('.desktop-nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}}), {rootMargin:'-20% 0px -60% 0px'});
  $$('main > section[id]').forEach(el=>navObserver.observe(el));
}
if(whatsappReady){
  $$('[data-whatsapp]').forEach(a=>{
    const kind = a.dataset.whatsapp;
    a.href = contact.url(whatsapp, contact.messages[kind] || contact.messages.general);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', kind === 'general' ? 'Contact Fex Fenix on WhatsApp' : kind === 'beats' || kind === 'custom' ? 'Ask Fex Fenix about production on WhatsApp' : 'Book via WhatsApp');
  });
  $('.contact-availability').textContent='Let’s talk about your sound, your session and availability. Message us directly on WhatsApp.';
  $('#inquiry-help').textContent='Prefer to send the details first? This form is optional. Only name and service are required. Review your message in WhatsApp, then tap Send.';
} else if(config.email){
  $('#inquiry-help').textContent='Your inquiry will open in your email app for you to review and send.';
} else {
  $('#inquiry-help').textContent='Prepare your inquiry to copy and send to the studio on Instagram.';
}
const now = new Date();
const today = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santo_Domingo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
$('input[name="date"]').min=today;
$$('[data-service]').forEach(a=>a.addEventListener('click',()=>{$('#service').value=a.dataset.service;}));
const form=$('#inquiry-form'), inquiryDialog=$('#inquiry-dialog');
form.addEventListener('submit', event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  const message=contact.inquiry(data);
  if(whatsappReady){
    const url=contact.url(whatsapp,message);
    window.open(url,'_blank','noopener,noreferrer');
    $('#form-status').textContent='Review your inquiry in WhatsApp and tap Send. Your session is not reserved yet.';
    const retry=$('#whatsapp-retry');retry.href=url;retry.hidden=false;
  }
  else if(config.email){location.href=`mailto:${encodeURIComponent(config.email)}?subject=${encodeURIComponent('Studio inquiry — '+data.get('name'))}&body=${encodeURIComponent(message)}`;$('#form-status').textContent='Your email app will open with the inquiry. Review it and send to contact the studio.';}
  else {$('#inquiry-preview').value=message;$('#copy-status').textContent='';inquiryDialog.showModal();}
});
$('.dialog-close').addEventListener('click',()=>inquiryDialog.close());
$('#copy-inquiry').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('#inquiry-preview').value);$('#copy-status').textContent='Copied. Open Instagram and paste this into a message to the studio.';}
  catch{$('#inquiry-preview').focus();$('#inquiry-preview').select();$('#copy-status').textContent='Select and copy the inquiry above, then paste it into an Instagram message.';}
});
const newsletter=$('#newsletter-form'), newsletterStatus=$('#newsletter-status');
if(config.newsletterEndpoint && safeUrl(config.newsletterEndpoint)){
  $$('input,button',newsletter).forEach(el=>el.disabled=false);
  newsletterStatus.textContent='Subscribe for That’s A Flex updates. Unsubscribe at any time.';
  newsletter.addEventListener('submit',async event=>{
    event.preventDefault();if(!newsletter.reportValidity())return;
    const button=$('button',newsletter);button.disabled=true;newsletterStatus.textContent='Joining the list…';
    try{const response=await fetch(safeUrl(config.newsletterEndpoint),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:$('#newsletter-email').value.trim()})});if(!response.ok)throw new Error('Signup failed');newsletterStatus.textContent='You’re on the list. Watch your inbox for updates.';newsletter.reset();}
    catch{newsletterStatus.textContent='We couldn’t complete your signup. Please try again later.';}
    finally{button.disabled=false;}
  });
} else {newsletter.addEventListener('submit',event=>event.preventDefault());}
const storeUrl=safeUrl(config.beatStoreUrl);
if(config.beatStoreUrl && storeUrl){
  const link=$('#listen-link');link.href=storeUrl;link.target='_blank';link.rel='noopener noreferrer';
  const cta=$('.button',$('#beat-access'));cta.href=storeUrl;cta.firstChild.textContent='Listen to the beats ';
  $('.eyebrow',$('#beat-access')).textContent='ORIGINAL PRODUCTION / FEX FENIX';
  $('p:not(.eyebrow)',$('#beat-access')).textContent='Find the sound for your next record.';
  $('div > span',$('#beat-access')).textContent='Listen and explore licensing through our external beat platform.';
}
// Media slots remain brand artwork until approved photography and video are supplied.
const media=config.media||{};
function mediaImage(src,alt,className){const img=document.createElement('img');img.src=safeUrl(src);img.alt=alt;img.className=className;img.loading='lazy';return img;}
if(media.heroImage && safeUrl(media.heroImage)){
  const art=$('.hero-art');art.replaceChildren(mediaImage(media.heroImage,'','actual-hero-image'));$('img',art).loading='eager';
}
if(media.heroVideo && safeUrl(media.heroVideo) && !matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(max-width: 560px)').matches){
  const video=document.createElement('video');video.src=safeUrl(media.heroVideo);video.muted=true;video.loop=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';video.className='actual-hero-video';if(media.heroImage)video.poster=safeUrl(media.heroImage);$('.hero-art').append(video);video.play().catch(()=>{});
}
if(media.fexPortrait && safeUrl(media.fexPortrait)){
  const frame=$('#fex-media');
  const portrait=mediaImage(media.fexPortrait,media.fexPortraitAlt||'Fex Fenix, producer and engineer','');
  if(media.fexPortraitSrcset)portrait.srcset=media.fexPortraitSrcset;
  if(media.fexPortraitSizes)portrait.sizes=media.fexPortraitSizes;
  if(media.fexPortraitWidth)portrait.width=media.fexPortraitWidth;
  if(media.fexPortraitHeight)portrait.height=media.fexPortraitHeight;
  $('img:not(.fex-signature)',frame).replaceWith(portrait);
  frame.classList.add('has-portrait');
}
if(media.studioImages?.length){
  const item=media.studioImages[0];
  if(safeUrl(item.src)){
    const frame=$('#studio-media');
    $('.studio-grid-art',frame)?.remove();$('.studio-frame-logo',frame)?.remove();
    const photo=mediaImage(item.src,item.alt||'That’s A Flex Studio','actual-studio-image');
    if(item.srcset)photo.srcset=item.srcset;
    if(item.sizes)photo.sizes=item.sizes;
    if(item.width)photo.width=item.width;
    if(item.height)photo.height=item.height;
    const previous=$('.actual-studio-image',frame);
    if(previous)previous.replaceWith(photo);else frame.prepend(photo);
    frame.classList.add('has-photo');
  }
}
(media.instagramPosts||[]).forEach(post=>{if(!safeUrl(post.url)||!safeUrl(post.image))return;const a=document.createElement('a');a.href=safeUrl(post.url);a.target='_blank';a.rel='noopener noreferrer';a.append(mediaImage(post.image,post.alt||'View this studio post on Instagram',''));$('#instagram-posts').append(a);});
if(config.featuredBeats?.length){
  const grid=$('#beat-grid');grid.replaceChildren();
  config.featuredBeats.slice(0,4).forEach(beat=>{const article=document.createElement('article');article.className='real-beat';if(beat.artwork)article.append(mediaImage(beat.artwork,beat.name+' artwork','real-beat-art'));const heading=document.createElement('h3');heading.textContent=beat.name;article.append(heading);const mood=document.createElement('p');mood.textContent=beat.mood||'';article.append(mood);const description=document.createElement('p');description.textContent=beat.description||'';article.append(description);if(beat.preview&&safeUrl(beat.preview)){const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=safeUrl(beat.preview);audio.setAttribute('aria-label','Preview '+beat.name);article.append(audio);}if(beat.url&&safeUrl(beat.url)){const link=document.createElement('a');link.className='inline-link';link.href=safeUrl(beat.url);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Listen & license ↗';article.append(link);}grid.append(article);});
}

// Collections load on demand. Only one playlist is active at a time.
const playlistPanels=$$('.playlist-panel');
const playlistTriggers=$$('[data-playlist-open]');
let playlistOpener;
function closePlaylist(panel){
  $('iframe',panel).removeAttribute('src');panel.hidden=true;
  playlistTriggers.filter(t=>t.getAttribute('aria-controls')===panel.id).forEach(t=>t.setAttribute('aria-expanded','false'));
}
function openPlaylist(panel,opener,fromSwitcher=false){
  playlistOpener=opener;
  playlistPanels.filter(p=>p!==panel&&!p.hidden).forEach(closePlaylist);
  panel.hidden=false;
  playlistTriggers.filter(t=>t.getAttribute('aria-controls')===panel.id).forEach(t=>t.setAttribute('aria-expanded','true'));
  const selector=$('[data-playlist-switch]',panel);selector.value=panel.id;
  const frame=$('iframe',panel);if(!frame.hasAttribute('src'))frame.src=frame.dataset.src;
  (fromSwitcher?selector:$('h3',panel)).focus({preventScroll:true});
  panel.scrollIntoView({behavior:fromSwitcher||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
playlistTriggers.forEach(trigger=>trigger.addEventListener('click',event=>{
  const panel=playlistPanels.find(p=>p.id===trigger.getAttribute('aria-controls'));
  if(!panel)return;
  event.preventDefault();openPlaylist(panel,trigger);
}));
playlistPanels.forEach(panel=>{
  $('[data-playlist-switch]',panel).addEventListener('change',event=>{
    const next=playlistPanels.find(p=>p.id===event.target.value);
    if(!next||next===panel)return;
    const opener=playlistTriggers.find(t=>t.classList.contains('collection-play')&&t.getAttribute('aria-controls')===next.id)||playlistTriggers.find(t=>t.getAttribute('aria-controls')===next.id);
    openPlaylist(next,opener,true);
  });
  $('.playlist-close',panel).addEventListener('click',()=>{
    closePlaylist(panel);
    if(playlistOpener){playlistOpener.focus({preventScroll:true});playlistOpener.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});}
  });
});
