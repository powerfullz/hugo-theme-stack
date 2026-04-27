/*!
*   Hugo Theme Stack
*
*   @author: Jimmy Cai
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from 'ts/smoothAnchors';
import { setupPaginationJump } from 'ts/pagination';
import { setupCodeCopy } from 'ts/code-copy';
import { setupFootnotePopover } from 'ts/footnotePopover';
import { setupMobileToc } from 'ts/mobileToc';

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
