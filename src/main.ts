import { highlightAll } from "./highlight-code.ts";
import { addCopyLinkButton } from "./copy-link-button.ts";

async function start() {
  if (document.body.dataset.gc_enhanced) return;
  document.body.dataset.gc_enhanced = 'true';

  function enhancePosts() {
    highlightAll();
    addCopyLinkButton();

    setTimeout(() => {
      highlightAll();
      addCopyLinkButton();
    }, 2000);
  }

  enhancePosts();

  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        if (mutation.addedNodes.length) {
          enhancePosts();
        }
        if (mutation.removedNodes.length) {
          mutation.removedNodes.forEach((node) => {
            if ((node as HTMLElement).innerHTML?.includes('Applying edit...')) {
              enhancePosts();
            }
          });
        }
      }
    })
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (/id=.*Frame/.test(window.location.hash)) {
  window.addEventListener('resize', start)
  window.addEventListener('load', start);
}

