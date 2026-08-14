export default function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, ""); 
}
