# Aba's Blog - Minimal Mistakes theme

## Setup:

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


## Maintenance:

* **R2 Upload** - Uploading many files at once via rclone:

```
rclone copy from_dir r2:blog-assets/content/to_dir -P
```

* **Tag pages** - After adding/removing/renaming tags in post front matter, run:

```powershell
python .\scripts\generate_tag_pages.py
```

* **Sidebar tag grouping** - `_data/sidebar_tag_hierarchy.yml`
* **Media base URL** - `content_base_url` in `_config.yml`
* **Config changes** - if running locally with `jekyll serve`, restart after editing `_config.yml`

## Front Matter CMS on Windows

This repo now includes a repo-local `frontmatter.json` configured for Jekyll with a native Windows start command:

* `frontmatter.json`
* `.frontmatter/scripts/start-jekyll-windows.ps1`

### One-time Windows setup

Install Ruby via **RubyInstaller with DevKit** on Windows, then from a normal PowerShell in this repo run:

```powershell
bundle install
```

If `bundle` is not found after installing RubyInstaller, reopen PowerShell so the Ruby `bin` directory is on `PATH`.

### VS Code usage

1. Install the **Front Matter CMS** extension in VS Code.
2. Open this repo in VS Code on Windows.
3. Open the Front Matter panel.
4. Use the **Start server** action. Front Matter will run `bundle exec jekyll serve --livereload --host localhost --port 4000`.
5. Use **Open preview** to view the current page at `http://localhost:4000`.

### Notes

* New posts created in `_posts` get a Jekyll-style `YYYY-MM-DD-` filename prefix.
* New pages created in `_pages` do not get that date prefix.
* The Front Matter tag/category pickers are pre-seeded from the current blog taxonomy.
* The media manager only sees files in the repo `assets` folder. It does **not** upload to Cloudflare R2.
* The repo still contains WSL helper scripts from earlier experiments, but Front Matter no longer uses them.
* `jekyll-algolia` was removed from the local bundle because this repo does not appear to use Algolia config, and it pulls in `nokogiri`, which complicates native Windows setup unnecessarily.
* Front Matter may launch commands in a Git Bash terminal profile where `bundle` is not on `PATH`. The Windows launcher script avoids that by invoking RubyInstaller's `bundle.bat` explicitly.
