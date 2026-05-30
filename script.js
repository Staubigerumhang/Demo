const IMG = {
  concert: 'first.png',
  festival: 'second.png',
  sport: 'third.png'
};

const EVENTS = [
  { id:1, title:'Рок Концерт', cat:'concert', tag:'Концерт', date:'25 апреля', place:'Дворец Спорта',
    desc:'Грандиозный рок-концерт с лучшими группами страны. Яркое шоу, мощный звук и незабываемая атмосфера!' },
  { id:2, title:'Летний Фестиваль', cat:'festival', tag:'Фестиваль', date:'30 апреля', place:'Центральный парк',
    desc:'Многодневный open-air фестиваль с едой, музыкой и развлечениями для всей семьи!' },
  { id:3, title:'Футбольный матч', cat:'sport', tag:'Спорт', date:'28 апреля', place:'Кaraganda Арена',
    desc:'Футбольный матч на «Kараганда Арене». Интересная игра и отличная атмосфера!' }
];

let activeFilter = 'all';

function cardHTML(ev) {
  return `<div class="card" data-cat="${ev.cat}">
    <img src="${IMG[ev.cat]}" alt="${ev.title}">
    <div class="card-body">
      <span class="tag">${ev.tag}</span>
      <h3>${ev.title}</h3>
      <div class="meta">📅 ${ev.date} &nbsp;|&nbsp; 📍 ${ev.place}</div>
      <button class="btn-red" onclick="openModal(${ev.id})">Участвовать</button>
    </div>
  </div>`;
}

function renderGrid(id, filter = 'all') {
  const items = filter === 'all' ? EVENTS : EVENTS.filter(e => e.cat === filter);
  document.getElementById(id).innerHTML = items.map(cardHTML).join('');
}

function filterCards(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid('grid-home', cat);
  renderGrid('grid-events', cat);
}

function openModal(id) {
  const ev = EVENTS.find(e => e.id === id);
  document.getElementById('m-img').src = IMG[ev.cat];
  document.getElementById('m-img').alt = ev.title;
  document.getElementById('m-tag').textContent = ev.tag;
  document.getElementById('m-title').textContent = ev.title;
  document.getElementById('m-date').textContent = '📅 ' + ev.date;
  document.getElementById('m-place').textContent = '📍 ' + ev.place;
  document.getElementById('m-desc').textContent = ev.desc;
  document.getElementById('overlay').classList.add('open');
}

function closeModal() { document.getElementById('overlay').classList.remove('open'); }

document.getElementById('overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('overlay')) closeModal();
});

function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo(0, 0);
}

function goToBooking() {
  closeModal();
  showPage('booking', document.querySelector('nav button:nth-child(3)'));
}

// SEATS
const ROWS = 5, COLS = 8, PRICE = 2000;
const TAKEN_IDX = [2,5,10,19,27,31];
const ROW_LABELS = ['A','B','C','D','E'];

function buildSeats() {
  let html = '';
  for (let r = 0; r < ROWS; r++) {
    html += `<div class="row-wrap"><div class="row-label">${ROW_LABELS[r]}</div><div class="seats-row">`;
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const cls = TAKEN_IDX.includes(idx) ? ' taken' : '';
      html += `<button class="seat${cls}" data-idx="${idx}" onclick="toggleSeat(this)"></button>`;
    }
    html += '</div></div>';
  }
  document.getElementById('seats-grid').innerHTML = html;
}

function toggleSeat(el) {
  if (el.classList.contains('taken')) return;
  el.classList.toggle('sel');
  updateSummary();
}

function updateSummary() {
  const n = document.querySelectorAll('.seat.sel').length;
  document.getElementById('seat-count').innerHTML = `<span>${n}</span>`;
  document.getElementById('seat-total').textContent = (n * PRICE).toLocaleString('ru-RU');
}

function confirmBooking() {
  const name = document.getElementById('booking-name').value.trim();
  const sel = document.querySelectorAll('.seat.sel');
  if (!name) { document.getElementById('booking-name').style.borderColor = 'var(--red)'; document.getElementById('booking-name').focus(); return; }
  if (!sel.length) { alert('Пожалуйста, выберите хотя бы одно место.'); return; }
  const n = sel.length;
  sel.forEach(s => { s.classList.remove('sel'); s.classList.add('taken'); });
  updateSummary();
  document.getElementById('booking-name').value = '';
  document.getElementById('booking-name').style.borderColor = '';
  const msg = document.getElementById('success-msg');
  msg.classList.add('show');
  document.getElementById('success-detail').textContent =
    `Спасибо, ${name}! Ваши ${n} мест(а) забронированы на сумму ${(n * PRICE).toLocaleString('ru-RU')} тг.`;
  setTimeout(() => msg.classList.remove('show'), 6000);
}

// Init
renderGrid('grid-home');
renderGrid('grid-events');
buildSeats();
updateSummary();
