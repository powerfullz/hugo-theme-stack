import { scrollToAnchorHref } from './smoothAnchors';

const FOOTNOTE_REFERENCE_QUERY = 'sup.footnote-ref a, sup[id^="fnref"] > a.footnote-ref, sup[id^="fnref"] > a[href^="#fn:"]';
const FOOTNOTE_CONTAINER_QUERY = '.footnotes';
const FOOTNOTE_POPOVER_VIEWPORT_PADDING_TOKEN = '--footnote-popover-viewport-padding';
const FOOTNOTE_POPOVER_OFFSET_TOKEN = '--footnote-popover-offset';
const FOOTNOTE_POPOVER_MOBILE_BREAKPOINT_TOKEN = '--footnote-popover-mobile-breakpoint';

const SWIPE_CLOSE_THRESHOLD = 60;
const SWIPE_DRAG_RESISTANCE = 5;
const ANIMATION_DURATION_MS = 300;

function parsePixelValue(value: string): number {
    return Number.parseFloat(value);
}

function getRootTokenPixelValue(tokenName: string): number {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const tokenValue = rootStyle.getPropertyValue(tokenName).trim();
    return parsePixelValue(tokenValue);
}

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

    clone.querySelectorAll('a[href^="#fnref"]').forEach((backRefElement: Element) => {
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

    const dragHandle = document.createElement('div');
    dragHandle.className = 'footnote-popover__drag-handle';
    popover.appendChild(dragHandle);

    popover.appendChild(createPopoverContent(footnoteElement));
    return popover;
}

function positionPopover(reference: HTMLAnchorElement, popover: HTMLElement): void {
    const viewportPadding = getRootTokenPixelValue(FOOTNOTE_POPOVER_VIEWPORT_PADDING_TOKEN);
    const popoverOffset = getRootTokenPixelValue(FOOTNOTE_POPOVER_OFFSET_TOKEN);
    const mobileBreakpoint = getRootTokenPixelValue(FOOTNOTE_POPOVER_MOBILE_BREAKPOINT_TOKEN);

    if (window.innerWidth < mobileBreakpoint) {
        popover.classList.add('footnote-popover--mobile');
        popover.style.top = '';
        popover.style.left = '';
        return;
    }

    popover.classList.remove('footnote-popover--mobile');

    const referenceRect = reference.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    let left = referenceRect.left + referenceRect.width / 2 - popoverRect.width / 2;
    const maxLeft = window.innerWidth - viewportPadding - popoverRect.width;
    left = Math.min(Math.max(viewportPadding, left), Math.max(viewportPadding, maxLeft));

    let top = referenceRect.bottom + popoverOffset;
    const maxTop = window.innerHeight - viewportPadding - popoverRect.height;
    let isTop = false;

    if (top > maxTop) {
        top = referenceRect.top - popoverRect.height - popoverOffset;
        isTop = true;
    }

    top = Math.min(Math.max(viewportPadding, top), Math.max(viewportPadding, maxTop));

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;

    const arrowLeft = referenceRect.left + referenceRect.width / 2 - left;
    popover.style.setProperty('--arrow-left', `${arrowLeft}px`);

    if (isTop) {
        popover.classList.add('footnote-popover--top');
        popover.classList.remove('footnote-popover--bottom');
    } else {
        popover.classList.add('footnote-popover--bottom');
        popover.classList.remove('footnote-popover--top');
    }
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

        const currentPopover = popover;
        popover = null;

        if (activeReference) {
            activeReference.setAttribute('aria-expanded', 'false');
            activeReference = null;
        }

        currentPopover.style.animation = 'none'; // clear entering animation
        void currentPopover.offsetHeight; // trigger reflow
        currentPopover.style.animation = ''; // remove inline style so CSS class animation applies
        // Add closing class to trigger CSS exit animation
        currentPopover.classList.add('footnote-popover--closing');
        
        currentPopover.addEventListener('animationend', () => {
            if (currentPopover.parentNode) {
                currentPopover.parentNode.removeChild(currentPopover);
            }
        }, { once: true });
        
        // Fallback in case animationend doesn't fire
        setTimeout(() => {
            if (currentPopover.parentNode) {
                currentPopover.parentNode.removeChild(currentPopover);
            }
        }, ANIMATION_DURATION_MS);
    };

    const openPopover = (reference: HTMLAnchorElement, footnoteElement: HTMLElement): void => {
        closePopover();

        popover = createPopover(footnoteElement);
        document.body.appendChild(popover);

        activeReference = reference;
        activeReference.setAttribute('aria-expanded', 'true');

        positionPopover(reference, popover);

        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let isDragStartedFromHandle = false;

        const handleTouchStart = (e: TouchEvent) => {
            if (!popover || !popover.classList.contains('footnote-popover--mobile')) return;

            const target = e.target as HTMLElement;
            isDragStartedFromHandle = !!target.closest('.footnote-popover__drag-handle');
            
            const content = popover.querySelector('.footnote-popover__content');
            const isAtTop = content && content.scrollTop === 0;

            if (isDragStartedFromHandle || isAtTop) {
                startY = e.touches[0].clientY;
                currentY = startY;
                isDragging = true;
                popover.style.transition = 'none';
                popover.style.animation = 'none';
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || !popover) return;
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            if (deltaY > 0) {
                popover.style.transform = `translateX(-50%) translateY(${deltaY}px)`;
                if (e.cancelable && (isDragStartedFromHandle || deltaY > SWIPE_DRAG_RESISTANCE)) {
                    e.preventDefault();
                }
            } else {
                popover.style.transform = `translateX(-50%) translateY(0)`;
            }
        };

        const handleTouchEnd = () => {
            if (!isDragging || !popover) return;
            isDragging = false;

            const deltaY = currentY - startY;
            popover.style.transition = `transform ${ANIMATION_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${ANIMATION_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;

            if (deltaY > SWIPE_CLOSE_THRESHOLD) {
                popover.style.transform = `translateX(-50%) translateY(100%)`;
                popover.style.opacity = '0';
                
                const currentPopover = popover;
                popover = null; // Clear the reference so closePopover doesn't interfere
                if (activeReference) {
                    activeReference.setAttribute('aria-expanded', 'false');
                    activeReference = null;
                }
                
                setTimeout(() => {
                    if (currentPopover && currentPopover.parentNode) {
                        currentPopover.parentNode.removeChild(currentPopover);
                    }
                }, ANIMATION_DURATION_MS);
            } else {
                popover.style.transform = '';
                setTimeout(() => {
                    if (popover) {
                        popover.style.transition = '';
                    }
                }, ANIMATION_DURATION_MS);
            }
        };

        popover.addEventListener('touchstart', handleTouchStart, { passive: false });
        popover.addEventListener('touchmove', handleTouchMove, { passive: false });
        popover.addEventListener('touchend', handleTouchEnd);
        popover.addEventListener('touchcancel', handleTouchEnd);
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
