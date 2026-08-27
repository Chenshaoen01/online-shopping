import { SITE_URL } from "@/siteConfig"

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/User/Cart', '/User/Order'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
