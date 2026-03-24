let revealObserver;
let sectionObserver;

const fallbackData = {
  site: {
    title: "Developer Portfolio",
    description: "Developer portfolio website",
    lang: "ko",
    baseUrl: "",
    repoName: "",
    themeColor: "#1459ba",
  },
  profile: {
    name: "Your Name",
    role: "Developer",
    tagline: "Build products with impact",
    location: "",
    email: "",
    resumeUrl: "",
    avatarUrl: "",
    bio: "",
  },
  highlights: [],
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  contacts: {
    email: "",
    github: "",
    blog: "",
    linkedin: "",
  },
  meta: {
    version: 1,
    updatedAt: "",
  },
};

async function loadPortfolioData() {
  try {
    const response = await fetch("assets/portfolio-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return fallbackData;
  }
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return null;
  const normalized = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function adjustHex(hex, amount) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const clamp = (value) => Math.max(0, Math.min(255, value));
  const toHex = (value) => clamp(value).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r + amount)}${toHex(rgb.g + amount)}${toHex(rgb.b + amount)}`;
}

function setMetaTag(selector, attr, value) {
  if (!value) return;
  const node = document.querySelector(selector);
  if (node) node.setAttribute(attr, value);
}

function applySiteMetadata(site) {
  const data = site || {};
  document.documentElement.lang = data.lang || "ko";

  if (data.title) document.title = data.title;
  setMetaTag('meta[name="description"]', "content", data.description);
  setMetaTag('meta[property="og:title"]', "content", data.title);
  setMetaTag('meta[property="og:description"]', "content", data.description);

  const baseUrl = (data.baseUrl || "").replace(/\/$/, "");
  if (baseUrl) {
    setMetaTag('meta[property="og:url"]', "content", baseUrl);
    setMetaTag('meta[property="og:image"]', "content", `${baseUrl}/assets/og-image.svg`);
  }

  if (data.themeColor) {
    setMetaTag('meta[name="theme-color"]', "content", data.themeColor);
    document.documentElement.style.setProperty("--accent", data.themeColor);
    document.documentElement.style.setProperty("--accent-strong", adjustHex(data.themeColor, -28));

    const rgb = hexToRgb(data.themeColor);
    if (rgb) {
      document.documentElement.style.setProperty(
        "--accent-soft",
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`
      );
    }
  }
}

function setActiveNavLink(targetHash) {
  const navLinks = document.querySelectorAll("[data-nav-link]");
  navLinks.forEach((navLink) => {
    navLink.classList.toggle("is-active", navLink.getAttribute("href") === targetHash);
  });
}

