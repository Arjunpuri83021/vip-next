export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vipmilfnut.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl.replace(/^https?:\/\//, ''),
  }
}
