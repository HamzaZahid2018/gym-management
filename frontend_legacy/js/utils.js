/* u */

function requireAuth(){if(!localStorage.getItem('access_token')){window.location.href='login.html';return false}return true}
function logout(){localStorage.clear();window.location.href='login.html'}
function getInitials(f,l){return(((f||'')[0]||'')+((l||'')[0]||'')).toUpperCase()||'?'}
function formatDate(d){if(!d)return'—';return new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}
function formatCurrency(v){return'Rs '+parseFloat(v||0).toLocaleString('en-PK',{minimumFractionDigits:0,maximumFractionDigits:0})}
function monthName(n){return['','January','February','March','April','May','June','July','August','September','October','November','December'][n]||''}
function badge(s){return`<span class="badge ${s}">${s}</span>`}
function todayStr(){return new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
function showAlert(el,type,msg){
  const icons={success:'&#10003;',error:'&#10007;',warning:'&#9888;',info:'&#8505;'};
  el.innerHTML=`<div class="alert alert-${type}"><span>${icons[type]||''}</span><span>${msg}</span><button class="alert-x" onclick="this.parentElement.remove()">&#215;</button></div>`;
  setTimeout(()=>el.querySelector('.alert')?.remove(),5000);
}
function openModal(id){document.getElementById(id)?.classList.add('open')}
function closeModal(id){document.getElementById(id)?.classList.remove('open')}
function openConfirm(title,msg,onOk){
  let ov=document.getElementById('confirm-ov');
  if(!ov){ov=document.createElement('div');ov.id='confirm-ov';ov.className='confirm-ov';
    ov.innerHTML=`<div class="confirm-box"><div class="confirm-ico">&#128465;&#65039;</div><div class="confirm-title" id="c-title"></div><div class="confirm-msg" id="c-msg"></div><div class="confirm-btns"><button class="btn btn-secondary" onclick="closeConfirm()">Cancel</button><button class="btn btn-danger" id="c-ok">Delete</button></div></div>`;
    document.body.appendChild(ov);}
  document.getElementById('c-title').textContent=title;
  document.getElementById('c-msg').textContent=msg;
  document.getElementById('c-ok').onclick=()=>{closeConfirm();onOk()};
  ov.classList.add('open');
}
function closeConfirm(){document.getElementById('confirm-ov')?.classList.remove('open')}
function renderSidebar(active){
  const u=JSON.parse(localStorage.getItem('user')||'{}');
  const ini=getInitials(u.first_name,u.last_name);
  const nav=[
    {id:'dashboard',href:'dashboard.html',label:'Dashboard',svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`},
    {id:'customers',href:'customers.html',label:'Members',svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`},
    {id:'payments',href:'payments.html',label:'Payments',svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`},
  ];
  return`<div class="sb-overlay" id="sb-overlay" onclick="toggleSidebar()"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sb-logo">
      <div class="sb-logo-icon">💪</div>
      <div><div class="sb-logo-name">Fitness Fusion</div><div class="sb-logo-tag">Gym Management</div></div>
    </div>
    <nav class="sb-nav">
      <div class="sb-section">Navigation</div>
      ${nav.map(n=>`<a href="${n.href}" class="sb-item ${active===n.id?'active':''}"><span class="sb-icon">${n.svg}</span>${n.label}</a>`).join('')}
    </nav>
    <div class="sb-footer">
      <div class="sb-user">
        <div class="sb-avatar">${ini}</div>
        <div style="min-width:0"><div class="sb-uname">${u.first_name||'Owner'} ${u.last_name||''}</div><div class="sb-uemail">${u.email||'admin@fitnessfusion.com'}</div></div>
      </div>
      <button class="sb-logout" onclick="logout()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    </div>
  </aside>`;
}
function renderTopbar(title,sub){
  return`<div class="topbar">
    <div class="topbar-left">
      <button class="menu-btn" onclick="toggleSidebar()">&#9776;</button>
      <div><div class="topbar-title">${title}</div>${sub?`<div class="topbar-sub">${sub}</div>`:''}</div>
    </div>
    <div class="topbar-right"><div class="topbar-date">${todayStr()}</div></div>
  </div>`;
}
function toggleSidebar(){
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sb-overlay')?.classList.toggle('open');
}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-ov'))e.target.classList.remove('open')});
