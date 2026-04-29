interface MermaidApi {
    initialize(config: Record<string, unknown>): void;
    run(opts: { nodes: HTMLElement[] }): Promise<void>;
}

interface MermaidConfig {
    transparentBackground?: boolean;
    lightTheme?: string;
    darkTheme?: string;
    lightThemeVariables?: Record<string, any>;
    darkThemeVariables?: Record<string, any>;
    securityLevel?: string;
    look?: string;
    htmlLabels?: boolean;
    maxTextSize?: number;
    maxEdges?: number;
    fontSize?: number;
    fontFamily?: string;
    curve?: string;
    logLevel?: number;
    expandLabel: string;
}

type PanzoomInstance = {
    zoomAbs(x: number, y: number, scale: number): void;
    moveTo(x: number, y: number): void;
    smoothZoom(x: number, y: number, scale: number): void;
    dispose(): void;
};

type PanzoomFactory = (
    el: HTMLElement,
    opts?: Record<string, unknown>,
) => PanzoomInstance;

type Scheme = 'light' | 'dark';

function getScheme(): Scheme {
    return document.documentElement.dataset.scheme === 'dark' ? 'dark' : 'light';
}

function buildThemeConfig(cfg: MermaidConfig, scheme: Scheme) {
    const isLight = scheme === 'light';
    const theme = isLight ? (cfg.lightTheme ?? 'default') : (cfg.darkTheme ?? 'dark');
    const vars = isLight ? (cfg.lightThemeVariables ?? {}) : (cfg.darkThemeVariables ?? {});
    return {
        theme,
        themeVariables: { ...vars, ...(cfg.transparentBackground ? { background: 'transparent' } : {}) },
    };
}

function buildBaseConfig(cfg: MermaidConfig): Record<string, any> {
    const base: Record<string, any> = {
        startOnLoad: false,
        securityLevel: cfg.securityLevel ?? 'strict',
        look: cfg.look ?? 'classic',
        flowchart: { htmlLabels: cfg.htmlLabels ?? true, useMaxWidth: true },
        gantt: { useWidth: 800 },
    };
    const optional: (keyof MermaidConfig)[] = ['maxTextSize', 'maxEdges', 'fontSize', 'fontFamily', 'curve', 'logLevel'];
    for (const key of optional) {
        if (cfg[key] != null) base[key] = cfg[key];
    }
    return base;
}

function initWithTheme(
    mermaid: MermaidApi,
    scheme: Scheme,
    themes: Record<Scheme, ReturnType<typeof buildThemeConfig>>,
    baseConfig: Record<string, any>,
) {
    const { theme, themeVariables } = themes[scheme];
    mermaid.initialize({
        ...baseConfig,
        theme,
        ...(Object.keys(themeVariables).length && { themeVariables }),
    });
}

async function renderOffscreen(mermaid: MermaidApi, sources: string[]): Promise<string[]> {
    const container = document.createElement('div');
    container.className = 'mermaid-offscreen';
    document.body.appendChild(container);
    const nodes = sources.map(src => {
        const n = document.createElement('pre');
        n.innerHTML = src;
        container.appendChild(n);
        return n;
    });
    await mermaid.run({ nodes });
    const results = nodes.map(n => n.innerHTML);
    container.remove();
    return results;
}

function setupWrappers(elements: NodeListOf<HTMLElement>, expandLabel: string) {
    elements.forEach((el, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid-wrapper';
        el.parentNode!.insertBefore(wrapper, el);
        wrapper.appendChild(el);

        const toolbar = document.createElement('div');
        toolbar.className = 'mermaid-toolbar';
        const btn = document.createElement('button');
        btn.dataset.idx = String(idx);
        btn.title = 'Open fullscreen with pan/zoom';
        btn.textContent = `⛶ ${expandLabel}`;
        toolbar.appendChild(btn);
        wrapper.appendChild(toolbar);
    });
}

