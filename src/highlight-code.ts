import hljs from 'highlight.js';
import { escapeHtml } from "./utils.ts";

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
    let code = content;
    const lines = content.split('\n');

    const hasLanguage = aliases.includes(lines[0].toLocaleLowerCase());
    let lang = '';
    if (hasLanguage) {
      code = lines.slice(1).join('\n');
      lang = ` class="language-${lines[0].toLocaleLowerCase()}"`;
    }
    codeBlock.insertAdjacentHTML('afterend', '<pre class="theme-stackoverflow-dark"><code'+ lang +'>'+escapeHtml(code)+'</code></pre>');
    codeBlock.remove();
    hljs.highlightAll();

    (element as HTMLElement).dataset.highlighted = '1';
  });
}
