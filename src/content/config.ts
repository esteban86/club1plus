import { defineCollection, z } from "astro:content";

const lang = z.enum(["es", "en"]);

const tiers = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    name: z.string(),
    symbol: z.enum(["plus", "rise", "spark", "equals", "ring"]),
    amount: z.string(),
    note: z.string(),
    accent: z.enum(["green", "coral", "marigold", "ink"]),
    featured: z.boolean().default(false),
    perks: z.array(z.string()),
    order: z.number(),
    urlMonthly: z.string().default(""),
    urlOneTime: z.string().default(""),
  }),
});

const stories = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    name: z.string(),
    role: z.string(),
    quote: z.string().optional(),
    location: z.string().optional(),
    photo: z.string().optional(),
    order: z.number(),
  }),
});

const stats = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    label: z.string(),
    value: z.number(),
    display: z.string(),
    source: z.string().optional(),
    order: z.number(),
  }),
});

const partners = defineCollection({
  type: "content",
  schema: z.object({ lang, name: z.string(), url: z.string().optional(), order: z.number() }),
});

// Casos de renta básica y lecturas/recursos recomendados (página Evidencia).
const evidence = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    kind: z.enum(["case", "resource"]),
    title: z.string(),
    meta: z.string(),               // lugar + años (caso) o autor/tipo (recurso)
    summary: z.string(),
    result: z.string().optional(),  // dato clave (casos)
    url: z.string(),
    source: z.string().optional(),  // nombre de la fuente
    image: z.string().optional(),   // billboard del caso o portada del recurso
    order: z.number(),
  }),
});

const team = defineCollection({
  type: "content",
  schema: z.object({ lang, name: z.string(), role: z.string(), photo: z.string().optional(), order: z.number() }),
});

// Fundadores originales del Club del 1% (el equipo refundador retomó su legado como 1+).
const founders = defineCollection({
  type: "content",
  schema: z.object({ lang, name: z.string(), role: z.string(), photo: z.string().optional(), order: z.number() }),
});

export const collections = { tiers, stories, stats, partners, team, evidence, founders };
