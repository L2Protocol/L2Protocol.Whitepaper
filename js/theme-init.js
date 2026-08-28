(function () {
    try {
        if (localStorage.getItem('theme') === 'dark')
            document.documentElement.setAttribute('data-bs-theme', 'dark');
    } catch (error) {
        /* storage unavailable, the light theme stays */
    }
}());
