document.addEventListener("DOMContentLoaded", function () {
  function injectSidebarTags() {
    if (!Array.isArray(window.siteTagPages) || window.siteTagPages.length === 0) return;
    if (document.querySelector(".sidebar-tags__heading")) return;

    const urlsList = document.querySelector(".sidebar .author__urls");
    if (urlsList) {
      const heading = document.createElement("li");
      heading.className = "sidebar-tags__heading";
      heading.textContent = "Tags";
      urlsList.appendChild(heading);

      window.siteTagPages.forEach(function (tagPage) {
        const item = document.createElement("li");
        item.className = "sidebar-tags__item";

        const link = document.createElement("a");
        link.href = tagPage.url;
        link.textContent = tagPage.title;

        item.appendChild(link);
        urlsList.appendChild(item);
      });
      return;
    }

    const authorContent = document.querySelector(".sidebar .author__content");
    if (!authorContent) return;

    const section = document.createElement("section");
    section.className = "sidebar-tags-fallback";

    const title = document.createElement("div");
    title.className = "sidebar-tags__heading";
    title.textContent = "Tags";
    section.appendChild(title);

    window.siteTagPages.forEach(function (tagPage) {
      const item = document.createElement("div");
      item.className = "sidebar-tags__item";

      const link = document.createElement("a");
      link.href = tagPage.url;
      link.textContent = tagPage.title;

      item.appendChild(link);
      section.appendChild(item);
    });

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

  const lightbox = createLightbox();
  injectSidebarTags();

  document.querySelectorAll(".page__content").forEach(function (content) {
    upgradeYouTubeEmbeds(content);
    upgradeSlideShareEmbeds(content);
    upgradeGoogleSlidesEmbeds(content);
    upgradeGoogleDriveEmbeds(content);
    upgradeGoogleSheetsEmbeds(content);
    upgradeOneDriveEmbeds(content);
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
});
