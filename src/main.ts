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

  // document.addEventListener('keydown', (e) => {
  //   if (e.key === 'Tab' && (e.target as HTMLDivElement).contentEditable === 'true') {
  //     const el = e.target as HTMLDivElement;
  //     const selection = document.getSelection();
  //     const selectionNode = selection?.anchorNode;
  //     if (!selectionNode) return;
  //     // console.log( document.getSelection(), el.innerText.split('\n').join('\\n'))
  //     let numberOf3BackTicks = 0;
  //     const childNodes = [...el.childNodes];
  //     childNodes.splice(childNodes.indexOf(selectionNode as ChildNode));
  //     childNodes.forEach((node) => {
  //       if (node.textContent === '```') numberOf3BackTicks++;
  //     });
  //     if (numberOf3BackTicks % 2 === 1) {
  //       console.log('doing')
  //       e.preventDefault();
  //       const content = selectionNode.textContent || '';
  //       const offset = selection.anchorOffset;
  //       selectionNode.textContent = content.slice(0, offset) + '\t' + content.slice(offset);
  //       const range = document.createRange();
  //
  //       range.setStart(selectionNode, offset + 1  || 0);
  //       range.collapse(true);
  //
  //       selection.removeAllRanges()
  //       selection.addRange(range)
  //     }
  //   }
  // })
}

if (/id=.*Frame/.test(window.location.hash)) {
  window.addEventListener('resize', start)
  window.addEventListener('load', start);
}

