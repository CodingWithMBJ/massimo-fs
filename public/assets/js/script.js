// /assets/js/script.js
window.addEventListener("DOMContentLoaded", () => {
  // ===== Helpers =====
  const escapeHTML = (str) =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // ===== THEME =====
  (function theme() {
    const body = document.body;
    const themeButton = document.getElementById("themeBtn");
    const themeIndicator = document.getElementById("themeIndicator");

    const savedTheme = localStorage.getItem("theme");
    const savedTod = localStorage.getItem("tod");
    if (savedTheme === "light-theme") {
      body.classList.add("light-theme");
      themeIndicator?.classList.add(savedTod === "night" ? "night" : "day");
    } else {
      body.classList.add("dark-theme");
      themeIndicator?.classList.add(savedTod === "day" ? "day" : "night");
    }

    themeButton?.addEventListener("click", () => {
      const isDark = body.classList.contains("dark-theme");
      body.classList.toggle("dark-theme", !isDark);
      body.classList.toggle("light-theme", isDark);

      const isNight = themeIndicator?.classList.contains("night");
      themeIndicator?.classList.toggle("night", !isNight);
      themeIndicator?.classList.toggle("day", isNight);

      localStorage.setItem("theme", isDark ? "light-theme" : "dark-theme");
      localStorage.setItem("tod", isNight ? "day" : "night");
    });
  })();

  // ===== NAV =====
  (function nav() {
    async function fetchNavLinks() {
      try {
        const res = await fetch("/assets/data/navLinks.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const navLinks = Array.isArray(data.navLinks)
          ? data.navLinks
          : Array.isArray(data.navLink)
          ? data.navLink
          : [];

        const nav = document.getElementById("nav");
        if (!nav || !navLinks.length) return;

        const ul = document.createElement("ul");
        ul.className = "nav-ul";
        const frag = document.createDocumentFragment();

        navLinks.forEach(({ name, href, icon }) => {
          const li = document.createElement("li");
          li.className = "nav-li";

          const a = document.createElement("a");
          a.className = "nav-li-a";
          a.href = typeof href === "string" && href.trim() ? href : "#";
          a.setAttribute("aria-label", name || "navigation link");

          const i = document.createElement("i");
          if (typeof icon === "string" && icon.trim()) {
            i.classList.add(...icon.trim().split(/\s+/));
          }

          const text = document.createElement("span");
          text.className = "nav-text";
          text.innerText = name || "";

          a.append(i, text);
          li.appendChild(a);
          frag.appendChild(li);
        });

        ul.appendChild(frag);
        nav.appendChild(ul);
      } catch (e) {
        console.log("Nav fetch error:", e);
      }
    }
    fetchNavLinks();
  })();

  // ===== SOCIALS (optional per page) =====
  (function socials() {
    const socialBio = document.querySelector(".social-bio");
    if (!socialBio) return;

    async function fetchSocialLinks() {
      try {
        const res = await fetch("/assets/data/socialLinks.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const socialLinks = Array.isArray(json.socialLinks)
          ? json.socialLinks
          : [];
        if (!socialLinks.length) return;

        const ul = document.createElement("ul");
        ul.className = "social-ul";
        const frag = document.createDocumentFragment();

        socialLinks.forEach(({ name, href, icon }) => {
          const li = document.createElement("li");
          li.className = "social-li";

          const a = document.createElement("a");
          a.className = "social-li-a";
          const url = typeof href === "string" && href.trim() ? href : "#";
          a.href = url;
          a.setAttribute("aria-label", name || "social link");
          if (/^https?:\/\//i.test(url)) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }

          const i = document.createElement("i");
          if (typeof icon === "string" && icon.trim()) {
            i.classList.add(...icon.trim().split(/\s+/));
          }

          const text = document.createElement("span");
          text.className = "social-text";
          text.textContent = name || "";

          a.append(i, text);
          li.appendChild(a);
          frag.appendChild(li);
        });

        ul.appendChild(frag);
        socialBio.appendChild(ul);
      } catch (e) {
        console.error("Social fetch error:", e);
      }
    }
    fetchSocialLinks();
  })();

  // ===== STATUS (optional per page) =====
  (function buildStatus() {
    const myStatus = document.querySelector(".myStatus");
    if (!myStatus) return;

    const status = document.createElement("p");
    status.className = "workStatus";
    status.innerText = "available";

    const hireMe = document.createElement("a");
    hireMe.className = "hireBtn";
    hireMe.href = "mailto:codingwithmbj@gmail.com";
    hireMe.innerText = "Hire Me";

    myStatus.append(status, hireMe);
  })();

  // ===== EXPERIENCES (unchanged behavior) =====
  (function experiences() {
    const container = document.querySelector(".expContainer");
    if (!container) return;

    const EXP_JSON_URL = "/assets/data/experiences.json";
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const parseMonthYear = (s) => {
      if (!s || typeof s !== "string") return null;
      const [m, y] = s.trim().split(/\s+/);
      const idx = monthNames.indexOf(String(m).toLowerCase());
      const year = Number.parseInt(y, 10);
      if (idx < 0 || Number.isNaN(year)) return null;
      return new Date(year, idx, 1);
    };
    const fmt = (d, present = false) =>
      present
        ? "Present"
        : d instanceof Date
        ? d.toLocaleString("en-US", { month: "short", year: "numeric" })
        : "";
    const diffHuman = (start, end = new Date()) => {
      if (!(start instanceof Date)) return "";
      let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      if (months < 0) months = 0;
      const y = Math.floor(months / 12),
        m = months % 12;
      if (y > 0 && m > 0)
        return `${y} yr${y > 1 ? "s" : ""} ${m} mo${m > 1 ? "s" : ""}`;
      if (y > 0) return `${y} yr${y > 1 ? "s" : ""}`;
      return `${m} mo${m !== 1 ? "s" : ""}`;
    };
    const normalizeTechLabel = (raw) => {
      if (!raw || typeof raw !== "string") return "";
      const s = raw.trim().toLowerCase();
      const map = {
        html: "HTML",
        css: "CSS",
        js: "JavaScript",
        javascript: "JavaScript",
        "react.js/next.js": "React / Next.js",
        "react.js": "React.js",
        "next.js": "Next.js",
        "node.js": "Node.js",
        "express.js": "Express.js",
        mongodb: "MongoDB",
        materialui: "Material UI",
        "material ui": "Material UI",
        tailwindcss: "Tailwind CSS",
        "tailwind css": "Tailwind CSS",
      };
      if (map[s]) return map[s];
      return raw
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
    };
    const extractTechs = (value) => {
      let list = [];
      if (Array.isArray(value)) list = value.filter(Boolean);
      else if (value && typeof value === "object")
        list = Object.values(value).filter(Boolean);
      const seen = new Set(),
        out = [];
      list.forEach((v) => {
        const t = normalizeTechLabel(v);
        if (t && !seen.has(t)) {
          seen.add(t);
          out.push(t);
        }
      });
      return out;
    };
    const extractTasks = (obj) =>
      !obj || typeof obj !== "object" ? [] : Object.values(obj).filter(Boolean);

    function createCard(job) {
      const card = document.createElement("article");
      card.className = "exp-card";
      const grid = document.createElement("div");
      grid.className = "exp-grid";

      const logo = document.createElement("figure");
      logo.className = "exp-logo";
      if (job.companyLogo) {
        const img = document.createElement("img");
        img.src = job.companyLogo;
        img.alt = `${job.company || "Company"} logo`;
        img.loading = "lazy";
        logo.appendChild(img);
      } else {
        const span = document.createElement("span");
        span.textContent = (job.company || "?")
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        span.style.fontWeight = "700";
        logo.style.display = "grid";
        logo.style.placeItems = "center";
        logo.appendChild(span);
      }

      const duration = Array.isArray(job.duration) ? job.duration[0] : null;
      const start = parseMonthYear(duration?.startDate);
      const isPresent = !!duration?.["stillEmployed?"] || !duration?.endDate;
      const end = isPresent ? new Date() : parseMonthYear(duration?.endDate);
      const total = start ? diffHuman(start, end) : "";
      const left = fmt(start, false);
      const right = fmt(end, isPresent);
      const range = left && right ? `${left} — ${right}` : left || right || "";

      const header = document.createElement("header");
      header.className = "exp-header";
      const nameEl = document.createElement("h3");
      nameEl.className = "exp-company";
      nameEl.textContent = job.company || "Company";
      if (job.companyAlias) {
        const alias = document.createElement("span");
        alias.className = "exp-alias";
        alias.textContent = ` (${job.companyAlias})`;
        nameEl.append(alias);
      }
      const tenure = document.createElement("p");
      tenure.className = "exp-tenure";
      tenure.textContent = total || "";
      header.append(nameEl, tenure);

      const body = document.createElement("section");
      body.className = "exp-body";
      const title = document.createElement("h4");
      title.className = "exp-title";
      title.textContent = job.title || "";
      const durationLine = document.createElement("p");
      durationLine.className = "exp-range";
      durationLine.textContent = range
        ? total
          ? `${range} • ${total}`
          : range
        : "";
      const meta = document.createElement("p");
      meta.className = "exp-meta";
      if (job.location) meta.textContent = job.location;

      const tasks = Array.isArray(job.tasks) ? extractTasks(job.tasks[0]) : [];
      const ulTasks = document.createElement("ul");
      ulTasks.className = "exp-tasks";
      tasks.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        ulTasks.appendChild(li);
      });

      const techs = extractTechs(job.technologiesUsed);
      const ulTech = document.createElement("ul");
      ulTech.className = "exp-tech";
      techs.forEach((t) => {
        const li = document.createElement("li");
        li.className = "tech-chip";
        li.textContent = t;
        ulTech.appendChild(li);
      });

      body.append(title);
      if (durationLine.textContent) body.appendChild(durationLine);
      if (job.location) body.appendChild(meta);
      if (tasks.length) body.appendChild(ulTasks);
      if (techs.length) body.appendChild(ulTech);

      grid.append(logo, header, body);
      card.appendChild(grid);
      return card;
    }

    async function renderExperiences() {
      try {
        const res = await fetch(EXP_JSON_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
        container.innerHTML = "";
        jobs.forEach((job) => container.appendChild(createCard(job)));
      } catch (e) {
        console.error("Failed to render experiences:", e);
        container.innerHTML = `<p>Unable to load experiences right now.</p>`;
      }
    }
    renderExperiences();
  })();

  // ===== SKILLS (unchanged) =====
  (function skillsSeparated() {
    const container = document.getElementById("skillsContainer");
    if (!container) return;

    const SKILLS_JSON_URL = "/assets/data/skills.json";
    const dedupe = (arr) => {
      const s = new Set();
      return arr.filter((v) => {
        const k = String(v).trim();
        if (!k || s.has(k)) return false;
        s.add(k);
        return true;
      });
    };

    function normalizeTechnicalGrouped(arr) {
      if (!Array.isArray(arr)) return [];
      const out = [];
      arr.forEach((groupObj) => {
        if (!groupObj || typeof groupObj !== "object") return;
        const [subcat, items] = Object.entries(groupObj)[0] || [];
        if (!subcat || !Array.isArray(items)) return;
        const names = dedupe(items.map((it) => it?.name).filter(Boolean));
        if (names.length) out.push({ subcat, names });
      });
      return out;
    }
    function normalizeTechnicalFlat(arr) {
      if (!Array.isArray(arr)) return [];
      const names = dedupe(arr.map((it) => it?.name).filter(Boolean));
      return names.length ? [{ subcat: "Technical", names }] : [];
    }
    function normalizeSoft(arr) {
      if (!Array.isArray(arr)) return [];
      return dedupe(arr.map((it) => it?.name).filter(Boolean));
    }

    const makeSectionTitle = (t) => {
      const h3 = document.createElement("h3");
      h3.className = "skill-section-title";
      h3.textContent = t;
      return h3;
    };
    function makeSubcatBlock(title, names) {
      const section = document.createElement("section");
      section.className = "skill-group";
      if (title) {
        const h4 = document.createElement("h4");
        h4.className = "skill-cat";
        h4.textContent = title;
        section.appendChild(h4);
      }
      const ul = document.createElement("ul");
      ul.className = "skill-list";
      names.forEach((n) => {
        const li = document.createElement("li");
        li.textContent = n;
        ul.appendChild(li);
      });
      section.appendChild(ul);
      return section;
    }

    async function loadAndRender() {
      try {
        const res = await fetch(SKILLS_JSON_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        const root = Array.isArray(data?.Skills) ? data.Skills : [];
        const techBlock = root.find((o) =>
          Object.prototype.hasOwnProperty.call(o, "Technical Skills")
        );
        const softBlock = root.find((o) =>
          Object.prototype.hasOwnProperty.call(o, "Soft Skills")
        );

        let techGroups = normalizeTechnicalGrouped(
          techBlock?.["Technical Skills"]
        );
        if (
          !techGroups.length &&
          Array.isArray(techBlock?.["Technical Skills"])
        ) {
          techGroups = normalizeTechnicalFlat(techBlock["Technical Skills"]);
        }
        const softNames = normalizeSoft(softBlock?.["Soft Skills"]);

        container.innerHTML = "";
        if (techGroups.length) {
          const techWrap = document.createElement("div");
          techWrap.className = "skills-col technical";
          techWrap.appendChild(makeSectionTitle("Technical Skills"));
          techGroups.forEach((g) =>
            techWrap.appendChild(makeSubcatBlock(g.subcat, g.names))
          );
          container.appendChild(techWrap);
        }
        if (softNames.length) {
          const softWrap = document.createElement("div");
          softWrap.className = "skills-col soft";
          softWrap.appendChild(makeSectionTitle("Soft Skills"));
          softWrap.appendChild(makeSubcatBlock("", softNames));
          container.appendChild(softWrap);
        }
        if (!container.childNodes.length)
          container.textContent = "No skills to display yet.";
      } catch (e) {
        console.error("Skills load error:", e);
        container.textContent = "Unable to load skills.";
      }
    }
    loadAndRender();
  })();

  // ===== PROJECTS (ALL cards on /projects; 25% preview on Home) =====
  (function projects() {
    const projectsContainer = document.getElementById("project-card-container"); // projects page
    const homePreview = document.getElementById("homeProjectsContainer"); // home page

    if (!projectsContainer && !homePreview) return;

    // Desktop breakpoint (matches your CSS @media min-width:1024px)
    const desktopMQ = window.matchMedia("(min-width: 1024px)");

    // Ensure no cards stay flipped on desktop
    function resetAllFlips(root = document) {
      root.querySelectorAll(".flip-inner.flipped").forEach((el) => {
        el.classList.remove("flipped");
      });
      root.querySelectorAll(".infoBox[aria-pressed='true']").forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
      });
    }

    // Run once on load if already desktop
    if (desktopMQ.matches) resetAllFlips();

    // Also reset whenever viewport crosses into desktop
    const onMQChange = (e) => {
      if (e.matches) resetAllFlips();
    };
    // Safari < 14 fallback
    if (desktopMQ.addEventListener)
      desktopMQ.addEventListener("change", onMQChange);
    else desktopMQ.addListener(onMQChange);

    // event delegation for flip (mobile/tablet; hidden on desktop via CSS)
    function wireFlip(root) {
      if (!root) return;
      if (root.dataset.flipBound === "1") return;
      root.dataset.flipBound = "1";

      const toggle = (btn) => {
        const card = btn.closest(".projectCard");
        const inner = card?.querySelector(".flip-inner");
        if (!inner) return;

        // On desktop: never allow flip; always remove if present
        if (desktopMQ.matches) {
          if (inner.classList.contains("flipped"))
            inner.classList.remove("flipped");
          btn.setAttribute("aria-pressed", "false");
          return;
        }

        const flipped = inner.classList.toggle("flipped");
        btn.setAttribute("aria-pressed", flipped ? "true" : "false");
      };

      root.addEventListener("click", (e) => {
        const btn = e.target.closest(".infoBox");
        if (btn && root.contains(btn)) toggle(btn);
      });

      root.addEventListener("keydown", (e) => {
        const btn = e.target.closest(".infoBox");
        if (!btn || !root.contains(btn)) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(btn);
        }
      });
    }

    const projectCardHTML = (p) => {
      const {
        name = "",
        description = "",
        image = "",
        liveLink = "",
        sourceCode = "",
        techStack = [],
      } = p;
      return `
      <section class="projectCard">
        <h3 class="project-title">${escapeHTML(name)}</h3>
        <article class="flip" aria-live="polite">
          <section class="flip-inner">
            <article class="flip-front">
              <img src="${escapeHTML(image)}" alt="${escapeHTML(
        name
      )}" class="project-img" />
            </article>
            <article class="flip-back">
              <section class="description-flex">
                <p class="description">${escapeHTML(description)}</p>
                <ul class="tech-list">
                  ${techStack
                    .map((t) => `<li class="tech-item">${escapeHTML(t)}</li>`)
                    .join("")}
                </ul>
              </section>
            </article>
          </section>
        </article>
        <article class="links-flex">
          <button class="infoBox" type="button" aria-pressed="false" title="More info">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
            <span class="sr-only">Toggle details</span>
          </button>
          <a href="${escapeHTML(
            sourceCode
          )}" class="githubLink" aria-label="Source code on GitHub" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-github" aria-hidden="true"></i>
          </a>
          <a href="${escapeHTML(
            liveLink
          )}" class="siteLink" aria-label="Open live site" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-square-arrow-up-right" aria-hidden="true"></i>
          </a>
        </article>
      </section>
    `;
    };

    fetch("/assets/data/projects.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const projects = Array.isArray(data.projects) ? data.projects : [];
        if (!projects.length) return;

        // Render ALL on projects page
        if (projectsContainer) {
          projectsContainer.innerHTML = projects.map(projectCardHTML).join("");
          wireFlip(projectsContainer);
          if (desktopMQ.matches) resetAllFlips(projectsContainer);
        }

        // Render ~25% on home page (at least 1)
        if (homePreview) {
          const count = Math.max(1, Math.ceil(projects.length * 0.25));
          const subset = projects.slice(0, count);
          homePreview.innerHTML = subset.map(projectCardHTML).join("");
          wireFlip(homePreview);
          if (desktopMQ.matches) resetAllFlips(homePreview);
        }
      })
      .catch((err) => console.error("Project fetch error:", err));
  })();
});
