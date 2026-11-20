import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { marked } from 'marked';

marked.use({ breaks: true });

/** Načte jediný záznam kolekce (každá stránka má jeden YAML soubor). */
export async function loadPage<C extends CollectionKey>(collection: C): Promise<CollectionEntry<C>['data']> {
  const [entry] = (await getCollection(collection)) as CollectionEntry<C>[];
  if (!entry) throw new Error(`Chybí obsah: src/content/${collection}.yaml`);
  return entry.data;
}

/** Markdown → HTML (texty z CMS). Jednotlivé zalomení řádku = <br>. */
export const md = (text = '') => marked.parse(text, { async: false });

/** Markdown bez obalového <p> – pro krátké texty v <dd>. */
export const mdInline = (text = '') => marked.parseInline(text.trim(), { async: false });

export const telHref = (tel: string) => `tel:${tel.replace(/\s+/g, '')}`;
