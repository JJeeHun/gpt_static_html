(() => {
  "use strict";

  const elements = {
    siteEyebrow: document.getElementById("siteEyebrow"),
    heroTitle: document.getElementById("heroTitle"),
    heroDescription: document.getElementById("heroDescription"),
    projectCount: document.getElementById("projectCount"),
    activeCount: document.getElementById("activeCount"),
    categoryCount: document.getElementById("categoryCount"),
    search: document.getElementById("projectSearch"),
    sort: document.getElementById("projectSort"),
    categoryFilters: document.getElementById("categoryFilters"),
    projectGrid: document.getElementById("projectGrid"),
    resultMeta: document.getElementById("resultMeta"),
    emptyState: document.getElementById("emptyState"),
    errorState: document.getElementById("errorState"),
    resetFilters: document.getElementById("resetFilters"),
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon"),
    branchBadge: document.getElementById("branchBadge")
  };

  const state = {
    catalog: null,
    query: "",
    category: "all",
    sort: "featured"
  };

  const collator = new Intl.Collator("ko", {
    numeric: true,
    sensitivity: "base"
  });

  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLocaleLowerCase("ko-KR")
      .trim();

  const makeIcon = (name, className) => {
    const icon = document.createElement("i");
    icon.dataset.lucide = name || "folder";
    icon.setAttribute("aria-hidden", "true");
    if (className) icon.className = className;
    return icon;
  };

  const refreshIcons = () => {
    if (!window.lucide?.createIcons) return;
    window.requestAnimationFrame(() => {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.8
        }
      });
    });
  };

  const categoryMap = () =>
    new Map((state.catalog?.categories || []).map((category) => [category.id, category]));

  const statusMap = () =>
    new Map((state.catalog?.statuses || []).map((status) => [status.id, status]));

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  };

  const getUpdatedTime = (project) => {
    const time = Date.parse(project.updatedAt || "");
    return Number.isNaN(time) ? 0 : time;
  };

  const getProjectSearchText = (project) => {
    const categories = categoryMap();
    const statuses = statusMap();
    const category = categories.get(project.category);
    const status = statuses.get(project.status);

    return normalize([
      project.name,
      project.description,
      category?.label,
      status?.label,
      ...(project.tags || []),
      ...(project.keywords || [])
    ].join(" "));
  };

  const createBadge = (label, className = "", status = "") => {
    const badge = document.createElement("span");
    badge.className = `badge ${className}`.trim();
    badge.textContent = label;
    if (status) badge.dataset.status = status;
    return badge;
  };

  const createProjectCard = (project) => {
    const categories = categoryMap();
    const statuses = statusMap();
    const category = categories.get(project.category);
    const status = statuses.get(project.status);

    const card = document.createElement("a");
    card.className = "project-card";
    card.href = project.path || "./";
    card.setAttribute("aria-label", `${project.name} 프로젝트 열기`);

    if (project.external === true) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const topline = document.createElement("div");
    topline.className = "card-topline";

    const iconWrap = document.createElement("span");
    iconWrap.className = "project-icon";
    iconWrap.append(makeIcon(project.icon || category?.icon || "folder"));

    const badges = document.createElement("span");
    badges.className = "card-badges";

    if (project.featured) {
      badges.append(createBadge("추천", "badge-featured"));
    }

    if (status?.label) {
      badges.append(createBadge(status.label, "", project.status));
    }

    topline.append(iconWrap, badges);

    const title = document.createElement("h3");
    title.className = "project-name";
    title.textContent = project.name || "이름 없는 프로젝트";

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description || "설명이 아직 등록되지 않았습니다.";

    const tags = document.createElement("div");
    tags.className = "tag-list";
    (project.tags || []).slice(0, 4).forEach((tagName) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = tagName;
      tags.append(tag);
    });

    body.append(topline, title, description, tags);

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "card-category";
    categoryLabel.append(
      makeIcon(category?.icon || "folder"),
      document.createTextNode(category?.label || "미분류")
    );

    const openLabel = document.createElement("span");
    openLabel.className = "card-open";
    openLabel.append(
      document.createTextNode(project.external === true ? "새 창" : "열기"),
      makeIcon(project.external === true ? "external-link" : "arrow-up-right")
    );

    footer.append(categoryLabel, openLabel);
    card.append(body, footer);

    if (project.updatedAt) {
      card.title = `최근 수정 ${formatDate(project.updatedAt)}`;
    }

    return card;
  };

  const filteredProjects = () => {
    if (!state.catalog) return [];

    const query = normalize(state.query);

    const projects = state.catalog.projects.filter((project) => {
      const categoryMatch = state.category === "all" || project.category === state.category;
      const queryMatch = !query || getProjectSearchText(project).includes(query);
      return categoryMatch && queryMatch;
    });

    return projects.sort((a, b) => {
      if (state.sort === "name") {
        return collator.compare(a.name || "", b.name || "");
      }

      if (state.sort === "updated") {
        return getUpdatedTime(b) - getUpdatedTime(a) || collator.compare(a.name || "", b.name || "");
      }

      return Number(Boolean(b.featured)) - Number(Boolean(a.featured))
        || getUpdatedTime(b) - getUpdatedTime(a)
        || collator.compare(a.name || "", b.name || "");
    });
  };

  const renderProjects = () => {
    if (!state.catalog) return;

    const projects = filteredProjects();
    const total = state.catalog.projects.length;

    elements.projectGrid.replaceChildren();
    elements.projectGrid.setAttribute("aria-busy", "false");

    projects.forEach((project) => {
      elements.projectGrid.append(createProjectCard(project));
    });

    elements.projectGrid.hidden = projects.length === 0;
    elements.emptyState.hidden = projects.length !== 0;

    const isFiltered = Boolean(normalize(state.query)) || state.category !== "all";
    elements.resultMeta.textContent = isFiltered
      ? `전체 ${total}개 중 ${projects.length}개`
      : `총 ${projects.length}개`;

    refreshIcons();
  };

  const createCategoryButton = (category, count, isActive) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.category = category.id;
    button.setAttribute("aria-pressed", String(isActive));

    button.append(makeIcon(category.icon || "folder"));

    const label = document.createElement("span");
    label.textContent = category.label;

    const countElement = document.createElement("span");
    countElement.className = "category-count";
    countElement.textContent = String(count);

    button.append(label, countElement);
    button.addEventListener("click", () => {
      state.category = category.id;
      renderCategories();
      renderProjects();
    });

    return button;
  };

  const renderCategories = () => {
    if (!state.catalog) return;

    const counts = new Map();
    state.catalog.projects.forEach((project) => {
      counts.set(project.category, (counts.get(project.category) || 0) + 1);
    });

    elements.categoryFilters.replaceChildren();

    elements.categoryFilters.append(
      createCategoryButton(
        {
          id: "all",
          label: "전체",
          icon: "layout-grid"
        },
        state.catalog.projects.length,
        state.category === "all"
      )
    );

    state.catalog.categories
      .filter((category) => (counts.get(category.id) || 0) > 0)
      .forEach((category) => {
        elements.categoryFilters.append(
          createCategoryButton(
            category,
            counts.get(category.id) || 0,
            state.category === category.id
          )
        );
      });

    refreshIcons();
  };

  const renderStats = () => {
    const projects = state.catalog?.projects || [];
    const usedCategories = new Set(projects.map((project) => project.category).filter(Boolean));

    elements.projectCount.textContent = String(projects.length);
    elements.activeCount.textContent = String(
      projects.filter((project) => project.status === "active").length
    );
    elements.categoryCount.textContent = String(usedCategories.size);
  };

  const applySiteContent = () => {
    const site = state.catalog?.site;
    if (!site) return;

    if (site.eyebrow) {
      const label = elements.siteEyebrow.querySelector("span");
      if (label) label.textContent = site.eyebrow;
    }

    if (site.headline) elements.heroTitle.textContent = site.headline;
    if (site.description) elements.heroDescription.textContent = site.description;
    if (site.title) document.title = site.title;
  };

  const validateCatalog = (catalog) => {
    if (!catalog || !Array.isArray(catalog.categories) || !Array.isArray(catalog.projects)) {
      throw new Error("Invalid project catalog");
    }

    const categoryIds = new Set(catalog.categories.map((category) => category.id));

    catalog.projects.forEach((project) => {
      if (!project.id || !project.name || !project.path) {
        throw new Error("Project requires id, name and path");
      }

      if (project.category && !categoryIds.has(project.category)) {
        throw new Error(`Unknown category: ${project.category}`);
      }
    });

    return catalog;
  };

  const loadCatalog = async () => {
    try {
      const response = await fetch("./_hub/data/projects.json", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Catalog request failed: ${response.status}`);
      }

      state.catalog = validateCatalog(await response.json());

      applySiteContent();
      renderStats();
      renderCategories();
      renderProjects();
    } catch (error) {
      console.error(error);
      elements.projectGrid.replaceChildren();
      elements.projectGrid.hidden = true;
      elements.projectGrid.setAttribute("aria-busy", "false");
      elements.emptyState.hidden = true;
      elements.errorState.hidden = false;
      elements.resultMeta.textContent = "불러오기 실패";
      refreshIcons();
    }
  };

  const resetFilters = () => {
    state.query = "";
    state.category = "all";
    state.sort = "featured";

    elements.search.value = "";
    elements.sort.value = "featured";

    renderCategories();
    renderProjects();
    elements.search.focus();
  };

  const currentTheme = () =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark";

  const updateThemeButton = () => {
    const theme = currentTheme();
    const nextTheme = theme === "dark" ? "light" : "dark";

    elements.themeToggle.setAttribute(
      "aria-label",
      nextTheme === "light" ? "라이트 테마로 변경" : "다크 테마로 변경"
    );

    elements.themeIcon.dataset.lucide = nextTheme === "light" ? "sun" : "moon";
    refreshIcons();
  };

  const toggleTheme = () => {
    const nextTheme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem("project-hub-theme", nextTheme);
    } catch {
      // Storage access can be blocked; theme still works for the current page.
    }

    updateThemeButton();
  };

  const inferEnvironment = (branch) => {
    if (branch === "main") return "prod";
    if (branch === "stage") return "stage";
    if (branch === "dev") return "dev";
    if (branch?.startsWith("feature/")) return "feature";
    return branch || "";
  };

  const loadBuildInfo = async () => {
    try {
      const response = await fetch("./build-info.json", {
        cache: "no-store"
      });
      if (!response.ok) return;

      const buildInfo = await response.json();
      const branch = buildInfo.branch || "";
      const environment = buildInfo.environment || inferEnvironment(branch);

      if (!branch || environment === "prod" || branch === "main") {
        elements.branchBadge.hidden = true;
        return;
      }

      const label = buildInfo.label || environment.toUpperCase();
      const commit = buildInfo.commit ? ` · ${buildInfo.commit}` : "";

      elements.branchBadge.dataset.environment = environment;
      elements.branchBadge.textContent = `${label} · ${branch}${commit}`;
      elements.branchBadge.hidden = false;
    } catch {
      elements.branchBadge.hidden = true;
    }
  };

  elements.search.addEventListener("input", (event) => {
    state.query = event.currentTarget.value;
    renderProjects();
  });

  elements.sort.addEventListener("change", (event) => {
    state.sort = event.currentTarget.value;
    renderProjects();
  });

  elements.resetFilters.addEventListener("click", resetFilters);
  elements.themeToggle.addEventListener("click", toggleTheme);

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement
      || target?.isContentEditable;

    if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      elements.search.focus();
    }

    if (event.key === "Escape" && document.activeElement === elements.search) {
      elements.search.value = "";
      state.query = "";
      renderProjects();
      elements.search.blur();
    }
  });

  updateThemeButton();
  refreshIcons();
  loadCatalog();
  loadBuildInfo();
})();
