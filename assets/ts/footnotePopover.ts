import { scrollToAnchorHref } from './smoothAnchors';

const FOOTNOTE_REFERENCE_QUERY = 'sup.footnote-ref a, sup[id^="fnref:"] > a.footnote-ref, sup[id^="fnref:"] > a[href^="#fn:"]';
const FOOTNOTE_CONTAINER_QUERY = '.footnotes';
const VIEWPORT_PADDING = 16;
const POPOVER_OFFSET = 12;
const MOBILE_BREAKPOINT = 767;

function isFootnoteNavigation(href: string): boolean {
    return href.startsWith('#fn:') || href.startsWith('#fnref:');
}

function getFootnoteElement(articleContent: HTMLElement, href: string): HTMLElement | null {
    if (!isFootnoteNavigation(href)) {
        return null;
    }

    const targetId = decodeURI(href.substring(1));
    if (!targetId) {
        return null;
    }

    const footnotes = articleContent.querySelector(FOOTNOTE_CONTAINER_QUERY) as HTMLElement | null;
    if (!footnotes) {
        return null;
    }

    if (window.CSS && typeof window.CSS.escape === 'function') {
        return footnotes.querySelector(`#${window.CSS.escape(targetId)}`) as HTMLElement | null;
    }

    const target = document.getElementById(targetId) as HTMLElement | null;
    if (!target || !footnotes.contains(target)) {
        return null;
    }

    return target;
}

function createPopoverContent(footnoteElement: HTMLElement): HTMLElement {
    const content = document.createElement('div');
    content.className = 'footnote-popover__content';

    const clone = footnoteElement.cloneNode(true) as HTMLElement;

    clone.querySelectorAll('.footnote-backref').forEach((backRefElement: Element) => {
        backRefElement.remove();
    });

    clone.querySelectorAll('a[href^="#fnref:"]').forEach((backRefElement: Element) => {
        backRefElement.remove();
    });

    while (clone.firstChild) {
        content.appendChild(clone.firstChild);
    }

    return content;
}

function createPopover(footnoteElement: HTMLElement): HTMLElement {
    const popover = document.createElement('div');
    popover.className = 'footnote-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-live', 'polite');
    popover.appendChild(createPopoverContent(footnoteElement));
    return popover;
}

function positionPopover(reference: HTMLAnchorElement, popover: HTMLElement): void {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
        popover.classList.add('footnote-popover--mobile');
        popover.style.top = '';
        popover.style.left = '';
        return;
    }

    popover.classList.remove('footnote-popover--mobile');

    const referenceRect = reference.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    let left = referenceRect.left + referenceRect.width / 2 - popoverRect.width / 2;
    const maxLeft = window.innerWidth - VIEWPORT_PADDING - popoverRect.width;
    left = Math.min(Math.max(VIEWPORT_PADDING, left), Math.max(VIEWPORT_PADDING, maxLeft));

    let top = referenceRect.bottom + POPOVER_OFFSET;
    const maxTop = window.innerHeight - VIEWPORT_PADDING - popoverRect.height;
    if (top > maxTop) {
        top = referenceRect.top - popoverRect.height - POPOVER_OFFSET;
    }

    top = Math.min(Math.max(VIEWPORT_PADDING, top), Math.max(VIEWPORT_PADDING, maxTop));

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
}

function setupFootnotePopover(articleContent: HTMLElement): void {
    const references = articleContent.querySelectorAll(FOOTNOTE_REFERENCE_QUERY) as NodeListOf<HTMLAnchorElement>;
    if (references.length === 0) {
        return;
    }

    let popover: HTMLElement | null = null;
    let activeReference: HTMLAnchorElement | null = null;

    const closePopover = (): void => {
        if (!popover) {
            return;
        }

        popover.remove();
        popover = null;

        if (activeReference) {
            activeReference.setAttribute('aria-expanded', 'false');
            activeReference = null;
        }
    };

    const openPopover = (reference: HTMLAnchorElement, footnoteElement: HTMLElement): void => {
        closePopover();

        popover = createPopover(footnoteElement);
        document.body.appendChild(popover);

        activeReference = reference;
        activeReference.setAttribute('aria-expanded', 'true');

        positionPopover(reference, popover);
    };

    references.forEach((reference: HTMLAnchorElement) => {
        reference.addEventListener('click', (event: MouseEvent) => {
            const href = reference.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                return;
            }

            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                closePopover();

                scrollToAnchorHref(href);
                return;
            }

            const footnoteElement = getFootnoteElement(articleContent, href);
            if (!footnoteElement) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (activeReference === reference) {
                closePopover();
                return;
            }

            openPopover(reference, footnoteElement);
        });
    });

    document.addEventListener('click', (event: MouseEvent) => {
        if (!popover) {
            return;
        }

        const target = event.target as Node | null;
        if (!target) {
            closePopover();
            return;
        }

        if (popover.contains(target) || (activeReference && activeReference.contains(target))) {
            return;
        }

        closePopover();
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closePopover();
        }
    });

    window.addEventListener('scroll', () => {
        closePopover();
    }, { passive: true });

    window.addEventListener('resize', () => {
        closePopover();
    });
}

export { setupFootnotePopover };
