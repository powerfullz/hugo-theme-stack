import mermaid from 'https://testingcf.jsdelivr.net/npm/mermaid@11.12.1/dist/mermaid.esm.min.mjs';

const initMermaid = () => {
    document.querySelectorAll('.mermaid').forEach((el) => {
        const element = el as HTMLElement;
        if (!element.dataset.mermaidSrc) {
            element.dataset.mermaidSrc = element.textContent || '';
            element.innerHTML = '';
        }
    });

    const renderMermaid = async () => {
        const isDark = document.documentElement.dataset.scheme === 'dark';
        
        // Neon Theme Configuration
        const themeVariables = isDark ? {
            // Dark Mode (Neon)
            primaryColor: '#2a1d45',        // Node background (Dark Purple)
            primaryTextColor: '#ffffff',    // Text color
            primaryBorderColor: '#8C00FF',  // Node border (Bright Purple)
            lineColor: '#FFC400',           // Connection lines (Golden Yellow)
            secondaryColor: '#100b1a',      // Background
            tertiaryColor: '#1e1433',       // Alternative background
            
            mainBkg: '#2a1d45',             // Main background
            nodeBorder: '#8C00FF',          // Node border
            clusterBkg: '#1e1433',          // Cluster background
            clusterBorder: '#FF3F7F',       // Cluster border (Hot Pink)
            defaultLinkColor: '#FFC400',    // Link color
            titleColor: '#FF3F7F',          // Title color
            edgeLabelBackground: '#100b1a', // Edge label background
            
            fontFamily: 'var(--base-font-family)'
        } : {
            // Light Mode (Cyberpunk 2077)
            primaryColor: '#ffffff',        // Node background
            primaryTextColor: '#050A0E',    // Text color (Dark)
            primaryBorderColor: '#050A0E',  // Node border (Black)
            lineColor: '#050A0E',           // Connection lines (Black)
            secondaryColor: '#FCEE09',      // Background (Yellow)
            tertiaryColor: '#ffffff',       // Alternative background
            
            mainBkg: '#ffffff',             // Main background
            nodeBorder: '#050A0E',          // Node border
            clusterBkg: '#FCEE09',          // Cluster background
            clusterBorder: '#050A0E',       // Cluster border
            defaultLinkColor: '#050A0E',    // Link color
            titleColor: '#FF003C',          // Title color (Red)
            edgeLabelBackground: '#FCEE09', // Edge label background (Yellow)
            
            fontFamily: 'var(--base-font-family)'
        };

        mermaid.initialize({
            theme: 'base',
            themeVariables,
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
