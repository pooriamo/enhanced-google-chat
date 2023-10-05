// noinspection CssUnresolvedCustomProperty

import { copyTextToClipboard, escapeHtml } from "./utils.ts";
const STORAGE_KEY_SAVED_MESSAGES = 'egch-saved-topics';
const STORAGE_KEY_SAVED_MESSAGES_USERS = 'egch-saved-topics-users';

type SortValue = 'last_saved' | 'first_saved' | 'last_sent' | 'first_sent';

type MessageIds = {
  groupId: string | null,
  topicId: string | null,
  messageId: string | null,
}

type SavedMessage = MessageIds & {
  userId: string,
  content: string,
  date: string,
  createdAt: number,
}

type User = {
  id: string,
  imageUrl: string,
  name: string,
}

async function getSavedMessages() {
  const storage = await chrome.storage.sync.get({
    [STORAGE_KEY_SAVED_MESSAGES]: []
  }) as {
    [STORAGE_KEY_SAVED_MESSAGES]: SavedMessage[]
  };

  return storage[STORAGE_KEY_SAVED_MESSAGES];
}

async function getUsers() {
  const storage = await chrome.storage.sync.get({
    [STORAGE_KEY_SAVED_MESSAGES_USERS]: []
  }) as {
    [STORAGE_KEY_SAVED_MESSAGES_USERS]: User[]
  };

  return storage[STORAGE_KEY_SAVED_MESSAGES_USERS];
}

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

const saveIcon = `<svg data-saved="1" style="fill: var(--icon-color)" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="20px" height="20px"><path d="M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z"/></svg>`;

const savedIcon = `<svg data-saved="0" style="fill: var(--icon-color)" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="20px" height="20px">    <path d="M 6 2 C 5.861875 2 5.7278809 2.0143848 5.5976562 2.0410156 C 4.686084 2.2274316 4 3.033125 4 4 L 4 22 L 12 19 L 20 22 L 20 4 C 20 3.8625 19.985742 3.7275391 19.958984 3.5976562 C 19.799199 2.8163086 19.183691 2.2008008 18.402344 2.0410156 C 18.272119 2.0143848 18.138125 2 18 2 L 6 2 z"/></svg>`;

let eventListenersRegistered = false;

function closeSavedMessages() {
  const container = document.querySelector('#egch-saved-messages-container') as HTMLElement;
  container.classList.remove('egch-saved-messages-visible');
  container.classList.add('egch-saved-messages-hidden');
}

