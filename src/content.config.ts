import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const optionalText = z.preprocess((value) => (value == null ? "" : value), z.string());
const optionalFiles = z.preprocess(
  (value) => {
    if (value == null || value === "") return [];
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === "string") return [value];
    return [];
  },
  z.array(z.string()),
);
const optionalBoolean = z.preprocess((value) => Boolean(value), z.boolean());

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/about" }),
  schema: z.object({
    title: z.string().default("关于"),
    lead: z.string().default("一些还没有写完的自我介绍。"),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/projects" }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    english: z.string(),
    order: z.number().int().default(99),
    description: z.string().default(""),
    statusLine: z.string().default("持续整理中"),
    updated: z.string().default(""),
    draft: z.boolean().default(false),
  }),
});

const entries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/entries" }),
  schema: z.object({
    category: z.enum(["study", "collection", "thoughts"]),
    urlSlug: z.string().optional(),
    title: z.string(),
    date: z.coerce.date(),
    summary: optionalText,
    cover: optionalText,
    resources: optionalFiles,
    draft: optionalBoolean,
  }),
});

const places = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/places" }),
  schema: z.object({
    urlSlug: z.string().optional(),
    title: z.string(),
    location: optionalText,
    date: z.coerce.date(),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    summary: optionalText,
    cover: optionalText,
    gallery: optionalFiles,
    draft: optionalBoolean,
  }),
});

const statuses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/statuses" }),
  schema: z.object({
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { about, projects, entries, places, statuses };
