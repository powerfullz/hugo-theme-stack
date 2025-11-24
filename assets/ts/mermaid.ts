const initMermaid = async () => {
    // @ts-ignore
    const { default: mermaid } = await import('mermaid');

    document.querySelectorAll('.mermaid').forEach((el) => {
        const element = el as HTMLElement;
        if (!element.dataset.mermaidSrc) {
            element.dataset.mermaidSrc = element.textContent || '';
            element.innerHTML = '';
        }
    });

    const renderMermaid = async () => {
        const theme = document.documentElement.dataset.scheme === 'dark' ? 'dark' : 'default';

        mermaid.initialize({
            theme,
            startOnLoad: false,
        });

        const elements = document.querySelectorAll('.mermaid');

        for (const el of Array.from(elements)) {
            const element = el as HTMLElement;
            const code = element.dataset.mermaidSrc;
            if (!code) continue;

            const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);

            try {
                // using mermaid's render function to generate SVG asynchronously
                // avoid blocking UI and prevent flickering
                const { svg } = await mermaid.render(id, code);
                element.innerHTML = svg;
            } catch (error) {
                console.error('Mermaid rendering failed:', error);
            }
        }
    };

    window.addEventListener('onColorSchemeChange', renderMermaid);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMermaid);
    } else {
        renderMermaid();
    }
}

initMermaid();
