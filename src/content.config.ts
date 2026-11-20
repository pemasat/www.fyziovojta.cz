import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

/** Každá stránka = jeden YAML soubor v src/content/ (upravuje se přes Pages CMS). */
const page = <T extends z.ZodRawShape>(file: string, shape: (ctx: SchemaContext) => T) =>
  defineCollection({
    loader: glob({ pattern: `${file}.yaml`, base: './src/content' }),
    schema: (ctx) =>
      z.object({
        titulek: z.string(),
        popisStranky: z.string(),
        nadpis: z.string(),
        ...shape(ctx),
      }),
  });

const fotka = ({ image }: SchemaContext) =>
  z.object({ obrazek: image(), popis: z.string() });

const polozky = z.array(z.object({ obdobi: z.string(), text: z.string() }));

export const collections = {
  nastaveni: defineCollection({
    loader: glob({ pattern: 'nastaveni.yaml', base: './src/content' }),
    schema: (ctx) =>
      z.object({
        nazevWebu: z.string(),
        jmeno: z.string(),
        telefon: z.string(),
        email: z.email(),
        profilovaFotka: fotka(ctx),
      }),
  }),

  uvod: page('uvod', (ctx) => ({
    uvod: z.string(),
    metoda: z.object({
      nadpis: z.string(),
      levySloupec: z.string(),
      pravySloupec: z.string(),
    }),
    fotka: fotka(ctx),
    vzdelani: z.object({
      nadpis: z.string(),
      odkazNaZivotopis: z.string(),
      fotka: fotka(ctx),
    }),
  })),

  zivotopis: page('zivotopis', (ctx) => ({
    motivace: z.object({ nadpis: z.string(), text: z.string() }),
    vzdelani: z.object({ nadpis: z.string(), polozky }),
    fotka: fotka(ctx),
    praxe: z.object({ nadpis: z.string(), polozky }),
    kurzy: z.object({
      nadpis: z.string(),
      polozky,
      poznamka: z.string().optional(),
      fotka: fotka(ctx),
    }),
  })),

  zkusenosti: page('zkusenosti', (ctx) => ({
    pribehy: z.array(
      z.object({
        nadpis: z.string(),
        fotka: fotka(ctx).optional(),
        text: z.string(),
      }),
    ),
  })),

  kontakt: page('kontakt', (ctx) => ({
    oznameni: z.string().optional(),
    adresa: z.object({ nadpis: z.string(), text: z.string() }),
    cenik: z.object({
      nadpis: z.string(),
      polozky: z.array(z.object({ kdo: z.string(), cena: z.string() })),
      pojistovny: z.string().optional(),
    }),
    kontaktNadpis: z.string(),
    mapa: z.object({
      adresa: z.string(),
      sirka: z.number(),
      delka: z.number(),
    }),
    fotka: fotka(ctx),
  })),
};
