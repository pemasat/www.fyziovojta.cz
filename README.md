# www.fyziovojta.cz

Web Mgr. Markéty Mesany Klemové – statický web v [Astro](https://astro.build), obsah upravitelný přes [Pages CMS](https://pagescms.org), hosting na [Cloudflare Pages](https://pages.cloudflare.com).

## Vývoj

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # výstup do dist/
pnpm preview   # náhled buildu
pnpm check     # kontrola typů a obsahu
```

Vyžaduje Node 22+ a pnpm (`corepack enable` nebo `brew install pnpm`).

## Kde co je

| Co | Kde |
| --- | --- |
| Texty stránek | `src/content/*.yaml` (jeden soubor = jedna stránka, `nastaveni.yaml` = společné údaje) |
| Schéma obsahu (validace) | `src/content.config.ts` |
| Fotky | `src/assets/img/` – v YAML jako `~/assets/img/soubor.jpg`; Astro je zmenší a převede do WebP |
| Šablony stránek | `src/pages/*.astro`, společný layout `src/layouts/Base.astro` |
| Komponenty | `src/components/` (fotka, časová osa `<dl>`, mapa, markdown) |
| Styly | `src/styles/` (SCSS, barvy v `_variables.scss`) |
| Konfigurace CMS | `.pages.yml` |

Delší texty jsou v Markdownu (`**tučně**`, odstavce oddělené prázdným řádkem, jednoduchý konec řádku = `<br>`).

## Úprava obsahu (pro klienta)

1. Otevřít <https://app.pagescms.org> a přihlásit se GitHub účtem.
2. Vybrat repozitář `www.fyziovojta.cz` → stránku vlevo → upravit → **Save**.
3. Za cca 1 minutu je změna na webu (Cloudflare Pages web přestaví sám).

Fotky: v poli „Fotka“ nahrát nový obrázek (ideálně šířka alespoň 960 px).

## Nasazení (Cloudflare Pages)

- Projekt napojený na GitHub repozitář, produkční větev `master`.
- Build command: `pnpm build` (Cloudflare pozná pnpm podle `pnpm-lock.yaml`), output directory: `dist`, proměnná `NODE_VERSION=22`.
- Každá jiná větev dostane náhledovou adresu `<větev>.<projekt>.pages.dev`.
- Vlastní doména `www.fyziovojta.cz` v nastavení projektu → Custom domains.
- Přesměrování `fyziovojta.cz` → `https://www.fyziovojta.cz`: Cloudflare → Rules → Redirect Rules (nebo u registrátora, pokud DNS není u Cloudflare).