function setupModal(elements: NodeListOf<HTMLElement>, panzoom: PanzoomFactory) {
    const modal = document.getElementById('mermaid-modal');
    const modalBody = document.getElementById('mermaid-modal-body');
    const modalContent = document.getElementById('mermaid-modal-content');
    if (!modal || !modalBody || !modalContent) return;
    let pzInstance: PanzoomInstance | null = null;

    const fitToScreen = () => {
        const wrapper = modalContent.querySelector('.mermaid-panzoom-container') as HTMLElement | null;
        if (!pzInstance || !wrapper) return;
        const w = +(wrapper.dataset.nativeWidth ?? 0);
        const h = +(wrapper.dataset.nativeHeight ?? 0);
        if (!w || !h) return;
        const rect = modalContent.getBoundingClientRect();
        const scale = Math.min((rect.width - 60) / w, (rect.height - 60) / h);
        pzInstance.zoomAbs(0, 0, scale);
        pzInstance.moveTo((rect.width - w * scale) / 2, (rect.height - h * scale) / 2);
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        pzInstance?.dispose();
        pzInstance = null;
        modalContent.innerHTML = '';
    };

    const openModal = (idx: number) => {
        if (idx < 0 || idx >= elements.length) return;
        const svg = elements[idx].querySelector('svg');
        if (!svg) return;

        const svgClone = svg.cloneNode(true) as SVGElement;
        const viewBox = svg.getAttribute('viewBox');
        const [w, h] = viewBox
            ? viewBox.split(/[\s,]+/).slice(2).map(Number)
            : [svg.getBoundingClientRect().width || 800, svg.getBoundingClientRect().height || 600];
        svgClone.setAttribute('width', String(w));
        svgClone.setAttribute('height', String(h));

        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid-panzoom-container';
        wrapper.dataset.nativeWidth = String(w);
        wrapper.dataset.nativeHeight = String(h);
        wrapper.appendChild(svgClone);

        modalContent.innerHTML = '';
        modalContent.appendChild(wrapper);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            pzInstance = panzoom(wrapper, { maxZoom: 10, minZoom: 0.05, bounds: false });
            fitToScreen();
            wrapper.classList.add('ready');
        }, 50);
    };

    // Event delegation
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const toolbarBtn = target.closest('.mermaid-toolbar button') as HTMLElement | null;
        if (toolbarBtn) return openModal(+(toolbarBtn.dataset.idx!));

        const zoomBtn = target.closest('.mermaid-modal-controls button') as HTMLElement | null;
        if (zoomBtn && pzInstance) {
            const z = zoomBtn.dataset.zoom;
            const rect = modalBody.getBoundingClientRect();
            if (z === 'fit') fitToScreen();
            else if (z === '0') { pzInstance.moveTo(0, 0); pzInstance.zoomAbs(0, 0, 1); }
            else pzInstance.smoothZoom(rect.width / 2, rect.height / 2, z === '1' ? 1.5 : 0.67);
        }
    });

    document.getElementById('mermaid-modal-close')?.addEventListener('click', closeModal);
    modalBody.addEventListener('click', (e) => { if (e.target === modalBody) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

export async function initMermaidPage(mermaid: MermaidApi, panzoom: PanzoomFactory, config: MermaidConfig) {
    const elements = document.querySelectorAll('.mermaid') as NodeListOf<HTMLElement>;
    if (!elements.length) return;

    const sources = Array.from(elements).map(el => el.innerHTML);
    const perDiagramTransparent = sources.map(src => /%%\s*transparent\s*%%/i.test(src));
    const cache: Record<Scheme, string[]> = { light: [], dark: [] };

    const themes = {
        light: buildThemeConfig(config, 'light'),
        dark: buildThemeConfig(config, 'dark'),
    };
    const baseConfig = buildBaseConfig(config);

    const applyTransparency = (el: HTMLElement, i: number) => {
        if (perDiagramTransparent[i]) el.querySelector('svg')?.style.setProperty('background', 'transparent');
    };

    setupWrappers(elements, config.expandLabel);
    setupModal(elements, panzoom);

    // Initial render
    const scheme = getScheme();
    initWithTheme(mermaid, scheme, themes, baseConfig);
    await mermaid.run({ nodes: Array.from(elements) });
    elements.forEach((el, i) => {
        el.style.visibility = '';
        cache[scheme][i] = el.innerHTML;
        applyTransparency(el, i);
    });

    // Pre-render alternate theme during idle time
    const alt: Scheme = scheme === 'dark' ? 'light' : 'dark';
    const idle = window.requestIdleCallback ?? ((fn: IdleRequestCallback) => setTimeout(fn, 1000));
    idle(() => {
        if (cache[alt].length) return;
        initWithTheme(mermaid, alt, themes, baseConfig);
        renderOffscreen(mermaid, sources).then(results => { cache[alt] = results; });
    });

    // Swap cached diagrams on theme change
    window.addEventListener('onColorSchemeChange', async () => {
        const newScheme = getScheme();
        if (!cache[newScheme].length) {
            initWithTheme(mermaid, newScheme, themes, baseConfig);
            cache[newScheme] = await renderOffscreen(mermaid, sources);
        }
        elements.forEach((el, i) => { el.innerHTML = cache[newScheme][i]; applyTransparency(el, i); });
    });
}