function getDateFromTimestamp(timestamp: string | number) {
  try {
    return new Date(Number(timestamp)).toLocaleString('en-us', { year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit" })
  } catch {
    console.error('failed to format time: ' + timestamp)
    return '-';
  }
}

function isCurrentUser(userId: string) {
  const mainCWiz = document.querySelector('body > c-wiz') as HTMLElement | null;
  if (!mainCWiz) {
    console.error('isCurrentUser: main cwiz not found');
    return;
  }
  const stringContainingMyUserId = mainCWiz.dataset.p || '';
  return stringContainingMyUserId.includes(`"${userId}"`);
}

function getCurrentGroupId() {
  const mainCWiz = document.querySelector('body > c-wiz') as HTMLElement | null;
  if (!mainCWiz) {
    console.error('getCurrentGroupId: main cwiz not found');
    return;
  }
  return mainCWiz.dataset.groupId;
}

async function displayMessages(container: HTMLElement, filter: string = '') {
  const sortValue = (document.querySelector('#egch-saved-messages-sort') as HTMLInputElement).value as SortValue;
  const userFilterValue = (document.querySelector('#egch-saved-messages-users') as HTMLInputElement).value;

  const users = await getUsers();
  const mainCWiz = document.querySelector('body > c-wiz') as HTMLElement | null;
  if (!mainCWiz) {
    console.error('main cwiz not found');
    return;
  }
  const currentGroupId = getCurrentGroupId();

  if (!currentGroupId) {
    console.log('group id not found');
    return;
  }
  const messages = await getSavedMessages();
  const messagesForThisChat = messages.filter(({ groupId }) => groupId === currentGroupId);
  const filteredMessages = messagesForThisChat.filter((msg) => {
    const user = users.find((user) => user.id === msg.userId);
    const isUserSelected = userFilterValue === 'all' ? true : user?.id === userFilterValue;
    return isUserSelected && (!filter || msg.content.toLowerCase().includes(filter.toLowerCase()) || user?.name.toLowerCase().includes(filter.toLowerCase()))
  });

  if (sortValue === 'last_saved') {
    filteredMessages.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortValue === 'first_saved') {
    filteredMessages.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sortValue === 'last_sent') {
    filteredMessages.sort((a, b) => Number(b.date) - Number(a.date));
  } else if (sortValue === 'first_sent') {
    filteredMessages.sort((a, b) => Number(a.date) - Number(b.date));
  }

  let html = filteredMessages.map((data) => {
    const user = users.find((user) => user.id === data.userId);
    const userName = user && isCurrentUser(user.id) ? 'Myself' : user?.name;
    return `
      <a href="${getLink({ groupId: data.groupId, topicId: data.topicId, messageId: data.messageId })}" class="egch-saved-message-item">
        <div class="egch-saved-message-item-header">
          ${user?.imageUrl ? `<img src="${user.imageUrl}" alt="${user.imageUrl}" />` : ''}
          <div>${userName || 'Unknown'} <span class="egch-saved-message-datetime">${getDateFromTimestamp(data.date)}</span></div>
        </div>
        <p class="egch-saved-message-content">${data.content?.slice(0, 100)}...</p>
      </a>
    `
  }).join('\n');
  console.log(messages)
  html = html ? `${html}` : `<div class="egch-saved-messages-empty">${messagesForThisChat.length ? 'No match found.' : 'No messages are saved yet!'}</div>`;

  (container.querySelector('.egch-saved-messages-main-content') as HTMLElement).innerHTML = html;
}

async function handleSavedMessagesClick(e: MouseEvent) {
  const container = document.querySelector('#egch-saved-messages-container') as HTMLElement;

  if ((e.target as HTMLElement).closest('.egch-saved-message-item')) {
    closeSavedMessages();
    return;
  }

  if (!(e.target as HTMLElement).closest('#egch-saved-messages')) {
    if (!(e.target as HTMLElement).closest('#egch-saved-messages-container') && container.classList.contains('egch-saved-messages-visible')) {
      closeSavedMessages();
    }
    return;
  }

  const savedMessages = await getSavedMessages();
  const savedMessagesForThisChat = savedMessages.filter(({ groupId }) => groupId === getCurrentGroupId());
  const currentChatUserIds = savedMessagesForThisChat.map(({ userId }) => userId);
  let users = await getUsers();
  users = users.filter(({ id }) => currentChatUserIds.includes(id));
  const currentUser = users.find((user) => isCurrentUser(user.id));
  const meAtFirst = currentUser ? [currentUser, ...users.filter((user) => user.id !== currentUser.id)] : users;
  const usersOptions = [`<option value="all">Everyone</option>`]
  usersOptions.push(...meAtFirst.map((user) => (
    `<option value="${user.id}">${user.name} ${user.id === currentUser?.id ? ' (You)' : ''}</option>`
  )));
  const usersSelect = document.querySelector('#egch-saved-messages-users') as HTMLSelectElement;
  usersSelect.innerHTML = usersOptions.join('\n');

  displayMessages(container);

  if (!container.classList.length) {
    container.classList.add('egch-saved-messages-visible');
  } else {
    container.classList.toggle('egch-saved-messages-visible');
    container.classList.toggle('egch-saved-messages-hidden');
  }
}

export function addSavedMessagesButton() {
  if (document.querySelector('#egch-saved-messages')) return;
  const parent = document.querySelector('div[data-tooltip="Search in this chat"]')?.parentElement?.parentElement;
  if (!parent) return;

  parent.style.position = 'relative';

  document.addEventListener('click', handleSavedMessagesClick);

  document.addEventListener('input', (e) => {
    const container = document.querySelector('#egch-saved-messages-container') as HTMLElement;
    if(!(e.target as HTMLElement).closest('.egch-saved-messages-search')) return;
    const value = (e.target as HTMLInputElement).value;
    displayMessages(container, value);
  });

  document.addEventListener('change', (e) => {
    const container = document.querySelector('#egch-saved-messages-container') as HTMLElement;
    if(!(e.target as HTMLElement).closest('#egch-saved-messages-users') && !(e.target as HTMLElement).closest('#egch-saved-messages-sort')) return;
    displayMessages(container, (document.querySelector('.egch-saved-messages-search') as HTMLInputElement).value);
  });

  parent.insertAdjacentHTML('beforeend', `
  <div class="egch-menu-btn" title="Saved messages for this chat" id="egch-saved-messages" style="border-radius: 100px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    ${saveIcon}
  </div>
  <div id="egch-saved-messages-container">
    <div>
        <div class="egch-saved-messages-toolbar">
          <input class="egch-saved-messages-search" type="text" placeholder="Type to search..." />
          <select id="egch-saved-messages-sort">
            <option value="last_saved" selected>By last saved</option>
            <option value="first_saved">By first saved</option>
            <option value="last_sent">By last sent</option>
            <option value="first_sent">By first sent</option>
          </select>
          <select id="egch-saved-messages-users">
          </select>
        </div>
        <div class="egch-saved-messages-main-content"></div>
    </div>
  </div>
  `)
}

export async function addCopyLinkButton() {
  const menus = [...document.querySelectorAll('div[data-tooltip="More actions"]')];

  const savedMessages = await getSavedMessages();

  const styles = `height: 28px;
                margin: 0 0 0 4px;
                padding: 0;
                width: 28px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                cursor: pointer;`;

  menus.forEach((menu) => {
    if ((menu as HTMLElement)?.parentElement?.querySelector('div[data-btn-id="copy-link"]')) {
      return;
    }

    const info = getMessagesInfo(menu as HTMLElement);
    const isSaved = savedMessages.some(({ groupId, messageId, topicId }) => {
      return groupId === info.groupId && messageId === info.messageId && topicId === info.topicId
    });

    menu.insertAdjacentHTML('beforebegin',
      `<div 
              data-btn-id="copy-link"
              class="egch-menu-btn"
              style="${styles}" title="copy link to clipboard">
              ${linkIcon}
            </div>
            <div 
              data-btn-id="save-btn"
              class="egch-menu-btn"
              style="${styles}" title="${isSaved ? 'Remove from saved messages' : 'save this message'}">
              ${isSaved ? savedIcon : saveIcon}
            </div>`
    )
  });

  if (!eventListenersRegistered) {
    registerEventListeners();
  }
}

function getMessagesInfo(target: HTMLElement) {
  const messageId = (target.closest('div[data-id]') as HTMLElement)?.dataset.id || null;
  const topicId = (target.closest('c-wiz[data-topic-id]') as HTMLElement)?.dataset.topicId || null;
  const groupId = (target.closest('*[data-group-id]') as HTMLElement)?.dataset.groupId || null;
  return { messageId, topicId, groupId };
}

function getLink({ groupId, topicId, messageId }: MessageIds) {
  if (!groupId) {
    console.error('getLink: group id is empty');
    return;
  }
  return `https://chat.google.com/${groupId.replace('space/', 'room/')}/${topicId}${!messageId || messageId === topicId ? '' : `/${messageId}`}`;;
}

function registerEventListeners() {
  console.log('registering event listeners');
  eventListenersRegistered = true;
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const copyButton = target.closest('div[data-btn-id=copy-link]');
    const saveButton = target.closest('div[data-btn-id=save-btn]');

    if (copyButton) {
      const { messageId, topicId, groupId } = getMessagesInfo(target);

      if (!groupId || !topicId) return;

      const link = getLink({ groupId, topicId, messageId });
      if (!link) {
        console.error('could not get the link');
        return;
      }
      copyTextToClipboard(link);

      copyButton.innerHTML = checkIcon;
      setTimeout(() => {
        copyButton.innerHTML = linkIcon;
      }, 1000)
    }

    if (saveButton) {
      const infoWrapper = saveButton.closest('div[data-user-id]') as HTMLElement;
      const userId = infoWrapper.dataset.userId || '';
      const isThread = infoWrapper.dataset.isDetailedThreadView === 'true';

      let userPic, userName, date;
      if (infoWrapper.dataset.isDetailedThreadView === 'true') {
        userPic = (infoWrapper.querySelector('&> div > div > div > div:first-child > div > div > img') as HTMLImageElement)?.src || '';
        userName = (infoWrapper.querySelector('&> div > div > div > div:first-child > div > div ') as HTMLElement)?.dataset.name || '';
        date = (infoWrapper.querySelector('&> div > div > div > div:last-child > div:first-child > div > div > span') as HTMLElement)?.dataset?.absoluteTimestamp || '';
      } else {
        userPic = (infoWrapper.querySelector('&> div > div > div:first-child > div > div > img') as HTMLImageElement)?.src || '';
        userName = (infoWrapper.querySelector('&> div > div > div:last-child > div:first-child > span > span') as HTMLElement)?.dataset.name || '';
        date = (infoWrapper.querySelector('&> div > div > div:last-child > div:first-child > div > div > span') as HTMLElement)?.dataset?.absoluteTimestamp || '';
      }

      let contentDiv = infoWrapper.querySelector(`&> div ${isThread ? '> div ' : ''}> div > div:last-child > div:nth-child(2) > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child`);
      if (contentDiv?.firstChild?.nodeName === 'DIV') {
        contentDiv = contentDiv.firstChild as Element;
      }
      const content = escapeHtml(contentDiv?.textContent || '');


      console.log({userPic, userName, date, content})
      const result = await saveTopic({
        ...getMessagesInfo(target),
        userId, date, content, createdAt: Date.now()
      }, { id: userId, imageUrl: userPic, name: userName  });

      if (result) {
        saveButton.innerHTML = savedIcon;
        saveButton.setAttribute('title', 'Remove from saved messages');
      } else {
        saveButton.innerHTML = saveIcon;
        saveButton.setAttribute('title', 'save this message');
      }
    }
  });
}


async function saveTopic(data: SavedMessage, user: User) {
  if (!data.groupId) {
    console.log('no group id');
    return;
  }
  const storage = chrome.storage.sync;
  const currentSaved = await getSavedMessages();

  const existingIndex = currentSaved.findIndex((item) => {
    return item.topicId === data.topicId && item.groupId === data.groupId && item.messageId === data.messageId;
  });
  if (existingIndex >= 0) {
    await storage.set({
      [STORAGE_KEY_SAVED_MESSAGES]: currentSaved.filter((_, i) => i !== existingIndex)
    });
    return false;
  }

  const savedUsers = await getUsers();
  const newSavedUsers = [
    ...savedUsers.filter((savedUser) => savedUser.id !== data.userId),
    user,
  ];
  await storage.set({
    [STORAGE_KEY_SAVED_MESSAGES_USERS]: newSavedUsers,
  });

  const newSavedMessages: SavedMessage[] = [
    ...(currentSaved || []),
    data
  ];

  await storage.set({
    [STORAGE_KEY_SAVED_MESSAGES]: newSavedMessages,
  });
  return true;
}
