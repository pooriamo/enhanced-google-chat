export async function findTopicsParent(): Promise<HTMLElement | undefined> {
  return new Promise((resolve) => {
    let counter = 10;
    let parent;
    function tryFinding() {
      parent = document.querySelector('c-wiz[data-topic-id]')?.parentElement as HTMLElement | undefined;
      if (!parent && counter-- > 0) {
        setTimeout(tryFinding, 500);
      } else {
        resolve(parent);
      }
    }

    tryFinding();
  })
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function copyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

// export function observeForThreads() {
//   const event = new Event('threads-opened');
//   const mainCWiz = document.querySelector('body > c-wiz');
//   if (!mainCWiz) return;
//
//   let eventSent = false;
//
//   const mObserver = new MutationObserver((entries) => {
//     // let foundElement = false;
//     entries.forEach((entry) => {
//       if (eventSent || !entry.addedNodes.length) return;
//       const xpath = "//div[text()='Thread']";
//       const matchingElement = document.evaluate(xpath, mainCWiz, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//       if (matchingElement) {
//         document.dispatchEvent(event);
//         eventSent = true;
//         // foundElement = true;
//       }
//     });
//
//     // if (eventSent && !foundElement) {
//     //   eventSent = false;
//     // }
//   });
//
//   mObserver.observe(mainCWiz, {
//     childList: true,
//     subtree: true,
//   });
// }
