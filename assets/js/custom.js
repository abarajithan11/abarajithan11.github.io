document.addEventListener("DOMContentLoaded", function () {
  function normalizePathname(pathname) {
    if (!pathname) return "/";
    const normalized = pathname.replace(/\/+$/, "");
    return normalized === "" ? "/" : normalized;
  }

  function hideHomeNavOnHomepage() {
    if (normalizePathname(window.location.pathname) !== "/") return;

    document.querySelectorAll(".greedy-nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;

      let linkPathname = href;
      try {
        linkPathname = new URL(href, window.location.origin).pathname;
      } catch (_error) {
        return;
      }

      if (normalizePathname(linkPathname) !== "/") return;
      if (link.textContent.trim() !== "Home") return;

      const listItem = link.closest("li");
      if (listItem) {
        listItem.style.display = "none";
      } else {
        link.style.display = "none";
      }
    });
  }

  function updateSidebarAllPostsCount() {
    if (!Array.isArray(window.sitePostCards) || window.sitePostCards.length === 0) {
      return;
    }

    const postCount = window.sitePostCards.length;

    document.querySelectorAll(".sidebar .author__urls a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;

      let linkPathname = href;
      try {
        linkPathname = new URL(href, window.location.origin).pathname;
      } catch (_error) {
        return;
      }

      if (normalizePathname(linkPathname) !== "/posts") return;
      if (!link.textContent.trim().startsWith("All posts")) return;

      const labelElement = Array.from(link.querySelectorAll("span, strong, em")).find(
        function (node) {
          return node.textContent.trim().startsWith("All posts");
        }
      );

      const newLabelText = `All posts (${postCount})`;
      if (labelElement) {
        labelElement.textContent = newLabelText;
        return;
      }

      const labelNode = Array.from(link.childNodes).find(function (node) {
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "";
      });

      const newLabel = ` ${newLabelText}`;
      if (labelNode) {
        labelNode.textContent = newLabel;
      } else {
        link.appendChild(document.createTextNode(newLabel));
      }
    });
  }

  function createTagLink(tagPage) {
    const link = document.createElement("a");
    link.href = tagPage.url;
    const countSuffix =
      typeof tagPage.count === "number" ? ` (${tagPage.count})` : "";
    link.textContent = `${tagPage.title}${countSuffix}`;
    return link;
  }

  function createTagItem(tagPage, tagNameOverride) {
    const item = document.createElement("li");
    item.className = "sidebar-tags__item";

    const link = createTagLink(tagPage);
    if (tagNameOverride) link.textContent = tagNameOverride;

    item.appendChild(link);
    return item;
  }

  function buildSidebarTagNodes() {
    if (!Array.isArray(window.siteTagPages) || window.siteTagPages.length === 0) {
      return [];
    }

    const tagPagesByTitle = new Map();
    window.siteTagPages.forEach(function (tagPage) {
      tagPagesByTitle.set(tagPage.title, tagPage);
    });

    const groupedTitles = new Set();
    const nodes = [];

    if (Array.isArray(window.siteTagHierarchy)) {
      window.siteTagHierarchy.forEach(function (group) {
        if (!group || !group.title || !Array.isArray(group.children)) return;

        const childPages = group.children
          .map(function (childTitle) {
            const tagPage = tagPagesByTitle.get(childTitle);
            if (tagPage) groupedTitles.add(childTitle);
            return tagPage || null;
          })
          .filter(Boolean);

        if (childPages.length === 0) return;

        const item = document.createElement("li");
        item.className = "sidebar-tags__group";

        const details = document.createElement("details");

        const summary = document.createElement("summary");
        summary.textContent = group.title;
        details.appendChild(summary);

        const childList = document.createElement("ul");
        childList.className = "sidebar-tags__children";

        childPages.forEach(function (tagPage) {
          childList.appendChild(createTagItem(tagPage));
        });

        details.appendChild(childList);
        item.appendChild(details);
        nodes.push(item);
      });
    }

    window.siteTagPages.forEach(function (tagPage) {
      if (groupedTitles.has(tagPage.title)) return;
      nodes.push(createTagItem(tagPage));
    });

    return nodes;
  }

  function injectSidebarTags() {
    if (!Array.isArray(window.siteTagPages) || window.siteTagPages.length === 0) return;
    if (document.querySelector(".sidebar-tags__heading")) return;

    const tagNodes = buildSidebarTagNodes();
    if (tagNodes.length === 0) return;

    const urlsList = document.querySelector(".sidebar .author__urls");
    if (urlsList) {
      const heading = document.createElement("li");
      heading.className = "sidebar-tags__heading";
      heading.textContent = "Tag Groups";
      urlsList.appendChild(heading);

      tagNodes.forEach(function (node) {
        urlsList.appendChild(node);
      });
      return;
    }

    const authorContent = document.querySelector(".sidebar .author__content");
    if (!authorContent) return;

    const section = document.createElement("section");
    section.className = "sidebar-tags-fallback";

    const title = document.createElement("div");
    title.className = "sidebar-tags__heading";
    title.textContent = "Tag Groups";
    section.appendChild(title);

    const list = document.createElement("ul");
    list.className = "author__urls social-icons";

    tagNodes.forEach(function (node) {
      list.appendChild(node);
    });

    section.appendChild(list);
    authorContent.insertAdjacentElement("afterend", section);
  }

  function createLightbox() {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="lightbox__inner">
        <button class="lightbox__close" type="button" aria-label="Close image viewer">×</button>
        <img class="lightbox__image" alt="">
        <div class="lightbox__caption"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector(".lightbox__close");
    const image = overlay.querySelector(".lightbox__image");
    const caption = overlay.querySelector(".lightbox__caption");

    function closeLightbox() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.display = "none";
      image.removeAttribute("src");
      image.alt = "";
      caption.textContent = "";
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
    }

    function openLightbox(sourceImage) {
      image.src = sourceImage.currentSrc || sourceImage.src;
      image.alt = sourceImage.alt || "";
      caption.textContent = sourceImage.alt || "";
      overlay.style.display = "flex";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeLightbox();
    });

    closeButton.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeLightbox();
      }
    });

    return { openLightbox };
  }

  function parseTime(value) {
    if (!value) return 0;
    if (/^\d+$/.test(value)) return parseInt(value, 10);

    let total = 0;
    const matches = value.matchAll(/(\d+)(h|m|s)/g);
    for (const match of matches) {
      const amount = parseInt(match[1], 10);
      const unit = match[2];
      if (unit === "h") total += amount * 3600;
      if (unit === "m") total += amount * 60;
      if (unit === "s") total += amount;
    }
    return total;
  }

  function getYouTubeEmbedUrl(rawUrl) {
    let url;

    try {
      url = new URL(rawUrl);
    } catch (_error) {
      return null;
    }

    let videoId = "";
    let playlistId = "";
    let start = 0;

    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
      start = parseTime(url.searchParams.get("t"));
    } else if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
        playlistId = url.searchParams.get("list") || "";
        start = parseTime(url.searchParams.get("t"));
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2] || "";
        playlistId = url.searchParams.get("list") || "";
        start = parseTime(url.searchParams.get("start"));
      } else if (url.pathname === "/playlist") {
        playlistId = url.searchParams.get("list") || "";
      }
    }

    if (videoId === "videoseries") {
      videoId = "";
      playlistId = url.searchParams.get("list") || playlistId;
    }

    if (!videoId && !playlistId) return null;

    const embedUrl = new URL(
      videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "https://www.youtube.com/embed/videoseries"
    );

    if (playlistId) embedUrl.searchParams.set("list", playlistId);
    if (start > 0) embedUrl.searchParams.set("start", String(start));

    return embedUrl.toString();
  }

  function getSlideShareEmbedUrl(rawUrl) {
    let url;

    try {
      url = new URL(rawUrl);
    } catch (_error) {
      return null;
    }

    if (!url.hostname.includes("slideshare.net")) return null;

    if (url.pathname.includes("/slideshow/embed_code/key/")) {
      return url.toString();
    }

    return null;
  }

  function getGoogleSlidesEmbedUrl(rawUrl) {
    let url;

    try {
      url = new URL(rawUrl);
    } catch (_error) {
      return null;
    }

    if (url.hostname !== "docs.google.com") return null;
    if (!url.pathname.includes("/presentation/")) return null;
    if (!url.pathname.endsWith("/embed")) return null;

    url.protocol = "https:";
    return url.toString();
  }

  function getGoogleDrivePreviewUrl(rawUrl) {
    let url;

    try {
      url = new URL(rawUrl);
    } catch (_error) {
      return null;
    }

    if (url.hostname !== "drive.google.com") return null;
    if (!url.pathname.endsWith("/preview")) return null;

    url.protocol = "https:";
    return url.toString();
  }

  function getGoogleSheetsEmbedUrl(rawUrl) {
    let url;

    try {
      url = new URL(rawUrl);
    } catch (_error) {
      return null;
    }

    if (url.hostname !== "docs.google.com") return null;
    if (!url.pathname.includes("/spreadsheets/")) return null;
    if (!url.pathname.endsWith("/pubhtml")) return null;

    url.protocol = "https:";
    return url.toString();
  }

  function getOneDriveEmbedUrl(rawUrl) {
    let url;

    try {
      url = new URL(rawUrl);
    } catch (_error) {
      return null;
    }

    if (url.hostname !== "onedrive.live.com") return null;
    if (!url.pathname.endsWith("/embed")) return null;

    url.protocol = "https:";
    return url.toString();
  }

  function isStandaloneLinkParagraph(node) {
    if (!node || node.tagName !== "P") return false;
    if (node.childElementCount !== 1) return false;

    const child = node.firstElementChild;
    if (!child || child.tagName !== "A") return false;

    return node.textContent.trim() === child.textContent.trim();
  }

  function buildPostCardMap() {
    if (!Array.isArray(window.sitePostCards)) return new Map();

    const cards = new Map();
    window.sitePostCards.forEach(function (record) {
      if (!record || !record.url) return;
      cards.set(normalizePathname(record.url), record);
    });
    return cards;
  }

  function isSameOriginUrl(href) {
    try {
      return new URL(href, window.location.origin).origin === window.location.origin;
    } catch (_error) {
      return false;
    }
  }

  function createPostPreviewCard(record) {
    const wrapper = document.createElement("div");
    wrapper.className = "link-preview-block";

    const card = document.createElement("a");
    card.className = "post-card link-preview-card";
    card.href = record.url;

    if (record.teaser) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "post-card__image link-preview-card__image";

      const image = document.createElement("img");
      image.src = record.teaser;
      image.alt = record.title || "";
      image.loading = "lazy";

      imageWrap.appendChild(image);
      card.appendChild(imageWrap);
    }

    const body = document.createElement("div");
    body.className = "post-card__body";

    const title = document.createElement("h3");
    title.className = "post-card__title";
    title.textContent = record.title || record.url;
    body.appendChild(title);

    if (record.date) {
      const meta = document.createElement("div");
      meta.className = "post-card__meta";
      meta.textContent = record.date;
      body.appendChild(meta);
    }

    if (record.excerpt) {
      const excerpt = document.createElement("p");
      excerpt.className = "post-card__excerpt";
      excerpt.textContent = record.excerpt;
      body.appendChild(excerpt);
    }

    card.appendChild(body);
    wrapper.appendChild(card);
    return wrapper;
  }

  function createEmbedBlock(paragraph, embedUrl, options) {
    const wrapper = document.createElement("div");
    wrapper.className = `embed-block ${options.wrapperClass}`;

    const frame = document.createElement("div");
    frame.className = options.frameClass;

    const iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.title = options.defaultTitle;
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;

    if (options.allow) iframe.allow = options.allow;
    if (options.referrerPolicy) iframe.referrerPolicy = options.referrerPolicy;

    frame.appendChild(iframe);
    wrapper.appendChild(frame);

    const link = paragraph.firstElementChild;
    const label = link.textContent.trim();
    if (
      label &&
      label.toLowerCase() !== "embedded media" &&
      label !== link.href
    ) {
      const caption = document.createElement("div");
      caption.className = "video-embed__caption";
      caption.textContent = label;
      wrapper.appendChild(caption);
    }

    paragraph.replaceWith(wrapper);
  }

  function upgradeInternalPostLinks(content) {
    const postCardMap = buildPostCardMap();
    if (postCardMap.size === 0) return;

    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      if (!link || !isSameOriginUrl(link.href)) return;

      const pathname = normalizePathname(new URL(link.href, window.location.origin).pathname);
      const record = postCardMap.get(pathname);
      if (!record) return;

      paragraph.replaceWith(createPostPreviewCard(record));
    });
  }

  function upgradeYouTubeEmbeds(content) {
    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      const embedUrl = getYouTubeEmbedUrl(link.href);
      if (!embedUrl) return;

      createEmbedBlock(paragraph, embedUrl, {
        wrapperClass: "video-embed",
        frameClass: "video-embed__frame",
        defaultTitle: link.textContent.trim() || "YouTube video",
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        referrerPolicy: "strict-origin-when-cross-origin"
      });
    });
  }

  function upgradeSlideShareEmbeds(content) {
    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      const embedUrl = getSlideShareEmbedUrl(link.href);
      if (!embedUrl) return;

      createEmbedBlock(paragraph, embedUrl, {
        wrapperClass: "slides-embed",
        frameClass: "slides-embed__frame",
        defaultTitle: link.textContent.trim() || "SlideShare presentation"
      });
    });
  }

  function upgradeGoogleSlidesEmbeds(content) {
    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      const embedUrl = getGoogleSlidesEmbedUrl(link.href);
      if (!embedUrl) return;

      createEmbedBlock(paragraph, embedUrl, {
        wrapperClass: "presentation-embed",
        frameClass: "presentation-embed__frame",
        defaultTitle: link.textContent.trim() || "Google Slides presentation"
      });
    });
  }

  function upgradeGoogleDriveEmbeds(content) {
    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      const embedUrl = getGoogleDrivePreviewUrl(link.href);
      if (!embedUrl) return;

      createEmbedBlock(paragraph, embedUrl, {
        wrapperClass: "document-embed",
        frameClass: "document-embed__frame",
        defaultTitle: link.textContent.trim() || "Google Drive document"
      });
    });
  }

  function upgradeGoogleSheetsEmbeds(content) {
    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      const embedUrl = getGoogleSheetsEmbedUrl(link.href);
      if (!embedUrl) return;

      createEmbedBlock(paragraph, embedUrl, {
        wrapperClass: "document-embed",
        frameClass: "document-embed__frame",
        defaultTitle: link.textContent.trim() || "Google Sheets document"
      });
    });
  }

  function upgradeOneDriveEmbeds(content) {
    content.querySelectorAll("p").forEach(function (paragraph) {
      if (!isStandaloneLinkParagraph(paragraph)) return;

      const link = paragraph.firstElementChild;
      const embedUrl = getOneDriveEmbedUrl(link.href);
      if (!embedUrl) return;

      createEmbedBlock(paragraph, embedUrl, {
        wrapperClass: "presentation-embed",
        frameClass: "presentation-embed__frame",
        defaultTitle: link.textContent.trim() || "OneDrive presentation"
      });
    });
  }

  function isImageOnlyParagraph(node) {
    if (!node || node.tagName !== "P") return false;
    if (node.childElementCount !== 1) return false;

    const child = node.firstElementChild;
    if (!child) return false;
    if (child.tagName === "IMG") return true;

    return (
      child.tagName === "A" &&
      child.childElementCount === 1 &&
      child.firstElementChild.tagName === "IMG"
    );
  }

  function enableImageLightbox(content, lightbox) {
    content.querySelectorAll("img").forEach(function (image) {
      if (image.closest(".lightbox")) return;
      if (image.closest(".post-card")) return;

      image.addEventListener("click", function (event) {
        const link = image.closest("a");
        if (link) event.preventDefault();
        lightbox.openLightbox(image);
      });
    });
  }

  function injectGiscusComments() {
    if (!window.pageContext || !window.pageContext.isPost) return;
    if (!window.pageContext.commentsEnabled) return;
    if (document.querySelector(".giscus")) return;

    const articleContent = document.querySelector(".page__content");
    if (!articleContent) return;

    const commentsSection = document.createElement("section");
    commentsSection.className = "page__comments";

    const title = document.createElement("h4");
    title.className = "page__comments-title";
    title.textContent = "Comments";
    commentsSection.appendChild(title);

    const container = document.createElement("div");
    container.className = "page__comments-body";
    commentsSection.appendChild(container);

    articleContent.insertAdjacentElement("afterend", commentsSection);

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    const config = window.giscusConfig || {};
    script.setAttribute("data-repo", config.repo || "");
    script.setAttribute("data-repo-id", config.repoId || "");
    script.setAttribute("data-category", config.category || "");
    script.setAttribute("data-category-id", config.categoryId || "");
    script.setAttribute("data-mapping", config.mapping || "pathname");
    script.setAttribute("data-strict", config.strict || "0");
    script.setAttribute(
      "data-reactions-enabled",
      config.reactionsEnabled || "1"
    );
    script.setAttribute("data-emit-metadata", config.emitMetadata || "0");
    script.setAttribute("data-input-position", config.inputPosition || "top");
    script.setAttribute("data-theme", config.theme || "light");
    script.setAttribute("data-lang", config.lang || "en");
    script.setAttribute("data-loading", config.loading || "lazy");

    container.appendChild(script);
  }

  const lightbox = createLightbox();
  hideHomeNavOnHomepage();
  injectSidebarTags();
  updateSidebarAllPostsCount();

  document.querySelectorAll(".page__content").forEach(function (content) {
    upgradeYouTubeEmbeds(content);
    upgradeSlideShareEmbeds(content);
    upgradeGoogleSlidesEmbeds(content);
    upgradeGoogleDriveEmbeds(content);
    upgradeGoogleSheetsEmbeds(content);
    upgradeOneDriveEmbeds(content);
    upgradeInternalPostLinks(content);
    enableImageLightbox(content, lightbox);

    let node = content.firstElementChild;

    while (node) {
      if (!isImageOnlyParagraph(node)) {
        node = node.nextElementSibling;
        continue;
      }

      const run = [];
      let cursor = node;

      while (cursor && isImageOnlyParagraph(cursor)) {
        run.push(cursor);
        cursor = cursor.nextElementSibling;
      }

      if (run.length >= 2) {
        const gallery = document.createElement("div");
        gallery.className = "entry-gallery";
        run[0].before(gallery);

        run.forEach(function (item) {
          gallery.appendChild(item);
        });
      }

      node = cursor;
    }
  });

  injectGiscusComments();
});
