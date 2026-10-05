(()=>{"use strict";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const textify=v=>Array.isArray(v)?v.map(textify).join(" "):v&&typeof v==="object"?Object.values(v).map(textify).join(" "):String(v??"");
const icon=name=>'<i data-lucide="'+esc(name)+'"></i>';
const toneIcon=t=>t==="danger"?"triangle-alert":t==="warn"?"circle-alert":t==="good"?"circle-check":"info";
function renderBlock(b){
  const title=b.title?'<h3 class="block-title">'+esc(b.title)+'</h3>':"";
  if(b.type==="text")return '<div class="block">'+title+'<p class="prose">'+esc(b.text)+'</p></div>';
  if(b.type==="cards")return '<div class="block">'+title+'<div class="cards">'+(b.items||[]).map(x=>'<article class="info-card"><div class="info-card-head"><span class="info-card-icon">'+icon(x.icon||"terminal")+'</span><h3>'+esc(x.title)+'</h3></div><p>'+esc(x.body||"")+'</p>'+(x.code?'<code>'+esc(x.code)+'</code>':"")+'</article>').join("")+'</div></div>';
  if(b.type==="callout")return '<div class="block callout '+esc(b.tone||"")+'"><div class="callout-icon">'+icon(toneIcon(b.tone))+'</div><div><strong>'+esc(b.title||"참고")+'</strong><div class="callout-body">'+esc(b.body||"")+'</div></div></div>';
  if(b.type==="code")return '<div class="block code-card"><div class="code-head"><span class="code-label">'+icon("terminal-square")+' '+esc(b.title||"Terminal")+'</span><button class="copy-btn" type="button" aria-label="코드 복사">'+icon("copy")+' <span>복사</span></button></div><pre>'+esc(b.code||"")+'</pre></div>';
  if(b.type==="table")return '<div class="block">'+title+'<div class="table-wrap"><table><thead><tr>'+(b.headers||[]).map(h=>'<th>'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+(b.rows||[]).map(r=>'<tr>'+r.map((c,i)=>'<td>'+(i===0?'<code>'+esc(c)+'</code>':esc(c))+'</td>').join("")+'</tr>').join("")+'</tbody></table></div></div>';
  if(b.type==="flow")return '<div class="block">'+title+'<div class="flow">'+(b.items||[]).map((x,i)=>'<div class="flow-node"><strong>'+esc(x.title)+'</strong><span>'+esc(x.body||"")+'</span></div>'+(i<b.items.length-1?'<span class="flow-arrow">'+icon("arrow-right")+'</span>':"")).join("")+'</div></div>';
  if(b.type==="steps")return '<div class="block">'+title+'<ol class="steps">'+(b.items||[]).map(x=>'<li><div><strong>'+esc(x.title)+'</strong><span>'+esc(x.body||"")+'</span></div></li>').join("")+'</ol></div>';
  if(b.type==="checklist")return '<div class="block">'+title+'<ul class="checklist">'+(b.items||[]).map(x=>'<li>'+icon("check")+'<span>'+esc(x)+'</span></li>').join("")+'</ul></div>';
  if(b.type==="details")return '<details class="block content-details" '+(b.open?"open":"")+'><summary>'+icon("chevron-right")+esc(b.title||"자세히")+'</summary><div class="details-body">'+(b.blocks||[]).map(renderBlock).join("")+'</div></details>';
  return "";
}
function renderSection(s){
  return '<section class="doc-section" id="'+esc(s.id)+'" data-search="'+esc(textify(s).toLowerCase())+'"><div class="section-head"><span class="section-icon">'+icon(s.icon||"terminal")+'</span><div><p class="section-kicker">'+esc(s.kicker||s.group||"Guide")+'</p><h2>'+esc(s.title)+'</h2></div>'+(s.summary?'<p class="section-summary">'+esc(s.summary)+'</p>':"")+'</div>'+(s.blocks||[]).map(renderBlock).join("")+'</section>';
}
function navHtml(groups,sections){
  return groups.map((g,gi)=>{
    const items=sections.filter(s=>s.group===g.title);
    return '<details class="nav-group" '+(gi<3?"open":"")+'><summary>'+icon("chevron-right")+' '+esc(g.title)+'</summary><nav class="nav" aria-label="'+esc(g.title)+'">'+items.map(s=>'<a href="#'+esc(s.id)+'" data-target="'+esc(s.id)+'">'+esc(s.title)+'</a>').join("")+'</nav></details>';
  }).join("");
}
async function init(){
  const manifestUrl=document.body.dataset.manifest;if(!manifestUrl)return;
  const manifest=await fetch(manifestUrl).then(r=>{if(!r.ok)throw new Error("manifest");return r.json()});
  document.documentElement.dataset.os=manifest.slug||"";
  const base=new URL(manifestUrl,location.href);
  const groups=manifest.groups?.length?manifest.groups:[{title:"문서",items:manifest.sections||[]}];
  const refs=groups.flatMap(g=>(g.items||[]).map(x=>({group:g.title,file:x.file})));
  const sections=await Promise.all(refs.map(async x=>Object.assign(await fetch(new URL(x.file,base)).then(r=>{if(!r.ok)throw new Error(x.file);return r.json()}),{group:x.group})));
  const facts=(manifest.facts||[]).map(x=>'<div class="fact"><span class="fact-label">'+icon(x.icon||"circle")+' '+esc(x.label)+'</span><span class="fact-value">'+esc(x.value)+'</span>'+(x.note?'<span class="fact-note">'+esc(x.note)+'</span>':"")+'</div>').join("");
  document.body.innerHTML=
    '<div class="nav-overlay" id="navOverlay"></div><div class="app-shell"><aside class="sidebar" id="sidebar"><div class="sidebar-inner"><div class="sidebar-head"><span class="brand-mark">'+icon(manifest.icon||"terminal")+'</span><div class="brand-copy"><div class="brand">'+esc(manifest.shortTitle||manifest.title)+'</div><div class="subtitle">'+esc(manifest.subtitle||"")+'</div></div><button class="icon-btn sidebar-close" id="navClose" type="button" aria-label="메뉴 닫기">'+icon("x")+'</button></div>'+
    '<div class="search-wrap"><span class="search-icon">'+icon("search")+'</span><input id="search" type="search" placeholder="명령어, 경로, 개념 검색" autocomplete="off" aria-label="문서 검색"><button id="clearSearch" type="button" aria-label="검색 초기화" hidden>'+icon("x")+'</button></div><div class="search-meta"><span id="searchStatus">전체 문서</span><span><kbd>/</kbd> 검색</span></div><div class="nav-scroll" id="nav">'+navHtml(groups,sections)+'</div></div></aside>'+
    '<div class="main"><header class="topbar"><div class="topbar-left"><button id="menuToggle" class="icon-btn" type="button" aria-label="문서 메뉴 열기" aria-controls="sidebar">'+icon("panel-left")+'</button><div class="topbar-title">'+icon(manifest.icon||"terminal")+'<span>CLI Guide /</span><strong>'+esc(manifest.slug==="macos"?"macOS":"Ubuntu")+'</strong></div></div><div class="topbar-actions"><div class="os-switch" aria-label="운영체제 선택"><a href="../macos/" class="'+(manifest.slug==="macos"?"current":"")+'">macOS</a><a href="../ubuntu/" class="'+(manifest.slug==="ubuntu"?"current":"")+'">Ubuntu</a></div><button id="themeToggle" class="icon-btn" type="button" aria-label="테마 변경">'+icon("sun-moon")+'</button></div></header>'+
    '<main class="content"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../">Project Hub</a>'+icon("chevron-right")+'<a href="../">CLI</a>'+icon("chevron-right")+'<span>'+esc(manifest.slug==="macos"?"macOS":"Ubuntu")+'</span></nav>'+
    '<section class="hero"><p class="eyebrow">'+icon(manifest.icon||"terminal")+esc(manifest.eyebrow||"Developer CLI")+'</p><h1>'+esc(manifest.title)+'</h1><p class="lead">'+esc(manifest.description)+'</p><div class="tags">'+(manifest.tags||[]).map(x=>'<span class="tag">'+esc(x)+'</span>').join("")+'</div>'+(facts?'<div class="fact-grid">'+facts+'</div>':"")+'</section><div class="empty" id="empty">검색 결과가 없습니다. 다른 명령어, 경로 또는 개념으로 검색해보세요.</div><div id="sections">'+sections.map(renderSection).join("")+'</div></main></div></div>';

  const root=document.documentElement,body=document.body;
  const savedTheme=localStorage.getItem("cli-theme");root.dataset.theme=savedTheme||"dark";
  if(localStorage.getItem("cli-nav-collapsed")==="1"&&innerWidth>1024)body.classList.add("nav-collapsed");
  const menu=document.getElementById("menuToggle"),close=document.getElementById("navClose"),overlay=document.getElementById("navOverlay");
  const mobile=()=>matchMedia("(max-width:64rem)").matches;
  function setNav(open){
    if(mobile()){body.classList.toggle("nav-open",open);menu.setAttribute("aria-expanded",String(open))}
    else{body.classList.toggle("nav-collapsed",!open);localStorage.setItem("cli-nav-collapsed",open?"0":"1");menu.setAttribute("aria-expanded",String(open))}
  }
  menu.onclick=()=>setNav(mobile()?!body.classList.contains("nav-open"):body.classList.contains("nav-collapsed"));
  close.onclick=()=>setNav(false);overlay.onclick=()=>setNav(false);
  document.getElementById("themeToggle").onclick=()=>{const t=root.dataset.theme==="light"?"dark":"light";root.dataset.theme=t;localStorage.setItem("cli-theme",t)};

  document.querySelectorAll(".copy-btn").forEach(btn=>btn.onclick=async()=>{
    const pre=btn.closest(".code-card").querySelector("pre"),label=btn.querySelector("span");
    try{await navigator.clipboard.writeText(pre.innerText);label.textContent="복사됨";setTimeout(()=>label.textContent="복사",900)}
    catch{label.textContent="실패";setTimeout(()=>label.textContent="복사",900)}
  });

  const input=document.getElementById("search"),clear=document.getElementById("clearSearch"),status=document.getElementById("searchStatus"),empty=document.getElementById("empty");
  const nodes=[...document.querySelectorAll(".doc-section")],links=[...document.querySelectorAll("#nav a")];
  function runSearch(){
    const terms=[...new Set(input.value.trim().toLowerCase().split(/\s+/).filter(Boolean))];
    let count=0;
    nodes.forEach(n=>{const ok=terms.every(t=>n.dataset.search.includes(t));n.hidden=!ok;if(ok)count++});
    links.forEach(a=>{const n=document.getElementById(a.dataset.target);a.hidden=!!n?.hidden});
    document.querySelectorAll(".nav-group").forEach(g=>{const visible=[...g.querySelectorAll(".nav a")].some(a=>!a.hidden);g.hidden=!visible;if(terms.length&&visible)g.open=true});
    status.textContent=terms.length?"검색 결과 "+count+"개":"전체 문서 "+nodes.length+"개";clear.hidden=!input.value;empty.style.display=count?"none":"block";
  }
  input.addEventListener("input",runSearch);clear.onclick=()=>{input.value="";runSearch();input.focus()};
  addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==input){e.preventDefault();input.focus()}if(e.key==="Escape"){if(input.value){input.value="";runSearch()}else if(mobile())setNav(false);input.blur()}});
  links.forEach(a=>a.addEventListener("click",()=>{if(mobile())setNav(false)}));

  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if(!visible)return;links.forEach(a=>a.classList.toggle("active",a.dataset.target===visible.target.id));
  },{rootMargin:"-18% 0px -68% 0px",threshold:[0,.2,1]});
  nodes.forEach(n=>observer.observe(n));
  window.lucide?.createIcons();
}
addEventListener("DOMContentLoaded",()=>init().catch(err=>{console.error(err);document.body.innerHTML='<main class="portal-main"><h1>데이터를 불러오지 못했습니다.</h1><p class="lead">GitHub Pages 또는 정적 서버에서 다시 열어 주세요.</p></main>'}));
})();