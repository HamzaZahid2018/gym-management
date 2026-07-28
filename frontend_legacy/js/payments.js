/* p */

if(!requireAuth()){}
let allP=[],allC=[],markId=null,page=1;const PS=10;
async function init(){
  document.getElementById('sb').innerHTML=renderSidebar('payments');
  document.getElementById('tb').innerHTML=renderTopbar('Payments','Track and manage all member payments');
  try{await Promise.all([loadPayments(),loadCustomers()])}
  catch{showAlert(document.getElementById('alert-box'),'error','Failed to load data. Is the backend running on port 8000?')}
  document.getElementById('ls').style.display='none';document.getElementById('app').style.display='flex';
}
async function loadPayments(){
  let p=1,res=[],more=true;
  while(more){const d=await paymentService.getAll(p);const it=d.results||d;res=res.concat(it);more=!!d.next;p++;if(p>50)break}
  allP=res;updateCards();filter();
}
async function loadCustomers(){
  let p=1,res=[],more=true;
  while(more){const d=await userService.getAll(p);const it=d.results||d;res=res.concat(it);more=!!d.next;p++;if(p>20)break}
  allC=res;
  const sel=document.getElementById('f-cust');
  sel.innerHTML='<option value="">Select a customer…</option>'+allC.map(c=>`<option value="${c.id}">${c.first_name} ${c.last_name} (${c.email})</option>`).join('');
}
function updateCards(){
  const paid=allP.filter(p=>p.payment_status==='paid');
  const unpaid=allP.filter(p=>p.payment_status==='unpaid');
  const late=allP.filter(p=>p.payment_status==='late');
  const collectedAmt=paid.reduce((s,p)=>s+parseFloat(p.amount||0),0);
  const pendingAmt=(unpaid.length+late.length)*2000;
  const total=paid.length+unpaid.length+late.length;
  const rate=total>0?Math.round((paid.length/total)*100):0;

  document.getElementById('ps-paid').textContent=paid.length;
  document.getElementById('ps-unpaid').textContent=unpaid.length;
  document.getElementById('ps-late').textContent=late.length;
  document.getElementById('ps-rev').textContent=formatCurrency(collectedAmt);

  // update sub-labels
  const rateEl=document.getElementById('ps-rate');
  if(rateEl){
    rateEl.textContent=rate+'% collection rate';
    rateEl.className='stat-extra '+(rate>=80?'up':rate>=50?'':'down');
  }
  const pendEl=document.getElementById('ps-pending-amt');
  if(pendEl) pendEl.textContent='~'+formatCurrency(pendingAmt)+' pending';
}
function filter(){
  const q=document.getElementById('q').value.toLowerCase();
  const s=document.getElementById('sf').value;
  const m=document.getElementById('mf').value;
  const f=allP.filter(p=>{const cd=p.customer_details||{};const name=`${cd.first_name||''} ${cd.last_name||''}`.toLowerCase();const email=(cd.email||'').toLowerCase();return(!q||name.includes(q)||email.includes(q))&&(!s||p.payment_status===s)&&(!m||String(p.month)===m)});
  document.getElementById('pcount').textContent=`${f.length} payment${f.length!==1?'s':''} found`;
  page=1;renderTable(f);
}
function renderTable(data){
  const tb=document.getElementById('tbody');
  const sl=data.slice((page-1)*PS,page*PS);
  if(!sl.length){tb.innerHTML=`<tr><td colspan="7"><div class="empty"><div class="empty-ico">&#128179;</div><p>No payments found</p></div></td></tr>`;document.getElementById('pager').innerHTML='';return}
  tb.innerHTML=sl.map(p=>{
    const cd=p.customer_details||{};
    const overdue=p.is_overdue?`<div class="overdue-tag"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Overdue</div>`:'';
    const action=p.payment_status!=='paid'?`<button class="btn btn-success btn-sm" onclick="openMarkPaid(${p.id})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Mark Paid</button>`:`<span style="font-size:12px;color:var(--green);font-weight:600">&#10003; Paid</span>`;
    return`<tr><td><div style="display:flex;align-items:center;gap:10px"><div class="avatar">${getInitials(cd.first_name,cd.last_name)}</div><div><div style="font-weight:600">${cd.first_name||''} ${cd.last_name||''}</div><div style="font-size:11.5px;color:var(--t3)">${cd.email||''}</div></div></div></td><td style="color:var(--t2)">${monthName(p.month)} ${p.year}</td><td style="font-weight:700;color:var(--green)">${formatCurrency(p.amount)}</td><td style="color:var(--t2);text-transform:capitalize">${p.payment_method||'—'}</td><td>${badge(p.payment_status)}</td><td>${formatDate(p.due_date)}${overdue}</td><td>${action}</td></tr>`;
  }).join('');
  renderPager(data.length);
}
function renderPager(total){
  const pages=Math.ceil(total/PS);if(pages<=1){document.getElementById('pager').innerHTML='';return}
  let h=`<button class="pg-btn" onclick="goPage(${page-1})" ${page===1?'disabled':''}>&#8249;</button>`;
  for(let i=1;i<=pages;i++){if(i===1||i===pages||Math.abs(i-page)<=1)h+=`<button class="pg-btn ${i===page?'active':''}" onclick="goPage(${i})">${i}</button>`;else if(Math.abs(i-page)===2)h+=`<span style="color:var(--t3);padding:0 4px">&#8230;</span>`}
  h+=`<button class="pg-btn" onclick="goPage(${page+1})" ${page===pages?'disabled':''}>&#8250;</button>`;
  document.getElementById('pager').innerHTML=h;
}
function goPage(p){page=p;filter()}
function setPreset(btn,amt){
  document.getElementById('f-amt').value=amt;
  document.querySelectorAll('.fee-preset').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  // auto-set membership type note
  const notes={2000:'Monthly membership fee',5500:'Quarterly membership fee (3 months)',20000:'Annual membership fee (12 months)'};
  document.getElementById('f-notes').value=notes[amt]||'';
}

