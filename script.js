// Reviews slideshow
(function () {
    const track = document.getElementById('reviewsTrack');
    const dotsContainer = document.getElementById('reviewsDots');
    const cards = track ? track.querySelectorAll('.review-card') : [];
    let current = 0;
    let timer;

    if (!cards.length) return;

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        current = (index + cards.length) % cards.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsContainer.querySelectorAll('.reviews-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 5000);
    }

    document.getElementById('reviewsPrev').addEventListener('click', () => goTo(current - 1));
    document.getElementById('reviewsNext').addEventListener('click', () => goTo(current + 1));

    resetTimer();
})();

// About photo slideshow
(function () {
    const slides = document.querySelectorAll('.about-slide');
    const dotsContainer = document.getElementById('aboutSlideDots');
    if (!slides.length) return;
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'about-slide-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        slides[current].classList.remove('active');
        dotsContainer.querySelectorAll('.about-slide-dot')[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotsContainer.querySelectorAll('.about-slide-dot')[current].classList.add('active');
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 4000);
    }

    document.getElementById('aboutSlidePrev').addEventListener('click', () => goTo(current - 1));
    document.getElementById('aboutSlideNext').addEventListener('click', () => goTo(current + 1));

    resetTimer();
})();

// =============================================
// PERFORMANCES CALENDAR
// To add or remove events, edit this array only.
// date format: 'YYYY-MM-DD'
// ticket: URL string, or null for "Tickets coming soon"
// =============================================
(function () {
    const PERFORMANCES = [
        {
            date: '2026-07-02',
            title: 'Nocturno Duo Concert — The Stable, Wine & Dine Experience',
            location: 'The Stable, 1151 Leigh Rd, Matakana · Thursday 6:45pm',
            desc: 'An evening of romantic and classical music for classical guitar and flute, with a focus on the wine and dine experience.',
            ticket: 'https://www.eventfinda.co.nz/2026/nocturno-duo/auckland'
        },
        {
            date: '2026-07-18',
            title: "Nocturno Duo Concert — St Andrew's Church",
            location: "St Andrew's Church, 1 Omaha Flats Road, Matakana · Saturday",
            desc: 'An intimate concert featuring romantic and classical works for guitar and flute in the beautiful setting of St Andrew’s Church.',
            ticket: null
        },
        {
            date: '2026-08-15',
            title: "Nocturno Candlelight Duo Concert — St Luke's Church",
            location: '130 Remuera Road, Remuera, Auckland',
            desc: 'A candlelit evening of music for guitar and flute.',
            ticket: null
        }
    ];

    const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    function parseDate(str) {
        const [y, m, d] = str.split('-').map(Number);
        return { year: y, month: m, day: d };
    }

    function renderMonth(year, month, eventDays) {
        // month is 1-indexed
        const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
        const totalDays = new Date(year, month, 0).getDate();
        // shift so Monday = 0
        const startOffset = (firstDay + 6) % 7;

        let html = `<div class="pcal-month">`;
        html += `<div class="pcal-month-header">${MONTH_NAMES[month - 1]} ${year}</div>`;
        html += `<div class="pcal-grid">`;
        DAY_NAMES.forEach(d => { html += `<div class="pcal-day-name">${d}</div>`; });

        for (let i = 0; i < startOffset; i++) html += `<div class="pcal-cell pcal-empty"></div>`;

        for (let d = 1; d <= totalDays; d++) {
            const isEvent = eventDays.has(d);
            html += `<div class="pcal-cell${isEvent ? ' pcal-event-day' : ''}">${d}${isEvent ? '<span class="pcal-dot"></span>' : ''}</div>`;
        }
        html += `</div></div>`;
        return html;
    }

    function render() {
        const container = document.getElementById('perfCalendar');
        if (!container) return;

        // Group events by year-month
        const byMonth = {};
        PERFORMANCES.forEach(ev => {
            const { year, month, day } = parseDate(ev.date);
            const key = `${year}-${String(month).padStart(2,'0')}`;
            if (!byMonth[key]) byMonth[key] = { year, month, events: [], days: new Set() };
            byMonth[key].events.push({ ...ev, day });
            byMonth[key].days.add(day);
        });

        const keys = Object.keys(byMonth).sort();
        let html = '';

        keys.forEach(key => {
            const { year, month, events, days } = byMonth[key];
            html += `<div class="pcal-block">`;
            html += renderMonth(year, month, days);
            html += `<ul class="pcal-event-list">`;
            events.forEach(ev => {
                html += `<li class="pcal-event-item">`;
                html += `<div class="pcal-event-date">${String(ev.day).padStart(2,'0')} ${MONTH_NAMES[month-1].slice(0,3).toUpperCase()}</div>`;
                html += `<div class="pcal-event-info">`;
                html += `<span class="pcal-event-title">${ev.title}</span>`;
                html += `<span class="pcal-event-location">${ev.location}</span>`;
                html += `<span class="pcal-event-desc">${ev.desc}</span>`;
                if (ev.ticket) {
                    html += `<a class="perf-ticket" href="${ev.ticket}" target="_blank">Buy Tickets</a>`;
                } else {
                    html += `<span class="perf-ticket-soon">Tickets coming soon</span>`;
                }
                html += `</div></li>`;
            });
            html += `</ul></div>`;
        });

        container.innerHTML = html;
    }

    render();
})();

// Music carousel
(function () {
    const cards = document.querySelectorAll('.music-card');
    if (!cards.length) return;
    let current = 0;

    function update() {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next');
            const offset = (i - current + cards.length) % cards.length;
            if (offset === 0) card.classList.add('active');
            else if (offset === cards.length - 1) card.classList.add('prev');
            else if (offset === 1) card.classList.add('next');
        });
    }

    document.getElementById('musicPrev').addEventListener('click', () => {
        current = (current - 1 + cards.length) % cards.length;
        update();
    });

    document.getElementById('musicNext').addEventListener('click', () => {
        current = (current + 1) % cards.length;
        update();
    });

    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('active')) {
                current = i;
                update();
            }
        });
    });

    update();
})();
