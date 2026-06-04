// Fallback static data in case of CORS / fetch issues
const fallbackCharacters = [
  {
    "name": "ブラック",
    "height": 172,
    "birthday": "09-06",
    "firstPerson": "オレちゃん",
    "catchphrase": "ディス イズ エンターテインメント、ディール、鬼ヤバ",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "さとし",
    "height": 142,
    "birthday": "12-26",
    "firstPerson": "俺",
    "catchphrase": "さとシーサー",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "カメラちゃん",
    "height": "?",
    "birthday": "11-30",
    "firstPerson": "?",
    "catchphrase": "じ〜",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "ホワイト",
    "height": 172,
    "birthday": "04-06",
    "firstPerson": "ワイ",
    "catchphrase": "？",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "レオ博士",
    "height": 154,
    "birthday": "04-15",
    "firstPerson": "僕",
    "catchphrase": "？",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "タロー",
    "height": 180,
    "birthday": "03-06",
    "firstPerson": "俺",
    "catchphrase": "牙狼撲滅拳",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "アカネ",
    "height": 168,
    "birthday": "02-03",
    "firstPerson": "アタシ",
    "catchphrase": "おりゃーっ！",
    "tags": ["つべ", "コロ"]
  },
  {
    "name": "青オニちゃん",
    "height": "？",
    "birthday": "02-01",
    "firstPerson": "？",
    "catchphrase": "ニ～",
    "tags": ["つべ"]
  },
  {
    "name": "バニラ",
    "height": 102,
    "birthday": "02-01",
    "firstPerson": "バニラ、わたし",
    "catchphrase": "おなかすいたですぅ～",
    "tags": ["つべ", "コロ"]
  }
];

let characters = [];

// DOM Elements
const searchInput = document.getElementById('search-input');
const characterGrid = document.getElementById('character-grid');
const birthdaySection = document.getElementById('birthday-section');
const chartContainer = document.getElementById('chart-container');
const totalCountEl = document.getElementById('total-count');
const knownHeightCountEl = document.getElementById('known-height-count');

// Calendar DOM Elements
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const calendarMonthYear = document.getElementById('calendar-month-year');
const calendarGridDays = document.getElementById('calendar-grid-days');

// Calendar State
let currentCalYear = new Date().getFullYear();
let currentCalMonth = new Date().getMonth() + 1; // 1-12