function openAdd(){
  document.getElementById('malert').innerHTML='';
  document.getElementById('f-cust').value='';
  document.getElementById('f-amt').value='2000';
  document.getElementById('f-notes').value='';
  document.getElementById('f-meth').value='cash';
  const now=new Date();
  document.getElementById('f-mo').value=now.getMonth()+1;
  document.getElementById('f-yr').value=now.getFullYear();
  document.querySelectorAll('.fee-preset').forEach(b=>b.classList.remove('active'));
  document.querySelector('.fee-preset[data-amt="2000"]')?.classList.add('active');
  openModal('pmodal');
}async function submitPayment(){
  const btn=document.getElementById('psub');const ab=document.getElementById('malert');
  const cust=document.getElementById('f-cust').value;const amt=document.getElementById('f-amt').value;const mo=document.getElementById('f-mo').value;const yr=document.getElementById('f-yr').value;
  if(!cust||!amt||!mo||!yr){showAlert(ab,'error','Customer, amount, month and year are required.');return}
  btn.disabled=true;btn.textContent='Saving…';
  try{
    await paymentService.create({customer:parseInt(cust),amount:parseFloat(amt),month:parseInt(mo),year:parseInt(yr),payment_method:document.getElementById('f-meth').value,notes:document.getElementById('f-notes').value,payment_status:'unpaid'});
    showAlert(document.getElementById('alert-box'),'success','Payment recorded successfully.');closeModal('pmodal');await loadPayments();
  }catch(err){const msg=Object.values(err?.data||{}).flat().join(' ')||'Failed to record payment.';showAlert(ab,'error',msg)}
  finally{btn.disabled=false;btn.textContent='Record Payment'}
}
function openMarkPaid(id){markId=id;document.getElementById('mp-meth').value='cash';document.getElementById('mp-notes').value='';document.getElementById('mpalert').innerHTML='';openModal('mpmodal')}
async function confirmPaid(){
  const btn=document.getElementById('mpbtn');btn.disabled=true;btn.textContent='Saving…';
  try{
    await paymentService.markPaid(markId,{payment_method:document.getElementById('mp-meth').value,notes:document.getElementById('mp-notes').value});
    showAlert(document.getElementById('alert-box'),'success','Payment marked as paid successfully.');closeModal('mpmodal');await loadPayments();
  }catch{showAlert(document.getElementById('mpalert'),'error','Failed to update payment.')}
  finally{btn.disabled=false;btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Confirm Paid'}
}
init();
