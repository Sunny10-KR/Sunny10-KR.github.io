const portfolioData = {
  profile: {
    name: "홍길동",
    role: "Frontend Developer",
    tagline: "사용자 경험을 제품 경쟁력으로 연결하는 프론트엔드 개발자",
    bio: "문제의 본질을 빠르게 파악하고, 사용자가 체감하는 속도와 명확한 인터랙션을 중심으로 웹 서비스를 설계합니다. 협업 과정에서는 예측 가능한 컴포넌트 구조와 테스트 가능한 코드 스타일을 우선합니다.",
  },
  skills: [
    {
      category: "Frontend Core",
      items: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React"],
    },
    {
      category: "UI Engineering",
      items: ["Responsive Design", "Accessibility", "Design Systems", "Animation"],
    },
    {
      category: "Performance",
      items: ["Lighthouse", "Web Vitals", "Code Splitting", "Asset Optimization"],
    },
    {
      category: "Collaboration",
      items: ["Git/GitHub", "Figma", "Jira", "Notion"],
    },
  ],
  projects: [
    {
      title: "서비스 랜딩 페이지 리뉴얼",
      description:
        "첫 방문 사용자의 이해도를 높이기 위해 정보 구조를 재구성하고 핵심 전환 흐름을 단순화한 프로젝트입니다.",
      tech: ["HTML", "CSS", "JavaScript"],
      repoUrl: "https://github.com/<github-username>/landing-redesign",
      demoUrl: "https://<github-username>.github.io/landing-redesign/",
      highlights: [
        "핵심 섹션 우선순위 재배치로 초기 이탈 구간을 개선",
        "이미지 최적화와 CSS 정리로 페이지 로딩 속도 개선",
      ],
    },
    {
      title: "대시보드 컴포넌트 라이브러리",
      description:
        "반복되는 UI 패턴을 표준화하기 위해 카드, 테이블, 차트 래퍼를 공통 컴포넌트로 정리한 프로젝트입니다.",
      tech: ["TypeScript", "React", "Storybook"],
      repoUrl: "https://github.com/<github-username>/dashboard-ui-kit",
      demoUrl: "https://<github-username>.github.io/dashboard-ui-kit/",
      highlights: [
        "재사용 가능한 UI 템플릿으로 신규 페이지 개발 시간 단축",
        "컴포넌트 문서화 기준을 정립해 협업 생산성 향상",
      ],
    },
    {
      title: "접근성 개선 태스크",
      description:
        "키보드 사용성과 스크린리더 호환성을 높이기 위해 폼, 모달, 내비게이션 전반을 점검하고 개선한 작업입니다.",
      tech: ["ARIA", "Semantic HTML", "Jest"],
      repoUrl: "https://github.com/<github-username>/a11y-improvements",
      demoUrl: "",
      highlights: [
        "포커스 이동 규칙 정비로 키보드 탐색 흐름 개선",
        "의미론적 마크업 강화로 스크린리더 안내 품질 향상",
      ],
    },
  ],
  experience: [
    {
      company: "ABC Tech",
      period: "2024.03 - 현재",
      role: "Frontend Engineer",
      bullets: [
        "서비스 주요 화면 성능 개선과 UI 리뉴얼을 주도",
        "디자인-개발 핸드오프 기준을 문서화해 이슈 재발을 감소",
      ],
    },
    {
      company: "XYZ Studio",
      period: "2022.01 - 2024.02",
      role: "Web Developer",
      bullets: [
        "마케팅 사이트와 운영툴 프론트엔드 개발 담당",
        "공통 컴포넌트와 코드 리뷰 규칙 도입으로 유지보수성 향상",
      ],
    },
  ],
  contacts: {
    email: "hello@example.com",
    github: "https://github.com/<github-username>",
    linkedin: "https://www.linkedin.com/in/<linkedin-id>",
  },
};

let revealObserver;
let sectionObserver;

function setActiveNavLink(targetHash) {
  const navLinks = document.querySelectorAll("[data-nav-link]");
  navLinks.forEach((navLink) => {
    navLink.classList.toggle("is-active", navLink.getAttribute("href") === targetHash);
  });
}

function setText(selector, value) {
  if (!value) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.textContent = value;
  });
}

function renderProfile(profile) {
  setText('[data-field="name"]', profile.name);
  setText('[data-field="name-footer"]', profile.name);
  setText('[data-field="role"]', profile.role);
  setText('[data-field="tagline"]', profile.tagline);
  setText('[data-field="bio"]', profile.bio);
  setText('[data-field="name-short"]', profile.name.slice(0, 3));
}

function renderSkills(skills) {
  const list = document.getElementById("skills-list");
  if (!list) return;

  list.innerHTML = skills
    .map(
      (group, index) => `
        <article class="skill-group reveal" style="--stagger:${index}">
          <h3>${group.category}</h3>
          <ul class="badge-list">
            ${group.items.map((item) => `<li>${item}</li>`).join("")}
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
    links.push('<a href="#projects" aria-disabled="true">Live Demo 준비 중</a>');
  }
  return links.join("");
}

function renderProjects(projects) {
  const list = document.getElementById("projects-list");
  if (!list) return;

  list.innerHTML = projects
    .map(
      (project, index) => `
        <article class="project-card reveal" style="--stagger:${index}">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <ul class="badge-list">
            ${project.tech.map((tech) => `<li>${tech}</li>`).join("")}
          </ul>
          <ul class="project-highlights">
            ${project.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
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

  list.innerHTML = experience
    .map(
      (item, index) => `
        <li class="experience-item reveal" style="--stagger:${index}">
          <h3>${item.company}</h3>
          <p class="experience-meta">${item.role} · ${item.period}</p>
          <ul class="experience-bullets">
            ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </li>
      `
    )
    .join("");
}

function renderContacts(contacts) {
  const email = document.getElementById("contact-email");
  const github = document.getElementById("contact-github");
  const linkedin = document.getElementById("contact-linkedin");

  if (email) {
    email.href = `mailto:${contacts.email}`;
    email.textContent = contacts.email;
  }
  if (github) {
    github.href = contacts.github;
    github.textContent = contacts.github.replace(/^https?:\/\//, "");
  }
  if (linkedin) {
    linkedin.href = contacts.linkedin;
    linkedin.textContent = contacts.linkedin.replace(/^https?:\/\//, "");
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

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
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

      if (visibleRatios.get(activeSection.id) === 0) {
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

      setActiveNavLink(`#${activeSection.id}`);
    },
    {
      threshold: [0, 0.2, 0.4, 0.6, 0.8],
      rootMargin: "-25% 0px -45% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
  setActiveNavLink(`#${sections[0].id}`);
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
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

function init() {
  renderProfile(portfolioData.profile);
  renderSkills(portfolioData.skills);
  renderProjects(portfolioData.projects);
  renderExperience(portfolioData.experience);
  renderContacts(portfolioData.contacts);
  initSmoothScroll();
  initSectionObserver();
  initRevealObserver();
  initYear();
}

document.addEventListener("DOMContentLoaded", init);
