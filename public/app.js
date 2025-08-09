const apiBase = '';

let currentPage = 1;
let currentLimit = 10;
let currentLat = 0;
let currentLon = 0;
let totalPages = 1;

async function addSchool(evt){
  evt.preventDefault();
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();
  const latitude = Number(document.getElementById('latitude').value);
  const longitude = Number(document.getElementById('longitude').value);
  const resultEl = document.getElementById('add-result');
  resultEl.textContent = 'Submitting...';
  try{
    const res = await fetch(`${apiBase}/addSchool`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name,address,latitude,longitude})
    });
    const data = await res.json();
    if(!res.ok) throw new Error(JSON.stringify(data));
    resultEl.textContent = `Added with id ${data.id}`;
    (evt.target).reset();
  }catch(err){
    resultEl.textContent = 'Failed: ' + err.message;
  }
}

async function listSchools(evt){
  evt.preventDefault();
  const lat = Number(document.getElementById('user-lat').value);
  const lon = Number(document.getElementById('user-lon').value);
  currentLat = lat;
  currentLon = lon;
  currentPage = 1;
  await fetchSchools();
}

async function fetchSchools() {
  const tbody = document.getElementById('schools-body');
  const tableSection = document.getElementById('table-section');
  tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
  tableSection.style.display = 'block';
  
  try{
    const res = await fetch(`${apiBase}/listSchools?latitude=${currentLat}&longitude=${currentLon}&page=${currentPage}&limit=${currentLimit}`);
    const payload = await res.json();
    if(!res.ok) throw new Error(JSON.stringify(payload));
    
    const rows = payload.items || [];
    totalPages = Math.ceil(payload.total / currentLimit);
    
    tbody.innerHTML = rows.map((r,i)=>`<tr>
      <td>${(currentPage - 1) * currentLimit + i + 1}</td>
      <td title="${r.name}">${r.name}</td>
      <td title="${r.address}">${r.address}</td>
      <td>${r.latitude}</td>
      <td>${r.longitude}</td>
      <td>${r.distanceKm.toFixed(2)}</td>
    </tr>`).join('');
    
    updatePagination();
  }catch(err){
    tbody.innerHTML = `<tr><td colspan="6">Failed: ${err.message}</td></tr>`;
  }
}

function updatePagination() {
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function useGeolocation(){
  const latInput = document.getElementById('user-lat');
  const lonInput = document.getElementById('user-lon');
  if(!navigator.geolocation){
    alert('Geolocation not supported in this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition((pos)=>{
    latInput.value = pos.coords.latitude.toFixed(6);
    lonInput.value = pos.coords.longitude.toFixed(6);
  },(err)=>{
    alert('Failed to get location: '+ err.message);
  },{enableHighAccuracy:true,timeout:8000,maximumAge:0});
}

document.getElementById('add-form').addEventListener('submit', addSchool);
document.getElementById('list-form').addEventListener('submit', listSchools);
document.getElementById('use-location').addEventListener('click', useGeolocation);
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchSchools();
  }
});
document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchSchools();
  }
});


