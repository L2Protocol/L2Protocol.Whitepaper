(function () {
    try {
        if (localStorage.getItem('theme') === 'light')
            document.documentElement.setAttribute('data-bs-theme', 'light');
    } catch (error) {
        /* storage unavailable, the dark theme stays */
    }
}());
