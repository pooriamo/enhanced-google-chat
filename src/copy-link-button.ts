// noinspection CssUnresolvedCustomProperty

import { copyTextToClipboard } from "./utils.ts";

const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="
    height: 19px;
    width: 16px;
    fill: var(--icon-color);
"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path></svg>`;

const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 141.732 141.732" height="141.732px" id="Livello_1" version="1.1" viewBox="0 0 141.732 141.732" width="141.732px" xml:space="preserve" style="
    width: 20px;
    height: 20px;
    padding: 6px;
    fill: var(--icon-color);
"><g id="Livello_107"><path d="M57.217,63.271L20.853,99.637c-4.612,4.608-7.15,10.738-7.15,17.259c0,6.524,2.541,12.653,7.151,17.261   c4.609,4.608,10.74,7.148,17.259,7.15h0.002c6.52,0,12.648-2.54,17.257-7.15L91.738,97.79c7.484-7.484,9.261-18.854,4.573-28.188   l-7.984,7.985c0.992,4.667-0.443,9.568-3.831,12.957l-37.28,37.277l-0.026-0.023c-2.652,2.316-6.001,3.579-9.527,3.579   c-3.768,0-7.295-1.453-9.937-4.092c-2.681-2.68-4.13-6.259-4.093-10.078c0.036-3.476,1.301-6.773,3.584-9.39l-0.021-0.02   l0.511-0.515c0.067-0.071,0.137-0.144,0.206-0.211c0.021-0.021,0.043-0.044,0.064-0.062l0.123-0.125l36.364-36.366   c2.676-2.673,6.23-4.144,10.008-4.144c0.977,0,1.947,0.101,2.899,0.298l7.993-7.995c-3.36-1.676-7.097-2.554-10.889-2.554   C67.957,56.124,61.827,58.663,57.217,63.271 M127.809,24.337c0-6.52-2.541-12.65-7.15-17.258c-4.61-4.613-10.74-7.151-17.261-7.151   c-6.519,0-12.648,2.539-17.257,7.151L49.774,43.442c-7.479,7.478-9.26,18.84-4.585,28.17l7.646-7.646   c-0.877-4.368,0.358-8.964,3.315-12.356l-0.021-0.022l0.502-0.507c0.064-0.067,0.134-0.138,0.201-0.206   c0.021-0.02,0.04-0.04,0.062-0.06l0.126-0.127l36.363-36.364c2.675-2.675,6.231-4.147,10.014-4.147   c3.784,0,7.339,1.472,10.014,4.147c5.522,5.521,5.522,14.51,0,20.027L76.138,71.629l-0.026-0.026   c-2.656,2.317-5.999,3.581-9.526,3.581c-0.951,0-1.891-0.094-2.814-0.278l-7.645,7.645c3.369,1.681,7.107,2.563,10.907,2.563   c6.523,0,12.652-2.539,17.261-7.148l36.365-36.365C125.27,36.988,127.809,30.859,127.809,24.337"></path></g><g id="Livello_1_1_"></g></svg>`

let eventListenersRegistered = false;

export function addCopyLinkButton() {
  const menus = [...document.querySelectorAll('div[data-tooltip="More actions"]')];

  menus.forEach((menu) => {
    if ((menu as HTMLElement)?.parentElement?.querySelector('div[data-btn-id="copy-link"]')) {
      return;
    }
    menu.insertAdjacentHTML('beforebegin',
      `<div 
              data-btn-id="copy-link"
              style="height: 28px;
                margin: 0 0 0 4px;
                padding: 0;
                width: 28px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                cursor: pointer;" title="copy link to clipboard">
              ${linkIcon}
            </div>`
    )
  });

  if (!eventListenersRegistered) {
    registerEventListeners();
  }
}

function registerEventListeners() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const copyButton = target.closest('div[data-btn-id=copy-link]');
    if (copyButton) {
      const messageId = (target.closest('div[data-id]') as HTMLElement)?.dataset.id;
      const topicId = (target.closest('c-wiz[data-topic-id]') as HTMLElement)?.dataset.topicId;
      const groupId = (target.closest('*[data-group-id]') as HTMLElement)?.dataset.groupId;

      if (!groupId || !topicId) return;

      const link = `https://chat.google.com/${groupId.replace('space/', 'room/')}/${topicId}${!messageId || messageId === topicId ? '' : `/${messageId}`}`;
      copyTextToClipboard(link);

      copyButton.innerHTML = checkIcon;
      setTimeout(() => {
        copyButton.innerHTML = linkIcon;
      }, 1000)
    }
  });
}


