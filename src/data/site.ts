import siteData from "../../content/site.json";

export interface SiteSettings {
  title: string;
  englishTitle: string;
  owner: string;
  kicker: string;
  tagline: string;
  intro: string;
  footerNote: string;
  metaDescription: string;
}

const site = siteData as SiteSettings;

export default site;
