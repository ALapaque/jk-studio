import { createElement } from "react";
import type { Metadata } from "next";
import { getSiteContent, getAppearance } from "@/lib/content";
import { getContactTemplate } from "@/components/jk/contact-templates";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSiteContent();
  return { title: contact.eyebrow, description: contact.lead };
}

/* Contact. La mise en page vient d'Apparence
 * (`appearance.pageTemplates.contact`), résolue via `contact-templates`. Le
 * formulaire s'envoie normalement en public (`preview` non passé → false). */

export default async function ContactPage() {
  const [content, appearance] = await Promise.all([
    getSiteContent(),
    getAppearance(),
  ]);
  const template = getContactTemplate(appearance.pageTemplates?.contact);
  return createElement(template, { contact: content.contact });
}
