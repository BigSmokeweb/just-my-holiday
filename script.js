
(function () {
    'use strict';

    /* PARTICLES */
    var canvas = document.getElementById('particle-canvas');
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Particle() { this.reset(true); }
    Particle.prototype.reset = function (init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 8;
        this.r = Math.random() * 1.5 + 0.4;
        this.sp = Math.random() * 0.4 + 0.15;
        this.op = Math.random() * 0.4 + 0.08;
        var hues = [0, 5, 350, 355];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
    };
    Particle.prototype.tick = function () {
        this.y -= this.sp;
        if (this.y < -8) this.reset(false);
    };

    for (var i = 0; i < 80; i++) particles.push(new Particle());

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        for (var j = 0; j < particles.length; j++) {
            var p = particles[j];
            p.tick();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 65%, ' + p.op + ')';
            ctx.fill();
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    /* SCROLL PROGRESS */
    var prog = document.getElementById('scroll-prog');
    function updateProg() {
        var max = document.body.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        prog.style.width = pct.toFixed(2) + '%';
    }
    window.addEventListener('scroll', updateProg, { passive: true });

    /* NAV COMPACT */
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) nav.classList.add('compact');
        else nav.classList.remove('compact');
    }, { passive: true });

    /* COUNTDOWN — update the eventDate to your actual event date */
    var eventDate = new Date(2026, 7, 8, 13, 0, 0); // Aug 8 2026 1PM

    function pad(n) { return String(n).padStart(2, '0'); }
    function updateCountdown() {
        var now = new Date();
        var diff = eventDate - now;
        if (diff <= 0) {
            ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(function (id) {
                document.getElementById(id).textContent = '00';
            });
            return;
        }
        document.getElementById('cd-days').textContent = pad(Math.floor(diff / 86400000));
        document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
        document.getElementById('cd-mins').textContent = pad(Math.floor((diff % 3600000) / 60000));
        document.getElementById('cd-secs').textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* SCROLL REVEAL */
    var revealEls = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });

    /* SCHEDULE ACCORDION */
    var schedItems = document.querySelectorAll('.schedule-item');
    schedItems.forEach(function (item) {
        function toggle() {
            var isActive = item.classList.contains('active');
            schedItems.forEach(function (i) {
                i.classList.remove('active');
                i.setAttribute('aria-expanded', 'false');
            });
            if (!isActive) {
                item.classList.add('active');
                item.setAttribute('aria-expanded', 'true');
            }
        }
        item.addEventListener('click', toggle);
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });

})();

/* CONFETTI */
function fireConfetti(btn) {
    var colors = ['#CC0000', '#FF3333', '#990000', '#FF6666', '#ffffff', '#DD1111'];
    var rect = btn.getBoundingClientRect();
    var ox = rect.left + rect.width / 2;
    var oy = rect.top;
    for (var i = 0; i < 120; i++) {
        (function () {
            var el = document.createElement('div');
            el.classList.add('confetti-piece');
            el.style.left = (ox + (Math.random() - 0.5) * 200) + 'px';
            el.style.top = oy + 'px';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.width = (Math.random() * 8 + 4) + 'px';
            el.style.height = (Math.random() * 8 + 4) + 'px';
            el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            el.style.animationDelay = (Math.random() * 0.4) + 's';
            document.body.appendChild(el);
            el.addEventListener('animationend', function () { el.remove(); });
        })();
    }
}