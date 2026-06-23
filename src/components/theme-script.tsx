export function ThemeScript() {
  const source = `
    (function () {
      try {
        var storedTheme = localStorage.getItem('portfolio-theme');
        var theme = storedTheme || 'dark';
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (_) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
