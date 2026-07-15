/*!
*   Hugo Theme Stack
*
*   @author: Jimmy Cai
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import menu from './menu';
import createElement from './createElement';
import StackColorScheme from './colorScheme';
import { setupScrollspy } from './scrollspy';
import { setupSmoothAnchors } from './smoothAnchors';
import { setupPaginationJump } from './pagination';
import { setupCodeCopy } from './code-copy';
import { setupFootnotePopover } from './footnotePopover';
import { setupMobileToc } from './mobileToc';

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        setupCodeCopy();
        setupPaginationJump();
        setupMobileToc();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            setupSmoothAnchors();
            setupScrollspy();
            setupFootnotePopover(articleContent);
        }

        new StackColorScheme(document.getElementById('dark-mode-toggle')!);
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;
