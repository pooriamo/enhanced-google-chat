import hljs from 'highlight.js';
// import { escapeHtml } from "./utils.ts";

hljs.configure({
  ignoreUnescapedHTML: true,
});

const aliases: string[] = [];

hljs.listLanguages().forEach((lang) => {
  const data = hljs.getLanguage(lang);

  if (!data?.aliases && data?.name && !aliases.includes(data.name)) {
    aliases.push(data.name);
  }

  data?.aliases?.forEach((alias) => {
    if (!aliases.includes(alias)) aliases.push(alias);
  });
});

hljs.addPlugin({
  "before:highlightElement": ({ el }) => { el.textContent = (el as HTMLElement).innerText }
});

export function highlightAll() {
  const result = document.evaluate("//span[normalize-space()='```']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  const elements = [];
  for (let i = 0; i < result.snapshotLength; i++) {
    const node = result.snapshotItem(i);
    if (i % 2 === 0) {
      elements.push(node);
    }
  }

  elements.forEach(element => {
    if ((element as HTMLElement)?.dataset?.highlighted) return;
    const codeBlock = (element as HTMLElement).nextSibling as HTMLElement | null;
    if (!codeBlock) return;

    const content = codeBlock.innerText;
    if (!content) return;
    const language = codeBlock.firstChild?.textContent?.replace(/\n/g, '').toLowerCase().trim() || '';
    const hasLanguage = codeBlock.firstChild && aliases.includes(language);

    if (hasLanguage) {
      codeBlock.firstChild.remove();
      codeBlock.classList.add(`language-${language}`);
      const secondChild = codeBlock.firstChild;
      if (!secondChild?.textContent?.replace(/\n/g, '').trim()) {
        secondChild?.remove();
      }
    }
    hljs.highlightElement(codeBlock);
    (element as HTMLElement).dataset.highlighted = '1';
  });
}
