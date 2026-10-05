(()=>{"use strict";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const code=s=>'<code>'+esc(s)+'</code>';
const textify=v=>Array.isArray(v)?v.join(" "):typeof v==="object"?JSON.stringify(v):String(v??"");
function icon(name){return '<i data-lucide="'+name+'"></i>'}
function renderBlock(b){
 if(b.type==="text")return '<div class="block"><p>'+esc(b.text)+'</p></div>';
 if(b.type==="tags")return '<div class="block tags">'+b.items.map(x=>'<span class="tag">'+esc(x)+'</span>').join("")+'</div>';
 if(b.type==="callout")return '<div class="block callout '+esc(b.tone||"")+'"><strong>'+esc(b.title||"참고")+'</strong><div>'+esc(b.body)+'</div></div>';
 if(b.type==="code")return '<div class="block code-card"><div class="copy-row"><button class="copy-btn" type="button">'+icon("copy")+' 복사</button></div><pre>'+esc(b.code)+'</pre></div>';
 if(b.type==="table")return '<div class="block table-wrap"><table><thead><tr>'+b.headers.map(h=>'<th>'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+b.rows.map(r=>'<tr>'+r.map((c,i)=>'<td>'+(i===0?code(c):esc(c))+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>';
 return "";
}
function renderSection(s){return '<section class="doc-section" id="'+esc(s.id)+'" data-search="'+esc(textify(s))+'"><div class="section-head">'+icon(s.icon||"terminal")+'<h2>'+esc(s.title)+'</h2></div>'+(s.blocks||[]).map(renderBlock).join("")+'</section>'}
async function init(){
 const manifestUrl=document.body.dataset.manifest;if(!manifestUrl)return;
 const manifest=await fetch(manifestUrl).then(r=>{if(!r.ok)throw new Error("manifest");return r.json()});
 const base=new URL(manifestUrl,location.href);const sections=await Promise.all(manifest.sections.map(x=>fetch(new URL(x.file,base)).then(r=>r.json())));
 document.body.innerHTML='<div class="app-shell"><aside class="sidebar"><div class="brand-row">'+icon(manifest.icon||"terminal")+'<div class="brand">'+esc(manifest.shortTitle||manifest.title)+'</div></div><div class="subtitle">'+esc(manifest.subtitle||"")+'</div><div class="search-wrap">'+icon("search")+'<input id="search" type="search" placeholder="명령어, 경로, 개념 검색" autocomplete="off"><button id="clearSearch" title="검색 초기화">'+icon("x")+'</button></div><div class="search-status" id="searchStatus">전체 문서 표시 중</div><nav class="nav" id="nav">'+sections.map(s=>'<a href="#'+esc(s.id)+'">'+esc(s.title)+'</a>').join("")+'</nav></aside><main class="content"><div class="topbar"><a class="back-link" href="../">'+icon("arrow-left")+' OS 선택</a><div class="os-switch"><a href="../macos/" class="'+(manifest.slug==="macos"?"current":"")+'">macOS</a><a href="../ubuntu/" class="'+(manifest.slug==="ubuntu"?"current":"")+'">Ubuntu</a><button id="themeToggle" class="icon-btn" title="테마 변경">'+icon("sun-moon")+'</button></div></div><header class="hero"><p class="eyebrow">'+esc(manifest.eyebrow||"Developer CLI")+'</p><h1>'+esc(manifest.title)+'</h1><p class="lead">'+esc(manifest.description)+'</p><div class="tags">'+(manifest.tags||[]).map(x=>'<span class="tag">'+esc(x)+'</span>').join("")+'</div></header><div class="empty" id="empty">검색 결과가 없습니다.</div><div id="sections">'+sections.map(renderSection).join("")+'</div></main></div>';
 const root=document.documentElement, saved=localStorage.getItem("cli-theme");if(saved)root.dataset.theme=saved;
 document.getElementById("themeToggle").onclick=()=>{const t=root.dataset.theme==="light"?"dark":"light";root.dataset.theme=t;localStorage.setItem("cli-theme",t)};
 document.querySelectorAll(".copy-btn").forEach(btn=>btn.onclick=async()=>{const value=btn.closest(".code-card").querySelector("pre").innerText;try{await navigator.clipboard.writeText(value);btn.lastChild.textContent=" 복사됨";setTimeout(()=>btn.lastChild.textContent=" 복사",900)}catch{}});
 const input=document.getElementById("search"),status=document.getElementById("searchStatus"),empty=document.getElementById("empty"),nodes=[...document.querySelectorAll(".doc-section")],links=[...document.querySelectorAll("#nav a")];
 function run(){const terms=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let count=0;nodes.forEach(n=>{const ok=terms.every(t=>n.dataset.search.toLowerCase().includes(t));n.hidden=!ok;if(ok)count++});links.forEach(a=>{const n=document.querySelector(a.getAttribute("href"));a.hidden=!!n?.hidden});status.textContent=terms.length?"검색 결과: "+count+"개 섹션":"전체 문서 표시 중";empty.style.display=count?"none":"block"}
 input.addEventListener("input",run);document.getElementById("clearSearch").onclick=()=>{input.value="";run();input.focus()};addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==input){e.preventDefault();input.focus()}if(e.key==="Escape"){input.value="";run();input.blur()}});
 window.lucide?.createIcons();
}
addEventListener("DOMContentLoaded",()=>init().catch(()=>{document.body.innerHTML='<main class="portal-main"><h1>데이터를 불러오지 못했습니다.</h1><p class="lead">정적 서버 또는 GitHub Pages에서 다시 열어 주세요.</p></main>'}));
})();