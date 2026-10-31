/* Individual cafe storefront presentation. Public text uses textContent only. */
(function(root){
'use strict';
const DAYS=[['mon','월'],['tue','화'],['wed','수'],['thu','목'],['fri','금'],['sat','토'],['sun','일']];
const FEATURES=[['wifi','와이파이'],['parking','주차'],['pets','반려동물 동반'],['takeout','포장'],['terrace','테라스'],['outlets','콘센트'],['accessible','휠체어 접근'],['delivery','배달']];
const THEMES=['sand','forest','plum','ocean'];
const $=id=>document.getElementById(id);
const text=(v,max=160)=>typeof v==='string'?v.slice(0,max):'';
function read(value){
 try{const obj=typeof value==='string'?JSON.parse(value||'{}'):value||{};
  if(!obj||typeof obj!=='object'||Array.isArray(obj))return {};
  return obj;
 }catch{return {};}
}
function el(tag,content,className){
 const node=document.createElement(tag);
 if(content!==undefined)node.textContent=String(content);
 if(className)node.className=className;
 return node;
}
function applyTheme(target,profile){target.dataset.cafeTheme=THEMES.includes(profile?.theme)?profile.theme:'sand';}
function render(target,raw){
 if(!target)return;
 const p=read(raw);target.replaceChildren();
 const tagline=text(p.tagline,120).trim();
 if(tagline)target.append(el('p',tagline,'cafe-tagline'));
 const selected=Array.isArray(p.amenities)?p.amenities.filter(x=>FEATURES.some(f=>f[0]===x)):[];
 if(selected.length){const section=el('section',undefined,'cafe-extra-section');section.append(el('h3','편의시설'));
  const tags=el('div',undefined,'cafe-feature-tags');
  for(const id of selected){const name=FEATURES.find(f=>f[0]===id);if(name)tags.append(el('span',name[1],'cafe-feature-tag'))}
  section.append(tags);target.append(section);
 }
 const hours=p.hours&&typeof p.hours==='object'&&!Array.isArray(p.hours)?p.hours:{};
 const any=DAYS.some(([day])=>hours[day]);
 if(any){const section=el('section',undefined,'cafe-extra-section');section.append(el('h3','영업시간'));const table=el('div',undefined,'cafe-hours');
  for(const [day,label] of DAYS){const item=hours[day];if(!item)continue;
   const row=el('div',undefined,'cafe-hours-row');row.append(el('span',label),el('span',item.closed?'휴무':text(item.open,5)+' – '+text(item.close,5)));table.append(row)}
  section.append(table);target.append(section);
 }
 const menu=Array.isArray(p.menu)?p.menu.slice(0,8).filter(m=>m&&typeof m.name==='string'&&m.name.trim()):[];
 if(menu.length){const section=el('section',undefined,'cafe-extra-section');section.append(el('h3','대표 메뉴'));const grid=el('div',undefined,'cafe-menu-grid');
  for(const item of menu){const card=el('div',undefined,'cafe-menu-item');const title=el('strong',text(item.name,60));card.append(title);
   if(item.price)card.append(el('span',text(item.price,32),'cafe-menu-price'));
   if(item.detail)card.append(el('p',text(item.detail,160)));
   grid.append(card)}
  section.append(grid);target.append(section);
 }
 const contact=[];
 if(p.phone&&/^[+\d\s().-]{1,32}$/.test(p.phone))contact.push(['전화',text(p.phone,32),'tel:'+p.phone.replace(/[^\d+]/g,'')]);
 if(typeof p.website==='string'){
  try{const u=new URL(p.website);if(u.protocol==='https:'&&u.username===''&&u.password==='')contact.push(['홈페이지','매장 웹사이트 방문',u.href]);}catch{}
 }
 if(contact.length){const section=el('section',undefined,'cafe-extra-section');section.append(el('h3','방문·문의'));const links=el('div',undefined,'cafe-contact');
  for(const [label,name,href] of contact){const a=el('a',name,'cafe-contact-link');a.href=href;
   if(label==='홈페이지'){a.target='_blank';a.rel='noopener noreferrer'}
   a.setAttribute('aria-label',label+': '+name);links.append(a)}
  section.append(links);target.append(section);
 }
}
function initEditor(onChange){
 const host=$('decorEditor');if(!host)return null;
 const changed=()=>{if(typeof onChange==='function')onChange()};
 const rows=$('decorMenuRows');
 const clock=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
 function addMenu(item={}){
  if(rows.children.length>=8)return;
  const wrapper=el('div',undefined,'cafe-menu-editor-row');
  for(const [key,label,max] of [['name','메뉴명',60],['detail','메뉴 소개',160],['price','가격 표시',32]]){
   const field=el('label',label);const input=el('input');input.dataset.menuField=key;input.maxLength=max;input.value=text(item[key],max);field.append(input);wrapper.append(field)}
  const remove=el('button','이 메뉴 삭제','cafe-button');remove.type='button';remove.onclick=()=>{wrapper.remove();changed()};
  wrapper.append(remove);rows.append(wrapper);
  wrapper.addEventListener('input',changed);
 }
 $('decorAddMenu').addEventListener('click',()=>{addMenu();changed()});
 host.addEventListener('input',changed);
 host.addEventListener('change',changed);
 function load(value){
  const p=read(value);
  $('decorTagline').value=text(p.tagline,120);
  $('decorPhone').value=text(p.phone,32);
  $('decorWebsite').value=text(p.website,300);
  $('decorTheme').value=THEMES.includes(p.theme)?p.theme:'sand';
  const selected=Array.isArray(p.amenities)?p.amenities:[];
  host.querySelectorAll('[data-amenity]').forEach(c=>{c.checked=selected.includes(c.value)});
  const hours=p.hours&&typeof p.hours==='object'?p.hours:{};
  DAYS.forEach(([day])=>{
   const row=host.querySelector('[data-day="'+day+'"]'),item=hours[day];
   row.querySelector('[data-hour-closed]').checked=!!item?.closed;
   row.querySelector('[data-hour-open]').value=clock.test(item?.open||'')?item.open:'09:00';
   row.querySelector('[data-hour-close]').value=clock.test(item?.close||'')?item.close:'18:00';
   // Blank old schedules remain unpublished until explicitly configured.
   row.querySelector('[data-hour-enabled]').checked=!!item;
  });
  rows.replaceChildren();
  (Array.isArray(p.menu)?p.menu:[]).slice(0,8).forEach(addMenu);
 }
 function collect(){
  const hours={};
  DAYS.forEach(([day])=>{
   const row=host.querySelector('[data-day="'+day+'"]');if(!row.querySelector('[data-hour-enabled]').checked)return;
   const closed=row.querySelector('[data-hour-closed]').checked;
   hours[day]={closed,open:closed?'':row.querySelector('[data-hour-open]').value,close:closed?'':row.querySelector('[data-hour-close]').value};
  });
  const menu=[...rows.children].map(row=>{
   const val=k=>row.querySelector('[data-menu-field="'+k+'"]').value.trim();
   return {name:val('name'),detail:val('detail'),price:val('price')};
  }).filter(item=>item.name||item.detail||item.price);
  return {tagline:$('decorTagline').value.trim(),phone:$('decorPhone').value.trim(),
   website:$('decorWebsite').value.trim(),theme:$('decorTheme').value,
   amenities:[...host.querySelectorAll('[data-amenity]:checked')].map(x=>x.value),hours,menu};
 }
 return {load,collect};
}
root.TiloCafeDecor=Object.freeze({read,render,applyTheme,initEditor,DAYS,FEATURES});
})(window);
