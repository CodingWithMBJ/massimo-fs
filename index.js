import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files (your CSS/JS/images + client-side JSON fallback)
app.use(express.static(path.join(__dirname, "public")));

// Logging
app.use(morgan("dev"));

// Small helpers
async function readJson(relPath) {
  const full = path.join(__dirname, "data", relPath);
  const buf = await fs.readFile(full, "utf-8");
  return JSON.parse(buf);
}

// Shared data loader (nav + socials used on every page)
async function loadShared() {
  const [navLinks, socialLinks] = await Promise.all([
    readJson("navLinks.json").then((d) => d.navLinks || d.navLink || []),
    readJson("socialLinks.json").then((d) => d.socialLinks || []),
  ]);
  return { navLinks, socialLinks };
}

// Routes
app.get("/", async (req, res, next) => {
  try {
    const { navLinks, socialLinks } = await loadShared();
    const projects = (await readJson("projects.json")).projects || [];
    // ~25% subset for home preview (at least 1)
    const previewCount = Math.max(1, Math.ceil(projects.length * 0.25));
    const preview = projects.slice(0, previewCount);

    res.render("index", {
      title: "Massimo v1",
      navLinks,
      socialLinks,
      previewProjects: preview,
    });
  } catch (e) {
    next(e);
  }
});

app.get("/about", async (req, res, next) => {
  try {
    const { navLinks, socialLinks } = await loadShared();
    const experiences = (await readJson("experiences.json")).jobs || [];
    const skillsRoot = (await readJson("skills.json")).Skills || [];
    res.render("about", {
      title: "About",
      navLinks,
      socialLinks,
      experiences,
      skillsRoot,
    });
  } catch (e) {
    next(e);
  }
});

app.get("/projects", async (req, res, next) => {
  try {
    const { navLinks, socialLinks } = await loadShared();
    const projects = (await readJson("projects.json")).projects || [];
    res.render("projects", {
      title: "Projects",
      navLinks,
      socialLinks,
      projects,
    });
  } catch (e) {
    next(e);
  }
});

app.get("/blog", async (req, res, next) => {
  try {
    const { navLinks, socialLinks } = await loadShared();
    res.render("blog", { title: "Blog", navLinks, socialLinks });
  } catch (e) {
    next(e);
  }
});

// Optional APIs (keep your front-end fetches working if you prefer)
app.get("/api/nav-links", async (req, res) => {
  const list = (await readJson("navLinks.json")).navLinks || [];
  res.json({ navLinks: list });
});
app.get("/api/social-links", async (req, res) => {
  const list = (await readJson("socialLinks.json")).socialLinks || [];
  res.json({ socialLinks: list });
});
app.get("/api/experiences", async (req, res) => {
  const jobs = (await readJson("experiences.json")).jobs || [];
  res.json({ jobs });
});
app.get("/api/projects", async (req, res) => {
  const projects = (await readJson("projects.json")).projects || [];
  res.json({ projects });
});
app.get("/api/skills", async (req, res) => {
  const Skills = (await readJson("skills.json")).Skills || [];
  res.json({ Skills });
});

// 404
app.use((req, res) => {
  res.status(404).send("Not found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`▶ Massimo v1 running at http://localhost:${PORT}`);
});
