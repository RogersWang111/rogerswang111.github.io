import siteData from "../../content/site.json";

export interface SiteSettings {
  title: string;
  englishTitle: string;
  owner: string;
  kicker: string;
  tagline: string;
  intro: string;
  projectsTitle: string;
  projectsLead: string;
  statusTitle: string;
  statusLead: string;
  statusQuote: string;
  footerNote: string;
  metaDescription: string;
  githubUrl: string;
  wechatUrl: string;
  wechatQr: string;
  wechatLabel: string;
}

const site = siteData as SiteSettings;

export default site;
