import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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

const statuses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/statuses" }),
  schema: z.object({
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { about, projects, statuses };
