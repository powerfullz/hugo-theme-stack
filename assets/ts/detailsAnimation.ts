import {
    SlideAnimationState,
    createSlideAnimationState,
    mobileSlideAnimationDurationMs,
    slideClose,
    slideOpen,
    stopSlideTransition
} from './slideAnimation';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion(): boolean {
    return window.matchMedia(reducedMotionQuery).matches;
}

function openDetails(details: HTMLDetailsElement, content: HTMLElement, animationState: SlideAnimationState): void {
    details.setAttribute('open', '');

    if (prefersReducedMotion()) {
        details.classList.remove('transiting');
        return;
    }

    slideOpen(content, animationState, {
        duration: mobileSlideAnimationDurationMs,
        transitionProperty: 'height',
        onComplete: () => {
            details.classList.remove('transiting');
        }
    });
}

function closeDetails(details: HTMLDetailsElement, content: HTMLElement, animationState: SlideAnimationState): void {
    if (prefersReducedMotion()) {
        stopSlideTransition(content, animationState);
        details.removeAttribute('open');
        details.classList.remove('transiting');
        return;
    }

    slideClose(content, animationState, {
        duration: mobileSlideAnimationDurationMs,
        transitionProperty: 'height',
        onComplete: () => {
            details.removeAttribute('open');
            details.classList.remove('transiting');
        }
    });
}

function setupDetailsAnimation(): void {
    const allDetails = document.querySelectorAll('.stack-details') as NodeListOf<HTMLDetailsElement>;

    allDetails.forEach((details) => {
        const summary = details.querySelector('summary') as HTMLElement | null;
        const content = details.querySelector('.stack-details__content') as HTMLElement | null;
        if (!summary || !content) {
            return;
        }

        const animationState = createSlideAnimationState();

        summary.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();

            if (details.classList.contains('transiting')) {
                return;
            }

            details.classList.add('transiting');

            if (details.open) {
                closeDetails(details, content, animationState);
                return;
            }

            openDetails(details, content, animationState);
        });
    });
}

setupDetailsAnimation();
