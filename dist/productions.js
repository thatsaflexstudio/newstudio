'use strict';
const header=document.querySelector('#header');
const updateHeader=()=>header.classList.toggle('scrolled',scrollY>24);
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
document.querySelector('#year').textContent=new Date().getFullYear();
const menu=document.querySelector('#mobile-menu'),menuButton=document.querySelector('.menu-toggle');
menuButton.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');});
document.querySelector('.menu-close').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
matchMedia('(min-width:851px)').addEventListener('change',e=>{if(e.matches&&menu.open)menu.close();});
const number=(window.FLEX_CONFIG?.whatsapp||'').replace(/\D/g,'');
if(/^\d{8,15}$/.test(number)&&window.FLEX_CONTACT){document.querySelectorAll('[data-whatsapp]').forEach(a=>{a.href=window.FLEX_CONTACT.url(number,window.FLEX_CONTACT.messages[a.dataset.whatsapp]);});}
const tabs=[...document.querySelectorAll('[role="tab"]')];
const panels=[...document.querySelectorAll('.media-panel')];
let activePanel;
function showPanel(id){
  if(!['videos','audio'].includes(id))id='videos';
  if(activePanel===id)return;
  activePanel=id;
  tabs.forEach(tab=>{const selected=tab.dataset.panel===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  panels.forEach(panel=>{
    const selected=panel.id===id;panel.hidden=!selected;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',panel.id+'-tab');
    panel.querySelectorAll('iframe[data-src]').forEach(frame=>{
      if(selected){if(!frame.hasAttribute('src'))frame.src=frame.dataset.src;}
      else if(frame.hasAttribute('src'))frame.removeAttribute('src');
    });
  });
}
function choosePanel(id){if(location.hash!=='#'+id)history.pushState(null,'','#'+id);showPanel(id);}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>choosePanel(tab.dataset.panel));
  tab.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight')next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();tabs[next].focus();choosePanel(tabs[next].dataset.panel);
  });
});
const restorePanel=()=>showPanel(location.hash.slice(1));
addEventListener('popstate',restorePanel);addEventListener('hashchange',restorePanel);
restorePanel();document.querySelector('.media-tabs').hidden=false;
