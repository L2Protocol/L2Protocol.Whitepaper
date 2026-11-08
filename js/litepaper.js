(function () {
    const themeStorageKey = 'theme';

    function applyTheme(theme) {
        const value = theme === 'dark' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-bs-theme', value);

        document.querySelectorAll('img.dark').forEach(image => {
            const source = image.getAttribute('src');
            if (!source)
                return;

            const base = source.replace('-dark.', '.');
            if (value !== 'dark') {
                image.setAttribute('src', base);
                return;
            }

            const dot = base.lastIndexOf('.');
            image.setAttribute('src', base.slice(0, dot) + '-dark' + base.slice(dot));
        });

        document.querySelectorAll('[data-theme-icon]').forEach(icon => {
            icon.hidden = icon.dataset.themeIcon !== value;
        });
    }

    function storedTheme() {
        try {
            return localStorage.getItem(themeStorageKey);
        } catch (error) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(themeStorageKey, theme);
        } catch (error) {
            /* storage unavailable, the theme simply does not persist */
        }
    }

    function setUpThemeSwitch() {
        applyTheme(storedTheme() || 'dark');

        const button = document.getElementById('theme-switch');
        if (!button)
            return;

        button.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            storeTheme(next);
        });
    }

    function setUpRail() {
        const rail = document.getElementById('doc-rail');
        const toggle = document.getElementById('rail-toggle');
        if (!rail || !toggle)
            return;

        toggle.addEventListener('click', () => {
            const open = rail.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        rail.addEventListener('click', event => {
            if (event.target.closest('a') && window.matchMedia('(max-width: 991.98px)').matches) {
                rail.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function setUpHeadingAnchors() {
        document.querySelectorAll('.doc-body h2[id], .doc-body h3[id]').forEach(heading => {
            const anchor = document.createElement('a');
            anchor.className = 'head-anchor';
            anchor.href = '#' + heading.id;
            anchor.textContent = '#';
            anchor.setAttribute('aria-label', 'Link to this heading');
            heading.appendChild(anchor);
        });
    }

    function setUpCopyButtons() {
        const copyLabel = document.body.dataset.copyLabel || 'Copy';
        const copiedLabel = document.body.dataset.copiedLabel || 'Copied';

        document.querySelectorAll('.doc-body pre').forEach(pre => {
            const code = pre.querySelector('code');
            if (!code || !navigator.clipboard)
                return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'copy-button';
            button.textContent = copyLabel;

            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.innerText.trim());
                } catch (error) {
                    return;
                }

                button.textContent = copiedLabel;
                button.classList.add('is-copied');

                setTimeout(() => {
                    button.textContent = copyLabel;
                    button.classList.remove('is-copied');
                }, 1600);
            });

            pre.appendChild(button);
        });
    }

    function setUpScrollSpy() {
        const targets = Array.from(document.querySelectorAll('.doc-body [id]'))
            .filter(element => element.tagName === 'SECTION' || element.tagName === 'H3');

        const links = new Map();
        document.querySelectorAll('.doc-rail a[href^="#"]').forEach(link => {
            links.set(decodeURIComponent(link.getAttribute('href').slice(1)), link);
        });

        if (!targets.length || !links.size)
            return;

        let current = '';

        function activate() {
            const line = window.scrollY + (window.innerHeight * 0.25);
            let active = targets[0];

            targets.forEach(target => {
                if (target.getBoundingClientRect().top + window.scrollY <= line)
                    active = target;
            });

            const section = active.closest('section[id]') || active;
            const sectionId = section.id;
            const subId = active.tagName === 'H3' ? active.id : '';
            const key = sectionId + '|' + subId;

            if (key === current)
                return;

            current = key;

            links.forEach(link => link.classList.remove('is-active'));
            links.get(sectionId)?.classList.add('is-active');

            if (subId)
                links.get(subId)?.classList.add('is-active');

            const activeLink = links.get(sectionId);
            const rail = document.getElementById('doc-rail');
            if (activeLink && rail && rail.scrollHeight > rail.clientHeight) {
                const linkTop = activeLink.offsetTop;
                if (linkTop < rail.scrollTop || linkTop > rail.scrollTop + rail.clientHeight - 80)
                    rail.scrollTo({ top: Math.max(linkTop - rail.clientHeight / 3, 0), behavior: 'auto' });
            }
        }

        activate();
        window.addEventListener('scroll', () => window.requestAnimationFrame(activate), { passive: true });
        window.addEventListener('resize', activate, { passive: true });
    }

    function setUpReadProgress() {
        const bar = document.getElementById('read-progress');
        if (!bar)
            return;

        function update() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
            bar.style.width = Math.min(Math.max(ratio, 0), 1) * 100 + '%';
        }

        update();
        window.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
        window.addEventListener('resize', update, { passive: true });
    }

    function setUpPrint() {
        document.querySelectorAll('[data-print]').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                window.print();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setUpThemeSwitch();
        setUpRail();
        setUpHeadingAnchors();
        setUpCopyButtons();
        setUpScrollSpy();
        setUpReadProgress();
        setUpPrint();
    });
}());
