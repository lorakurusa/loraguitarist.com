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