function setText(selector, value) {
  if (value === undefined || value === null || value === "") return;
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function sanitizeLinkText(url) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function renderProfile(profile, contacts) {
  const data = profile || {};
  setText('[data-field="name"]', data.name);
  setText('[data-field="name-footer"]', data.name);
  setText('[data-field="role"]', data.role);
  setText('[data-field="role-footer"]', data.role);
  setText('[data-field="tagline"]', data.tagline);
  setText('[data-field="bio"]', data.bio);
  setText('[data-field="location"]', data.location);
  setText('[data-field="name-short"]', data.name || "Portfolio");

  const primaryEmail = data.email || contacts?.email || "";
  const heroEmail = document.getElementById("hero-email");
  if (heroEmail) {
    if (primaryEmail) {
      heroEmail.href = `mailto:${primaryEmail}`;
      heroEmail.textContent = primaryEmail;
    } else {
      heroEmail.style.display = "none";
    }
  }

  const resumeLink = document.getElementById("hero-resume");
  if (resumeLink) {
    if (data.resumeUrl) {
      resumeLink.href = data.resumeUrl;
    } else {
      resumeLink.style.display = "none";
    }
  }
}

function renderAboutHighlights(highlights) {
  const list = document.getElementById("about-highlights");
  if (!list) return;
  const items = Array.isArray(highlights) ? highlights : [];

  if (!items.length) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderSkills(skills) {
  const list = document.getElementById("skills-list");
  if (!list) return;

  const groups = Array.isArray(skills) ? skills : [];
  list.innerHTML = groups
    .map(
      (group, index) => `
        <article class="skill-group reveal" style="--stagger:${index}">
          <h3>${group.category || "Category"}</h3>
          <ul class="badge-list">
            ${(group.items || []).map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function projectLinks(project) {
  const links = [];
  if (project.repoUrl) {
    links.push(
      `<a href="${project.repoUrl}" target="_blank" rel="noreferrer noopener">Repository</a>`
    );
  }

  if (project.demoUrl) {
    links.push(
      `<a href="${project.demoUrl}" target="_blank" rel="noreferrer noopener">Live Demo</a>`
    );
  } else {
    links.push('<span class="project-link-disabled">Live Demo pending</span>');
  }

  if (project.docUrl) {
    links.push(
      `<a href="${project.docUrl}" target="_blank" rel="noreferrer noopener">Document</a>`
    );
  }

  return links.join("");
}

function renderProjects(projects) {
  const list = document.getElementById("projects-list");
  if (!list) return;

  const items = Array.isArray(projects) ? projects : [];
  list.innerHTML = items
    .map(
      (project, index) => `
        <article class="project-card reveal" style="--stagger:${index}">
          <div class="project-head">
            <h3>${project.title || "Untitled"}</h3>
            ${project.featured ? '<span class="feature-badge">Featured</span>' : ""}
          </div>
          <p class="project-period">${project.period || ""}</p>
          <p>${project.description || ""}</p>
          <ul class="badge-list">
            ${(project.tech || []).map((tech) => `<li>${tech}</li>`).join("")}
          </ul>
          <ul class="project-highlights">
            ${(project.highlights || []).map((line) => `<li>${line}</li>`).join("")}
          </ul>
          <div class="project-links">
            ${projectLinks(project)}
          </div>
        </article>
      `
    )
    .join("");
}

function renderExperience(experience) {
  const list = document.getElementById("experience-list");
  if (!list) return;

  const items = Array.isArray(experience) ? experience : [];
  list.innerHTML = items
    .map(
      (item, index) => `
        <li class="experience-item reveal" style="--stagger:${index}">
          <h3>${item.company || ""}</h3>
          <p class="experience-meta">${item.role || ""} ? ${item.period || ""}</p>
          <p class="experience-description">${item.description || ""}</p>
          <ul class="experience-bullets">
            ${(item.bullets || []).map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </li>
      `
    )
    .join("");
}

function renderEducation(education) {
  const list = document.getElementById("education-list");
  if (!list) return;

  const items = Array.isArray(education) ? education : [];
  list.innerHTML = items
    .map(
      (item) => `
        <li>
          <p class="subpanel-title">${item.school || ""}</p>
          <p class="subpanel-meta">${item.major || ""} ? ${item.period || ""}</p>
          ${(item.details || []).length ? `<p class="subpanel-detail">${item.details.join(", ")}</p>` : ""}
        </li>
      `
    )
    .join("");
}

function renderCertifications(certifications) {
  const list = document.getElementById("certifications-list");
  if (!list) return;

  const items = Array.isArray(certifications) ? certifications : [];
  list.innerHTML = items
    .map(
      (item) => `
        <li>
          <p class="subpanel-title">${item.name || ""}</p>
          <p class="subpanel-meta">${item.issuer || ""}</p>
          <p class="subpanel-detail">${item.date || ""}</p>
        </li>
      `
    )
    .join("");
}

function renderContacts(contacts, profile) {
  const data = contacts || {};
  const fallbackEmail = profile?.email || "";
  const emailValue = data.email || fallbackEmail;

  const email = document.getElementById("contact-email");
  const github = document.getElementById("contact-github");
  const blog = document.getElementById("contact-blog");
  const linkedin = document.getElementById("contact-linkedin");

  if (email) {
    if (emailValue) {
      email.href = `mailto:${emailValue}`;
      email.textContent = emailValue;
    } else {
      email.parentElement?.remove();
    }
  }

  if (github) {
    if (data.github) {
      github.href = data.github;
      github.textContent = sanitizeLinkText(data.github);
    } else {
      github.parentElement?.remove();
    }
  }

  if (blog) {
    if (data.blog) {
      blog.href = data.blog;
      blog.textContent = sanitizeLinkText(data.blog);
    } else {
      blog.parentElement?.remove();
    }
  }

  if (linkedin) {
    if (data.linkedin) {
      linkedin.href = data.linkedin;
      linkedin.textContent = sanitizeLinkText(data.linkedin);
    } else {
      linkedin.parentElement?.remove();
    }
  }
}

function renderMeta(meta) {
  const updatedNode = document.getElementById("updated-at");
  if (updatedNode && meta?.updatedAt) {
    updatedNode.textContent = meta.updatedAt;
  }
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      if (link.hasAttribute("data-nav-link")) {
        setActiveNavLink(targetId);
      }

      const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
    });
  });
}

function initSectionObserver() {
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const visibleRatios = new Map(sections.map((section) => [section.id, 0]));

  if (sectionObserver) sectionObserver.disconnect();

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let activeSection = sections[0];
      sections.forEach((section) => {
        if (visibleRatios.get(section.id) > visibleRatios.get(activeSection.id)) {
          activeSection = section;
        }
      });

      if (activeSection && visibleRatios.get(activeSection.id) === 0) {
        const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
        activeSection = sections.reduce((closest, section) => {
          const currentDistance = Math.abs(
            section.getBoundingClientRect().top - headerHeight - 24
          );
          const closestDistance = Math.abs(
            closest.getBoundingClientRect().top - headerHeight - 24
          );
          return currentDistance < closestDistance ? section : closest;
        }, sections[0]);
      }

      if (activeSection) {
        setActiveNavLink(`#${activeSection.id}`);
      }
    },
    {
      threshold: [0, 0.2, 0.4, 0.6, 0.8],
      rootMargin: "-25% 0px -45% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
  if (sections[0]) setActiveNavLink(`#${sections[0].id}`);
}

function initRevealObserver() {
  const nodes = document.querySelectorAll(".reveal");
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  nodes.forEach((node) => revealObserver.observe(node));
}

function initYear() {
  const yearNode = document.getElementById("current-year");
  if (yearNode) yearNode.textContent = new Date().getFullYear();
}

async function init() {
  const data = await loadPortfolioData();
  applySiteMetadata(data.site);
  renderProfile(data.profile, data.contacts);
  renderAboutHighlights(data.highlights);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderExperience(data.experience);
  renderEducation(data.education);
  renderCertifications(data.certifications);
  renderContacts(data.contacts, data.profile);
  renderMeta(data.meta);

  initSmoothScroll();
  initSectionObserver();
  initRevealObserver();
  initYear();
}

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => console.error(error));
});
