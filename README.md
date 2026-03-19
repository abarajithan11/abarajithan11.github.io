# Aba's Blog - Minimal Mistakes theme

Setup:

* **This repo** - holds the content as markdown files
* **Minimal** Mistakes - theme
* **Jekyll** - build tool, builds on every push
* **GitHub Pages** - where its hosted
* **Custom domain** - `abapages.com` owned in Cloudflare
* **Cloudflare R2 bucket** - Files (images, pdf, video) are stored, with custom domain `media.abapages.com`
* **Old domain** - `aba-pages.xyz` owned in Namecheap, managed in Cloudflare to redirect it to the new domain
* **Formspree** - Contact Me form
* **Giscus** - Per-page comments as GitHub Discussions
* **Search Engine**
  * Google Search Console
  * Bing Webmaster Tools
* **Analytics**
  * Google Analytics 4
  * Microsoft Clarity
  * Cloudflare Analytics


Uploading many files at once via rclone:

```
rclone copy from_dir r2:blog-assets/content/to_dir -P
```