// Fetch and load character data
async function loadCharacters() {
  try {
    const response = await fetch('characters.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    characters = await response.json();
    console.log('Successfully loaded characters from JSON.');
  } catch (error) {
    console.warn('Could not load characters.json (likely due to CORS or direct file access). Using fallback data.', error);
    characters = fallbackCharacters;
    
    // Show local server recommendation tip in header if we are on file:// protocol
    if (window.location.protocol === 'file:') {
      const header = document.querySelector('header');
      const tip = document.createElement('div');
      tip.style.cssText = 'background: rgba(255, 46, 91, 0.15); border: 1px solid var(--accent-red); border-radius: 8px; padding: 0.8rem; margin-top: 1rem; color: #ff8fa3; font-size: 0.9rem; text-align: center;';
      tip.innerHTML = '⚠️ <strong>ローカルファイル(file://)で実行中:</strong> CORS制限のため、データ変更時はローカルサーバー経由か、または<code>app.js</code>内の初期データを直接書き換えてください。';
      header.appendChild(tip);
    }
  }
  
  initApp();
}

function initApp() {
  renderApp();
  renderCalendar();
  renderCalendarSidebar();
  
  // Set up search event listener
  searchInput.addEventListener('input', () => {
    renderApp();
  });

  // Calendar Controls
  prevMonthBtn.addEventListener('click', () => {
    currentCalMonth--;
    if (currentCalMonth < 1) {
      currentCalMonth = 12;
      currentCalYear--;
    }
    renderCalendar();
  });
  
  nextMonthBtn.addEventListener('click', () => {
    currentCalMonth++;
    if (currentCalMonth > 12) {
      currentCalMonth = 1;
      currentCalYear++;
    }
    renderCalendar();
  });
}

function renderApp() {
  const query = searchInput.value.toLowerCase().trim();
  
  // Filter characters
  const filtered = characters.filter(char => {
    const nameMatch = char.name.toLowerCase().includes(query);
    const birthdayMatch = String(char.birthday).toLowerCase().includes(query);
    const firstPersonMatch = String(char.firstPerson).toLowerCase().includes(query);
    const catchphraseMatch = String(char.catchphrase).toLowerCase().includes(query);
    return nameMatch || birthdayMatch || firstPersonMatch || catchphraseMatch;
  });
  
  // Render birthday section (at the top)
  renderBirthdayHighlight();
  
  // Render cards
  renderCards(filtered);
  
  // Render height chart
  renderHeightChart(filtered);
  
  // Update stats
  updateStats(filtered);
}

function updateStats(dataList) {
  totalCountEl.textContent = dataList.length;
  const knownHeightCount = dataList.filter(c => typeof c.height === 'number' && !isNaN(c.height)).length;
  knownHeightCountEl.textContent = knownHeightCount;
}

// Generate card HTML content
function createCardHTML(char) {
  // Format birthday display
  let bdayDisplay = char.birthday;
  if (bdayDisplay && bdayDisplay !== '?') {
    const parts = bdayDisplay.split('-');
    if (parts.length === 2) {
      bdayDisplay = `${parseInt(parts[0], 10)}月${parseInt(parts[1], 10)}日`;
    }
  }
  
  // Generate tags HTML
  let tagsHTML = '';
  if (char.tags && Array.isArray(char.tags)) {
    tagsHTML = `
      <div class="card-tags">
        ${char.tags.map(t => {
          const className = t === 'つべ' ? 'tag-tsube' : (t === 'コロ' ? 'tag-koro' : '');
          return `<span class="tag-badge ${className}">${t}</span>`;
        }).join('')}
      </div>
    `;
  }
  
  return `
    ${tagsHTML}
    <div class="card-header">
      <h3 class="card-title">${char.name}</h3>
      <span class="card-subtitle">Character Profile</span>
    </div>
    <ul class="info-list">
      <li class="info-item">
        <span class="info-label">身長</span>
        <span class="info-val ${char.height === '?' ? 'unknown' : ''}">${char.height === '?' ? '?' : char.height + ' cm'}</span>
      </li>
      <li class="info-item">
        <span class="info-label">誕生日</span>
        <span class="info-val ${char.birthday === '?' ? 'unknown' : ''}">${bdayDisplay}</span>
      </li>
      <li class="info-item">
        <span class="info-label">一人称</span>
        <span class="info-val ${char.firstPerson === '?' ? 'unknown' : ''}">${char.firstPerson}</span>
      </li>
      <li class="info-item">
        <span class="info-label">口癖 / 決め台詞</span>
        <span class="info-val ${char.catchphrase === '?' ? 'unknown' : ''}">${char.catchphrase}</span>
      </li>
    </ul>
  `;
}

function renderBirthdayHighlight() {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthStr = String(currentMonth).padStart(2, '0');
  
  // Find characters whose birthday is this month
  const birthdayPeople = characters.filter(char => {
    return char.birthday && char.birthday.startsWith(monthStr);
  });
  
  if (birthdayPeople.length === 0) {
    birthdaySection.style.display = 'none';
    birthdaySection.innerHTML = '';
    return;
  }
  
  birthdaySection.style.display = 'block';
  birthdaySection.innerHTML = `
    <div class="birthday-title">🎉 今月 (${currentMonth}月) 誕生日のキャラクター 🎉</div>
    <div class="birthday-grid" id="birthday-grid"></div>
  `;
  
  const bGrid = document.getElementById('birthday-grid');
  birthdayPeople.forEach(char => {
    const card = document.createElement('article');
    card.className = 'card';
    card.id = `birthday-card-${char.name}`;
    card.innerHTML = createCardHTML(char);
    bGrid.appendChild(card);
  });
}

function renderCards(dataList) {
  characterGrid.innerHTML = '';
  
  if (dataList.length === 0) {
    characterGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        一致するキャラクターが見つかりませんでした。
      </div>
    `;
    return;
  }
  
  dataList.forEach(char => {
    const card = document.createElement('article');
    card.className = 'card';
    card.id = `char-card-${char.name}`;
    card.innerHTML = createCardHTML(char);
    characterGrid.appendChild(card);
  });
}

function renderHeightChart(dataList) {
  chartContainer.innerHTML = '';
  
  // Filter for valid heights
  const heightData = dataList
    .filter(char => typeof char.height === 'number' && !isNaN(char.height))
    .sort((a, b) => b.height - a.height);
    
  if (heightData.length === 0) {
    chartContainer.innerHTML = `
      <div style="text-align: center; width: 100%; color: var(--text-secondary); line-height: 250px;">
        身長が判明しているキャラクターがいません。
      </div>
    `;
    return;
  }
  
  // Find max height for scaling
  const maxHeight = Math.max(...heightData.map(c => c.height));
  
  heightData.forEach(char => {
    const barWrapper = document.createElement('div');
    barWrapper.className = 'chart-bar-wrapper';
    
    // Scale height (max height will be 85% of chart container to leave room for label)
    const percentageHeight = (char.height / maxHeight) * 85;
    
    barWrapper.innerHTML = `
      <div class="chart-bar" style="height: ${percentageHeight}%;" data-height-text="${char.height}cm"></div>
      <div class="chart-label" title="${char.name}">${char.name}</div>
    `;
    chartContainer.appendChild(barWrapper);
  });
}

function renderCalendar() {
  calendarMonthYear.textContent = `${currentCalYear}年 ${currentCalMonth}月`;
  calendarGridDays.innerHTML = '';
  
  const firstDayIndex = new Date(currentCalYear, currentCalMonth - 1, 1).getDay();
  const lastDay = new Date(currentCalYear, currentCalMonth, 0).getDate();
  
  // Previous month's padding
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    calendarGridDays.appendChild(emptyCell);
  }
  
  // Current month's days
  const monthStr = String(currentCalMonth).padStart(2, '0');
  
  for (let day = 1; day <= lastDay; day++) {
    const dayStr = String(day).padStart(2, '0');
    const bdayKey = `${monthStr}-${dayStr}`;
    
    // Find characters born on this day
    const birthdayPeople = characters.filter(char => char.birthday === bdayKey);
    
    const dayCell = document.createElement('div');
    const dayOfWeek = (firstDayIndex + day - 1) % 7;
    let dayClass = 'calendar-day';
    if (dayOfWeek === 0) dayClass += ' sunday';
    if (dayOfWeek === 6) dayClass += ' saturday';
    dayCell.className = dayClass;
    
    let badgesHTML = '';
    if (birthdayPeople.length > 0) {
      badgesHTML = `
        <div class="calendar-birthdays-container">
          ${birthdayPeople.map(p => `
            <div class="calendar-birthday-badge" title="${p.name}の誕生日！クリックで絞り込み" onclick="filterByCharacter('${p.name}')">
              🎂 ${p.name}
            </div>
          `).join('')}
        </div>
      `;
    }
    
    dayCell.innerHTML = `
      <span class="day-number">${day}</span>
      ${badgesHTML}
    `;
    calendarGridDays.appendChild(dayCell);
  }
}

function renderCalendarSidebar() {
  const allBirthdayList = document.getElementById('all-birthday-list');
  allBirthdayList.innerHTML = '';
  
  // Sort characters by birthday month and day (excluding '?')
  const validBirthdays = characters
    .filter(char => char.birthday && char.birthday !== '?')
    .sort((a, b) => a.birthday.localeCompare(b.birthday));
    
  validBirthdays.forEach(char => {
    const li = document.createElement('li');
    li.className = 'birthday-list-item';
    
    // Format birthday display
    const parts = char.birthday.split('-');
    let dateStr = char.birthday;
    if (parts.length === 2) {
      dateStr = `${parseInt(parts[0], 10)}月${parseInt(parts[1], 10)}日`;
    }
    
    li.innerHTML = `
      <span class="birthday-list-name">🎂 ${char.name}</span>
      <span class="birthday-list-date">${dateStr}</span>
    `;
    
    li.addEventListener('click', () => {
      // Set calendar to this character's birthday month
      const [m] = parts;
      currentCalMonth = parseInt(m, 10);
      renderCalendar();
      
      // Also apply filter
      filterByCharacter(char.name);
    });
    
    allBirthdayList.appendChild(li);
  });
}

// Global filter helper so it can be called from onclick attribute
window.filterByCharacter = function(name) {
  searchInput.value = name;
  renderApp();
  // Scroll to character grid or card
  const card = document.getElementById(`char-card-${name}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.borderColor = 'var(--accent-red)';
    card.style.boxShadow = 'var(--shadow-neon-red)';
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 2000);
  }
};

// Start app
window.addEventListener('DOMContentLoaded', loadCharacters);
