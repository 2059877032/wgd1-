/**
 * 设计提醒：编辑工作室档案。以暖白、近黑和档案墨绿构成不对称的数字档案页；
 * 以章节编号、细线和克制的图文错位叙事，避免通用营销式居中卡片布局。
 */
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type TouchEvent, type WheelEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Maximize2,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { gamePortfolio } from "@/lib/gamePortfolio";
import { getBoundedPptPageIndex, initializePptPageLoadStates, type PptPageLoadState } from "@/lib/pptArchive";
import { getRestoredReadingPosition } from "@/lib/readingPosition";
import { readingRooms } from "@/lib/readingRooms";
import { featuredWork } from "@/lib/featuredWork";

const staticMediaAliases: Record<string, string> = {
  "ai-trainer-advanced-wang-guodian_3965d69c.webp": "ai-trainer-advanced-wang-guodian.webp",
  "ai-trainer-junior-wang-guodian_fab50756.webp": "ai-trainer-junior-wang-guodian.webp",
  "portfolio-mark_1782bf8b.png": "portfolio-mark.svg",
  "straw-future-clean-cover_be7078fc.png": "straw-future-clean-cover.png",
  "straw-future-clean_94e3813a.pdf": "straw-future-clean.pdf",
  "straw-future-clean_95f53e3e.pptx": "straw-future-clean.pptx",
};

const staticMediaUrl = (fileName: string) => `${import.meta.env.BASE_URL}media/${staticMediaAliases[fileName] ?? fileName}`;

const capabilities = [
  {
    index: "01",
    title: "人工智能",
    note: "MODEL / PROMPT / DEPLOY",
    body: "取得阿里达摩院人工智能训练师初级与高级认证，持续学习人工智能在真实任务中的应用方法。",
  },
  {
    index: "02",
    title: "程序设计",
    note: "SCRIPT / WEB / AUTOMATION",
    body: "使用 Python 开发简单 Web 应用，关注基础功能搭建与工具如何服务实际问题。",
  },
  {
    index: "03",
    title: "数据与运营",
    note: "ANALYSIS / RETENTION / RESPONSE",
    body: "能够围绕引流、转化与留存构建运营闭环，沉淀私域用户并关注长期复购。",
  },
  {
    index: "04",
    title: "内容表达",
    note: "VISUALIZE / EXPLAIN / ALIGN",
    body: "设计高质量演示文稿，以信息可视化帮助团队将复杂内容表达得更清楚。",
  },
];

const awards = [
  {
    year: "2026",
    title: "阿里达摩院人工智能训练师高级认证",
    note: "高级培训课程 · 点击查看凭证",
    certificateId: "advanced",
  },
  {
    year: "2026",
    title: "阿里达摩院人工智能训练师初级认证",
    note: "初级培训课程 · 点击查看凭证",
    certificateId: "junior",
  },
];

const certificates = [
  {
    id: "junior",
    index: "CERT / 01",
    level: "人工智能训练师 · 初级",
    date: "2026 年 7 月 29 日",
    image: staticMediaUrl("ai-trainer-junior-wang-guodian_fab50756.webp"),
  },
  {
    id: "advanced",
    index: "CERT / 02",
    level: "人工智能训练师 · 高级",
    date: "2026 年 8 月 1 日",
    image: staticMediaUrl("ai-trainer-advanced-wang-guodian_3965d69c.webp"),
  },
];

const pptPages = [
  "page-01_c7876cbb.jpg", "page-02_67f37c6b.jpg", "page-03_ed3ad407.jpg", "page-04_46975e4d.jpg",
  "page-05_67c1fbdc.jpg", "page-06_c96dd6af.jpg", "page-07_631d4e5b.jpg", "page-08_3af0dbac.jpg",
  "page-09_0ea75b5c.jpg", "page-10_85ced021.jpg", "page-11_3436730f.jpg", "page-12_7bbed41c.jpg",
  "page-13_6bc313eb.jpg", "page-14_8e2e2f19.jpg", "page-15_c475bc05.jpg", "page-16_c6f55ded.jpg",
  "page-17_626d0c4a.jpg", "page-18_47d53169.jpg", "page-19_dcbb0364.jpg", "page-20_6810470d.jpg",
].map(staticMediaUrl);

const [tankGame, stellarGame] = gamePortfolio;
const [herbRoom, aiRoom, editorialRoom] = readingRooms;

const archiveSections = [
  { id: "profile", index: "A/01", label: "个人索引", description: "中药学、AI 与实践的交汇" },
  { id: "capability", index: "A/02", label: "能力地图", description: "工具、内容与运营的方法" },
  { id: "practice", index: "A/03", label: "实践档案", description: "票务运营与学习系统" },
  { id: "path", index: "A/04", label: "学习路径", description: "专业学习与持续问题" },
  { id: "recognition", index: "A/05", label: "认证凭证", description: "训练师认证的真实记录" },
  { id: "work", index: "A/06", label: "作品样本", description: "PPT 与可试玩的网页作品" },
  { id: "contact", index: "A/07", label: "联系我", description: "电话、微信与邮箱" },
];

const identityProfiles = [
  { id: "herbal", number: "01", title: "中药学学习者", note: "从中药学课程出发，建立对药物与生命科学的基础理解。", annotation: "HERB / FIELD NOTE", margin: "本草起笔", target: "path", targetLabel: "查看学习路径" },
  { id: "ai", number: "02", title: "AI 编程学习者", note: "用 AI、Python 与网页小游戏，把学习中的想法变成可交互的体验。", annotation: "BUILD / ITERATION", margin: "先做出可运行的版本", target: "work", targetLabel: "查看互动作品" },
  { id: "ppt", number: "03", title: "PPT 设计者", note: "通过演示文稿与信息可视化，把复杂问题整理成清晰的项目叙事。", annotation: "EDIT / SEQUENCE", margin: "一页一页理清叙事", target: "work", targetLabel: "查看 PPT 作品" },
  { id: "operations", number: "04", title: "运营实践者", note: "在用户触达、资源协同与响应节奏中，练习面向真实场景的运营方法。", annotation: "FIELD / RESPONSE", margin: "把问题放回真实现场", target: "practice", targetLabel: "查看运营实践" },
  { id: "campus", number: "05", title: "校园组织者", note: "将知识图谱、专题答疑与实验跟进组织成持续反馈的学习网络。", annotation: "CAMPUS / ATLAS", margin: "让知识形成反馈回路", target: "practice", targetLabel: "查看校园实践" },
];

type IdentityProfile = (typeof identityProfiles)[number];

const caseNotes = {
  ticket: {
    label: "FIELD NOTE / 01",
    title: "从触达、供给到响应的运营记录",
    items: ["用户分层：按需求整理社群触达路径", "信息推送：围绕不同演出建立定制化沟通", "资源协同：以紧急票源通道支持快速响应"],
  },
  biology: {
    label: "FIELD NOTE / 02",
    title: "把学习流程整理成可重复使用的反馈回路",
    items: ["知识图谱：覆盖 12 个核心考点", "专题答疑：每周 3 次重点突破", "实验跟进：以错题与报告任务形成反馈"],
  },
};

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-index" aria-hidden="true">
        <span className="section-mark"><img src={staticMediaUrl("portfolio-mark_1782bf8b.png")} alt="" /><i /></span>
        <span>{index}</span>
        <i />
      </div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
    </div>
  );
}

function BreathingText({
  text,
  className = "",
  label,
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  return (
    <span className={`hero-breathing-text ${className}`.trim()} aria-label={label ?? text}>
      {Array.from(text).map((character, index) => (
        character === " " ? <span className="hero-breathing-space" aria-hidden="true" key={`space-${index}`}> </span> :
          <span className="hero-breathing-char" aria-hidden="true" key={`${character}-${index}`} style={{ "--breathing-index": index } as CSSProperties}>{character}</span>
      ))}
    </span>
  );
}

function IdentityLeaf({ identity }: { identity: IdentityProfile }) {
  return <>
    <span className="identity-page-number">{identity.number} / 05</span>
    <p>{identity.annotation}</p>
    <h4>{identity.title}</h4>
    <em>{identity.note}</em>
    <span className="identity-page-margin">{identity.margin}</span>
    <span className="identity-page-read">点击阅读这页 <ChevronRight size={15} /></span>
  </>;
}

const TURN_SLICES = Array.from({ length: 13 }, (_, index) => index);

function IdentityTurnSheet({ identity }: { identity: IdentityProfile }) {
  return <div className={`turning-sheet identity-page-${identity.id}`}>
    {TURN_SLICES.map((slice) => <span className="turning-sheet-slice" key={`${identity.id}-slice-${slice}`} style={{ "--slice-index": slice } as CSSProperties}>
      <span className="turning-sheet-face turning-sheet-front"><span className="turning-sheet-content"><IdentityLeaf identity={identity} /></span></span>
      <span className="turning-sheet-face turning-sheet-back" aria-hidden="true"><span className="turning-sheet-back-paper" /></span>
    </span>)}
  </div>;
}

export default function Home() {
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [pptOpen, setPptOpen] = useState(false);
  const [pptPageIndex, setPptPageIndex] = useState(0);
  const [pptIndexOpen, setPptIndexOpen] = useState(false);
  const [pptZoomOpen, setPptZoomOpen] = useState(false);
  const [pptTurning, setPptTurning] = useState(false);
  const [pptTurnDirection, setPptTurnDirection] = useState<1 | -1>(1);
  const [pptTouchStart, setPptTouchStart] = useState<number | null>(null);
  const [pptPageLoadStates, setPptPageLoadStates] = useState<Record<number, PptPageLoadState>>({});
  const [pptThumbnailPreviewLoading, setPptThumbnailPreviewLoading] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(certificates[1]);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openCase, setOpenCase] = useState<"ticket" | "biology" | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [pageTurning, setPageTurning] = useState(false);
  const [identityIndex, setIdentityIndex] = useState(0);
  const [identityCardOpen, setIdentityCardOpen] = useState(false);
  const [bookTurning, setBookTurning] = useState(false);
  const [turnLeaf, setTurnLeaf] = useState<{ from: IdentityProfile; to: IdentityProfile; direction: 1 | -1 } | null>(null);
  const directoryCloseRef = useRef<HTMLButtonElement>(null);
  const directoryTriggerRef = useRef<HTMLButtonElement>(null);
  const savedReadingPositionRef = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return;

    const root = document.documentElement;
    const cursor = document.querySelector<HTMLElement>(".leaf-cursor");
    if (!cursor) return;

    let pulseTimer = 0;
    let lastTrailX = 0;
    let lastTrailY = 0;
    let lastTrailAt = 0;
    let trailCount = 0;
    const spawnTrailParticle = (event: PointerEvent) => {
      const now = performance.now();
      const dx = event.clientX - lastTrailX;
      const dy = event.clientY - lastTrailY;
      const distance = Math.hypot(dx, dy);
      if (distance < 8 || now - lastTrailAt < 30) return;
      lastTrailX = event.clientX;
      lastTrailY = event.clientY;
      lastTrailAt = now;
      trailCount += 1;
      const particle = document.createElement("span");
      const kind = trailCount % 4 === 0 ? "star" : "leaf";
      particle.className = `leaf-trail-particle ${kind}`;
      particle.setAttribute("aria-hidden", "true");
      particle.style.left = `${event.clientX - dx * 0.55}px`;
      particle.style.top = `${event.clientY - dy * 0.55}px`;
      particle.style.setProperty("--trail-x", `${-dx * 0.7}px`);
      particle.style.setProperty("--trail-y", `${-dy * 0.7 - 3}px`);
      particle.style.setProperty("--trail-rotate", `${Math.atan2(dy, dx) * 57.3 + (kind === "leaf" ? -35 : 0)}deg`);
      particle.style.setProperty("--trail-delay", `${Math.min(distance * 2, 80)}ms`);
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 720);
    };
    const updateCursorMode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest<HTMLElement>("[data-cursor], a, button") : null;
      const mode = element?.dataset.cursor || (element ? "link" : "browse");
      root.dataset.leafCursorMode = mode;
    };
    const moveCursor = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      root.style.setProperty("--archive-pointer-x", String((event.clientX / window.innerWidth - 0.5) * 2));
      root.style.setProperty("--archive-pointer-y", String((event.clientY / window.innerHeight - 0.5) * 2));
      root.dataset.leafCursorVisible = "true";
      updateCursorMode(event.target);
      spawnTrailParticle(event);
    };
    const pulseCursor = () => {
      root.dataset.leafCursorPulse = "true";
      window.clearTimeout(pulseTimer);
      pulseTimer = window.setTimeout(() => delete root.dataset.leafCursorPulse, 160);
    };
    const hideCursor = () => { delete root.dataset.leafCursorVisible; };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", pulseCursor, { passive: true });
    document.addEventListener("pointerleave", hideCursor);
    return () => {
      window.clearTimeout(pulseTimer);
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", pulseCursor);
      document.removeEventListener("pointerleave", hideCursor);
      delete root.dataset.leafCursorVisible;
      delete root.dataset.leafCursorMode;
      delete root.dataset.leafCursorPulse;
      document.querySelectorAll(".leaf-trail-particle").forEach((particle) => particle.remove());
    };
  }, []);

  const updatePptArchiveUrl = (isOpen: boolean) => {
    const url = new URL(window.location.href);
    if (isOpen) url.searchParams.set("archive", "ppt");
    else {
      url.searchParams.delete("archive");
      url.searchParams.delete("index");
      url.searchParams.delete("detail");
    }
    window.history.replaceState({}, "", url);
  };

  const updatePptIndexUrl = (isOpen: boolean) => {
    const url = new URL(window.location.href);
    if (isOpen) url.searchParams.set("index", "pages");
    else url.searchParams.delete("index");
    window.history.replaceState({}, "", url);
  };

  const updatePptDetailUrl = (isOpen: boolean) => {
    const url = new URL(window.location.href);
    if (isOpen) url.searchParams.set("detail", "page");
    else url.searchParams.delete("detail");
    window.history.replaceState({}, "", url);
  };

  const openPptDetail = () => {
    if (pptPageLoadStates[pptPageIndex] === "error") return;
    updatePptDetailUrl(true);
    setPptZoomOpen(true);
  };

  const closePptDetail = () => {
    updatePptDetailUrl(false);
    setPptZoomOpen(false);
  };

  const closePptArchive = (open: boolean) => {
    setPptOpen(open);
    if (!open) {
      updatePptArchiveUrl(false);
      setPptIndexOpen(false);
      setPptZoomOpen(false);
      setPptTouchStart(null);
    }
  };

  const handleDirectoryKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusableItems = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
    );
    if (focusableItems.length === 0) return;
    const currentIndex = focusableItems.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusableItems.length - 1 : currentIndex - 1)
      : (currentIndex >= focusableItems.length - 1 ? 0 : currentIndex + 1);
    event.preventDefault();
    focusableItems[nextIndex].focus();
  };

  const openPptArchive = () => {
    setPptPageIndex(0);
    setPptIndexOpen(false);
    setPptZoomOpen(false);
    setPptPageLoadStates((states) => ({ ...states, 0: states[0] === "ready" ? "ready" : "loading" }));
    updatePptArchiveUrl(true);
    updatePptIndexUrl(false);
    updatePptDetailUrl(false);
    setPptOpen(true);
  };

  const setPptPageLoadState = (pageIndex: number, loadState: PptPageLoadState) => {
    setPptPageLoadStates((states) => (states[pageIndex] === loadState ? states : { ...states, [pageIndex]: loadState }));
  };

  const preparePptThumbnailStates = () => {
    setPptPageLoadStates((states) => initializePptPageLoadStates(states, pptPages.length));
  };

  const togglePptIndex = () => {
    const nextOpen = !pptIndexOpen;
    if (nextOpen) preparePptThumbnailStates();
    updatePptIndexUrl(nextOpen);
    setPptIndexOpen(nextOpen);
  };

  const goToPptPage = (targetIndex: number) => {
    const nextIndex = getBoundedPptPageIndex(targetIndex, pptPages.length);
    if (nextIndex === pptPageIndex || pptTurning) return;
    setPptTurnDirection(nextIndex > pptPageIndex ? 1 : -1);
    setPptTurning(true);
    setPptPageLoadState(nextIndex, pptPageLoadStates[nextIndex] === "ready" ? "ready" : "loading");
    setPptPageIndex(nextIndex);
    window.setTimeout(() => setPptTurning(false), 280);
  };

  const movePptPage = (direction: 1 | -1) => goToPptPage(pptPageIndex + direction);

  const handlePptTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const endX = event.changedTouches[0]?.clientX;
    if (pptTouchStart === null || endX === undefined) return;
    const distance = endX - pptTouchStart;
    setPptTouchStart(null);
    if (Math.abs(distance) >= 48) movePptPage(distance < 0 ? 1 : -1);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("archive") !== "ppt") return;
    const shouldOpenIndex = searchParams.get("index") === "pages";
    const shouldOpenDetail = searchParams.get("detail") === "page";
    const shouldPreviewThumbnailLoading = searchParams.get("preview") === "loading";
    setPptPageIndex(0);
    setPptIndexOpen(shouldOpenIndex);
    setPptZoomOpen(shouldOpenDetail);
    setPptThumbnailPreviewLoading(shouldPreviewThumbnailLoading);
    setPptPageLoadStates((states) => {
      const nextStates: Record<number, PptPageLoadState> = { ...states, 0: states[0] === "ready" ? "ready" : "loading" };
      return shouldOpenIndex ? initializePptPageLoadStates(nextStates, pptPages.length) : nextStates;
    });
    setPptOpen(true);
  }, []);

  useEffect(() => {
    if (!directoryOpen) return;
    const frame = window.requestAnimationFrame(() => directoryCloseRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [directoryOpen]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0);
    };

    const sectionElements = archiveSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.05, 0.25, 0.5] },
    );

    sectionElements.forEach((section) => observer.observe(section));
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("force-reduced-motion") === "true";
    document.documentElement.dataset.reducedMotion = reduceMotion ? "true" : "false";
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    if (reduceMotion || revealTargets.length === 0) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    revealTargets.forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!pptOpen) return;

    [pptPageIndex - 1, pptPageIndex + 1]
      .filter((index) => index >= 0 && index < pptPages.length)
      .forEach((index) => {
        const preloadedPage = new Image();
        preloadedPage.onload = () => setPptPageLoadState(index, "ready");
        preloadedPage.onerror = () => setPptPageLoadState(index, "error");
        preloadedPage.src = pptPages[index];
      });

    const handlePptKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (pptZoomOpen) closePptDetail();
        else if (pptIndexOpen) setPptIndexOpen(false);
        else closePptArchive(false);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePptPage(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        movePptPage(1);
      }
    };

    window.addEventListener("keydown", handlePptKeyDown, true);
    return () => window.removeEventListener("keydown", handlePptKeyDown, true);
  }, [pptIndexOpen, pptOpen, pptPageIndex, pptTurning, pptZoomOpen]);

  const copyWechat = async () => {
    await navigator.clipboard?.writeText("s18856178379");
  };

  const openCertificates = (certificateId: string) => {
    const matchedCertificate = certificates.find((certificate) => certificate.id === certificateId);
    setActiveCertificate(matchedCertificate ?? certificates[1]);
    setCertificateOpen(true);
  };

  const currentIdentity = identityProfiles[identityIndex];

  const moveIdentity = (direction: 1 | -1) => {
    if (bookTurning) return;
    const nextIndex = (identityIndex + direction + identityProfiles.length) % identityProfiles.length;
    const from = identityProfiles[identityIndex];
    const to = identityProfiles[nextIndex];
    setBookTurning(true);
    setIdentityCardOpen(false);
    setTurnLeaf({ from, to, direction });
    window.setTimeout(() => setIdentityIndex(nextIndex), 620);
    window.setTimeout(() => { setBookTurning(false); setTurnLeaf(null); }, 980);
  };

  const handleBookWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 8 || bookTurning) return;
    event.preventDefault();
    moveIdentity(event.deltaY > 0 ? 1 : -1);
  };

  const handleWorkCardPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--work-rotate-x", `${(y * -4.5).toFixed(2)}deg`);
    card.style.setProperty("--work-rotate-y", `${(x * 5.5).toFixed(2)}deg`);
    card.style.setProperty("--work-glare-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--work-glare-y", `${(y + 0.5) * 100}%`);
  };

  const resetWorkCardPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.removeProperty("--work-rotate-x");
    card.style.removeProperty("--work-rotate-y");
    card.style.removeProperty("--work-glare-x");
    card.style.removeProperty("--work-glare-y");
  };

  const openDirectory = () => {
    savedReadingPositionRef.current = window.scrollY;
    setDirectoryOpen(true);
  };

  const returnToReadingPosition = () => {
    const restoredPosition = getRestoredReadingPosition(
      savedReadingPositionRef.current,
      document.documentElement.scrollHeight,
      window.innerHeight,
    );
    setDirectoryOpen(false);
    window.scrollTo({ top: restoredPosition, behavior: "auto" });
    window.requestAnimationFrame(() => directoryTriggerRef.current?.focus({ preventScroll: true }));
  };

  const turnToSection = (sectionId: string) => {
    setDirectoryOpen(false);
    setIdentityCardOpen(false);
    setPageTurning(false);
    setActiveSection(sectionId);

    const target = document.getElementById(sectionId);
    if (!target) return;

    const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const targetTop = Math.max(target.getBoundingClientRect().top + window.scrollY - headerHeight - 12, 0);
    window.scrollTo({ top: targetTop, behavior: "auto" });
  };

  return (
    <div className="archive-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回王果典个人档案首页">
          <span className="brand-mark"><img src={staticMediaUrl("portfolio-mark_1782bf8b.png")} alt="" /><i /></span>
          <span className="wordmark"><b>WANG</b><i>/</i><b>GUODIAN</b><em>PERSONAL ARCHIVE · 2026</em></span>
        </a>
        <button ref={directoryTriggerRef} className="header-directory" type="button" onClick={openDirectory} aria-haspopup="dialog" aria-expanded={directoryOpen} data-cursor="section">
          <span>目录</span><small>CONTENTS</small><ChevronRight size={15} />
        </button>
        <a className="header-contact" href="#contact" data-cursor="envelope">
          联系 <ArrowUpRight size={15} strokeWidth={1.8} />
        </a>
        <div className="site-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      </header>

      <aside className="archive-index" aria-label="章节定位">
        <span className="archive-index-title">ARCHIVE / NAV</span>
        <div className="archive-index-track" aria-hidden="true"><span style={{ transform: `scaleY(${scrollProgress})` }} /></div>
        {archiveSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={activeSection === section.id ? "is-active" : ""}
            aria-current={activeSection === section.id ? "location" : undefined}
            onClick={(event) => { event.preventDefault(); turnToSection(section.id); }}
            title={`${section.index} ${section.label}`}
          >
            <i aria-hidden="true" />
            <span>{section.index}</span>
            <b>{section.label}</b>
          </a>
        ))}
      </aside>

      <div className={`archive-directory ${directoryOpen ? "is-open" : ""}`} aria-hidden={!directoryOpen}>
        <button className="directory-backdrop" type="button" onClick={() => setDirectoryOpen(false)} aria-label="关闭目录" />
        <section id="archive-contents" className="directory-sheet" role="dialog" aria-modal="true" aria-label="个人档案目录" onKeyDown={handleDirectoryKeyDown}>
          <div className="directory-sheet-head">
            <div><p className="eyebrow">PERSONAL ARCHIVE / 2026</p><h2>目录</h2></div>
            <button ref={directoryCloseRef} type="button" className="directory-close" onClick={() => setDirectoryOpen(false)} aria-label="关闭目录"><X size={20} /></button>
          </div>
          <p className="directory-intro">选择一页，继续翻阅王果典的个人档案。</p>
          <button className="directory-return" type="button" onClick={returnToReadingPosition} data-cursor="read">
            <ChevronLeft size={18} aria-hidden="true" />
            <span>返回当前阅读位置</span>
            <small>RETURN TO READING</small>
          </button>
          <div className="directory-list">
            {archiveSections.map((section) => (
              <button key={section.id} type="button" onClick={() => turnToSection(section.id)} data-cursor="section">
                <span>{section.index}</span>
                <strong>{section.label}</strong>
                <p>{section.description}</p>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
          <p className="directory-foot">CLICK A PAGE TO CONTINUE READING</p>
        </section>
      </div>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-rail" aria-hidden="true">
            <span>个人档案</span>
            <span>2026 — ∞</span>
          </div>
          <div className="hero-parallax-field" aria-hidden="true">
            <span className="hero-parallax-stamp">FIELD / 00</span>
            <i className="hero-parallax-orbit" />
            <i className="hero-parallax-rule" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">A / 00 · PERSONAL ARCHIVE</p>
            <h1 id="hero-title">
              <BreathingText text="王果典" className="hero-name-breathing" />
              <em><BreathingText text="以中药学学习为起点，用 AI、代码与运营经验解决真实问题。" className="hero-statement-breathing" /></em>
            </h1>
            <p className="hero-intro">
              <BreathingText text="即将进入中药学专业学习。我正在把对人工智能的兴趣、基础编程能力与真实运营经验，整理成一条持续生长的跨学科路径。" className="hero-intro-breathing" />
            </p>
            <div className="hero-actions">
              <a className="ink-button" href="#featured-work" data-cursor="read">
                查看作品集 <ArrowDown size={17} />
              </a>
              <a className="text-link" href="#contact" data-cursor="envelope">
                联系我 <ChevronRight size={16} />
              </a>
            </div>
            <div className="hero-contact-ledger" aria-label="首页联系方式">
              <p>CONTACT / START A CONVERSATION</p>
              <div>
                <a href="tel:18856178379"><Phone size={15} /> 188 5617 8379</a>
                <button type="button" onClick={copyWechat}><Copy size={15} /> 微信 s18856178379 <span>复制</span></button>
                <a href="mailto:2059877032@qq.com"><Send size={15} /> 2059877032@qq.com</a>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art-meta">
              <span>FIELD NOTES</span>
              <span>01 / 03</span>
            </div>
            <img
              src={staticMediaUrl("portfolio-hero-editorial_b42edde5.jpg")}
              alt="纸张、半透明描图纸和墨绿色物件组成的编辑工作台静物"
            />
            <div className="hero-art-annotation" aria-hidden="true">
              <span>HERBARIUM / AI</span>
              <b>信息整理<br />实验记录</b>
            </div>
            <p>以问题为起点，持续记录、拆解与实践。</p>
          </div>
          <a className="scroll-cue" href="#profile" aria-label="滚动至个人概览">
            <span>SCROLL TO READ</span>
            <ArrowDown size={17} />
          </a>
        </section>

        <section id="featured-work" className="featured-work-section scroll-reveal" data-scroll-reveal aria-labelledby="featured-work-heading">
          <div className="featured-work-heading">
            <div>
              <p className="eyebrow">SELECTED WORK / 03</p>
              <h2 id="featured-work-heading">先看作品，<em>再进入档案。</em></h2>
            </div>
            <p>三件作品分别记录 AI 编程、视觉表达与网页交互实践。悬停查看线索，点击进入完整体验。</p>
          </div>
          <div className="featured-work-grid">
            <a className="featured-work-card featured-work-tank" href={tankGame.url} target="_blank" rel="noreferrer" data-cursor="launch" aria-label="打开 WGD 校园防线坦克大战" onPointerMove={handleWorkCardPointerMove} onPointerLeave={resetWorkCardPointer}>
              <div className="featured-work-media featured-work-media-tank" aria-hidden="true">
                <img className="featured-work-tank-image" src={staticMediaUrl("wgd-campus-defense-start_f093aabd.webp")} alt="" />
                <span className="featured-work-stamp">{featuredWork[0].index}</span><strong>WGD<br />DEFENSE</strong>
              </div>
              <div className="featured-work-card-body"><p>{featuredWork[0].kind}</p><h3>{featuredWork[0].title}</h3><span>{featuredWork[0].summary} <ArrowUpRight size={16} /></span></div>
            </a>
            <button className="featured-work-card featured-work-ppt" type="button" onClick={openPptArchive} data-cursor="verify" aria-label="打开秸约未来 PPT 档案放映册" onPointerMove={handleWorkCardPointerMove} onPointerLeave={resetWorkCardPointer}>
              <div className="featured-work-media"><img src={staticMediaUrl("straw-future-clean-cover_be7078fc.png")} alt="秸约未来 PPT 封面" /><span className="featured-work-pages">20<br /><small>PAGES</small></span><i aria-hidden="true" /></div>
              <div className="featured-work-card-body"><p>{featuredWork[1].kind}</p><h3>{featuredWork[1].title}</h3><span>{featuredWork[1].summary} <ArrowUpRight size={16} /></span></div>
            </button>
            <a className="featured-work-card featured-work-stellar" href={stellarGame.url} target="_blank" rel="noreferrer" data-cursor="launch" aria-label="打开星际之怒飞机大战" onPointerMove={handleWorkCardPointerMove} onPointerLeave={resetWorkCardPointer}>
              <div className="featured-work-media featured-work-media-stellar" aria-hidden="true"><span className="stellar-orbit stellar-orbit-a" /><span className="stellar-orbit stellar-orbit-b" /><span className="stellar-ship" /><span className="stellar-star stellar-star-a" /><span className="stellar-star stellar-star-b" /><span className="featured-work-stamp">{featuredWork[2].index}</span><strong>STELLAR<br />FURY</strong></div>
              <div className="featured-work-card-body"><p>{featuredWork[2].kind}</p><h3>{featuredWork[2].title}</h3><span>{featuredWork[2].summary} <ArrowUpRight size={16} /></span></div>
            </a>
          </div>
        </section>

        <section id="reading-rooms" className="reading-room scroll-reveal" data-scroll-reveal aria-labelledby="reading-rooms-heading">
          <div className="reading-room-heading">
            <div><p className="eyebrow">A / 00.5 · READING ROOMS</p><h2 id="reading-rooms-heading">从一份档案，<br /><em>进入三条正在展开的线索。</em></h2></div>
            <p>三张入口卡并不复制简历内容，而是把已有经历、作品与下一步关注的问题，整理成更适合主动探索的阅读路径。</p>
          </div>
          <div className="reading-room-grid">
            <a className="reading-room-card reading-room-herb" href={herbRoom.target} data-cursor="page" data-hover-depth="herb">
              <span>01 / FIELD NOTE</span><i aria-hidden="true" /><h3>{herbRoom.title}</h3><p>从中药学学习、课程准备与待研究的问题出发，进入持续积累的学习路径。</p><b>进入学习路径 <ArrowUpRight size={16} /></b>
            </a>
            <a className="reading-room-card reading-room-ai" href={aiRoom.target} data-cursor="page" data-hover-depth="ai">
              <span>02 / BUILD LOG</span><i aria-hidden="true" /><h3>{aiRoom.title}</h3><p>从训练师认证、网页编程到可独立试玩的双游戏作品，查看工具如何成为实践。</p><b>进入作品工坊 <ArrowUpRight size={16} /></b>
            </a>
            <a className="reading-room-card reading-room-editorial" href={editorialRoom.target} data-cursor="page" data-hover-depth="editorial">
              <span>03 / EDITORIAL FILE</span><i aria-hidden="true" /><h3>{editorialRoom.title}</h3><p>翻阅《秸约未来》项目叙事，查看如何用信息结构与视觉节奏说明复杂内容。</p><b>进入放映册 <ArrowUpRight size={16} /></b>
            </a>
          </div>
        </section>

        <section id="profile" className="profile-section scroll-reveal" data-scroll-reveal aria-labelledby="profile-heading">
          <SectionHeading
            index="A / 01"
            eyebrow="IDENTITY INDEX"
            title="身份不是标签，而是正在翻开的书页。"
          />
          <div className="profile-book-layout">
            <div className="identity-intro">
              <p>我正在把中药学学习、AI 编程、内容表达与真实运营经历，整理为一条可以持续记录、持续翻阅的个人路径。</p>
              <div className="profile-tags" aria-label="个人关注方向"><span>中药学</span><span>AI 应用</span><span>Python</span><span>数字运营</span><span>内容表达</span></div>
              <div className="identity-instruction"><span>SCROLL / ← →</span><i /><b>滚动或使用方向键，翻阅五种身份</b></div>
            </div>
            <div className={`identity-stage ${bookTurning ? "is-turning" : ""}`} onWheel={handleBookWheel} onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); moveIdentity(1); }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); moveIdentity(-1); }
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setIdentityCardOpen((open) => !open); }
            }} tabIndex={0} aria-label={`身份书本，当前为${currentIdentity.title}。使用方向键或鼠标滚轮翻页，回车打开身份说明。`}>
              <div className="identity-book">
                <div className="book-back" />
                <div className="book-spine" aria-hidden="true" />
                <div className="book-cover">
                  <p>PERSONAL ARCHIVE</p><h3>王果典</h3><em>一个一直在路上的<br />行进者</em>
                  <span className="book-cover-note">IDENTITY INDEX / 05</span>
                  <span>2026 / 01</span>
                </div>
                <button className={`identity-page identity-page-${currentIdentity.id}`} type="button" key={currentIdentity.id} onClick={() => setIdentityCardOpen(true)} data-cursor="read">
                  <IdentityLeaf identity={currentIdentity} />
                  <span className="identity-page-corner-fold" aria-hidden="true"><span className="identity-page-corner-hint">翻页</span></span>
                </button>
                {turnLeaf ? <div className={`book-turn-leaf ${turnLeaf.direction === 1 ? "is-next" : "is-prev"}`} aria-hidden="true"><IdentityTurnSheet identity={turnLeaf.from} /></div> : null}
              </div>
              <div className={`identity-card ${identityCardOpen ? "is-open" : ""}`} aria-hidden={!identityCardOpen}>
                <div><p className="eyebrow">IDENTITY NOTE / {currentIdentity.number}</p><h4>{currentIdentity.title}</h4><p>{currentIdentity.note}</p><button type="button" onClick={() => turnToSection(currentIdentity.target)} data-cursor="section">{currentIdentity.targetLabel}<ArrowUpRight size={16} /></button></div>
                <button className="identity-card-close" type="button" onClick={() => setIdentityCardOpen(false)}>合上这一页 <X size={14} /></button>
              </div>
              <div className="book-controls" aria-label="切换身份书页"><button type="button" onClick={() => moveIdentity(-1)} aria-label="上一页身份" data-cursor="turn"><ChevronLeft size={18} /></button><span>{currentIdentity.number} / 05</span><button type="button" onClick={() => moveIdentity(1)} aria-label="下一页身份" data-cursor="turn"><ChevronRight size={18} /></button></div>
            </div>
          </div>
        </section>

        <section id="capability" className="capability-section scroll-reveal" data-scroll-reveal aria-labelledby="capability-heading">
          <SectionHeading
            index="A / 02"
            eyebrow="CAPABILITY MAP"
            title="用工具梳理问题，用结果校验方法。"
            description="四组能力并非孤立的标签；它们共同服务于研究、沟通与真实业务中的问题解决。"
          />
          <div className="capability-list" id="capability-heading">
            <div className="capability-rail" aria-hidden="true"><span>METHOD NOTES</span><span>A / 02</span></div>
            {capabilities.map((item) => (
              <article className="capability-item" key={item.index}>
                <span className="capability-number">{item.index}</span>
                <span className="capability-note">{item.note}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="capability-mark" aria-hidden="true">✦</span>
              </article>
            ))}
          </div>
        </section>

        <section id="practice" className="practice-section scroll-reveal" data-scroll-reveal aria-labelledby="practice-heading">
          <SectionHeading
            index="A / 03"
            eyebrow="PRACTICE ARCHIVE"
            title="在高要求的场景里，练习协同与复盘。"
            description="以下记录聚焦我在运营与校园组织中承担的任务、采取的方法与形成的结果。"
          />

          <article className="case-study case-study-dark">
            <div className="case-side">
              <span>CASE / 01</span>
              <span>2025.06 — NOW</span>
            </div>
            <div className="case-content">
              <p className="case-type">线上平台 · 演唱会票务代理</p>
              <h3>在高并发与票源紧张中，练习更有响应力的用户运营。</h3>
              <div className="case-body">
                <p>
                  面对单日峰值访问量超 100 万次的票务环境，我搭建分级用户社群矩阵，针对不同用户推送演出信息，并整合供应资源形成紧急响应通道。
                </p>
                <ul>
                  <li><Check size={15} /> 构建微信群、朋友圈与 KOL 协同的分层触达机制。</li>
                  <li><Check size={15} /> 整合 4 家二级供应商，建立紧急票源响应通道。</li>
                </ul>
              </div>
              <div className="case-metrics">
                <div><strong>35%</strong><span>新客获客成本降低</span></div>
                <div><strong>76%</strong><span>社群用户年留存率</span></div>
              </div>
              <button className="case-note-trigger" type="button" onClick={() => setOpenCase(openCase === "ticket" ? null : "ticket")} aria-expanded={openCase === "ticket"}>
                <span>{openCase === "ticket" ? "收起方法注记" : "展开方法注记"}</span>
                <ChevronDown size={17} />
              </button>
              <div className={`case-note-panel ${openCase === "ticket" ? "is-open" : ""}`} aria-hidden={openCase !== "ticket"}>
                <div>
                  <p className="eyebrow">{caseNotes.ticket.label}</p>
                  <h4>{caseNotes.ticket.title}</h4>
                  <ol>{caseNotes.ticket.items.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
                </div>
              </div>
            </div>
            <div className="evidence-sheet evidence-ticket" aria-label="票务运营的信息整理示意">
              <div className="evidence-rule" />
              <p>FIELD NOTE / 01</p>
              <strong>需求<br />分层</strong>
              <div className="evidence-index"><span>社群矩阵</span><span>资源协同</span><span>即时响应</span></div>
              <i>01<br />25</i>
            </div>
          </article>

          <article className="case-study case-study-light">
            <div className="case-side">
              <span>CASE / 02</span>
              <span>2024.09 — 2026.06</span>
            </div>
            <div className="case-content">
              <p className="case-type">某中学 · 高中生物课代表</p>
              <h3>把知识点、实验与答疑机制组织成一张可持续使用的学习网络。</h3>
              <div className="case-body">
                <p>
                  围绕班级的知识掌握与实验报告问题，我主导“三维知识图谱”整理，配合每周专题答疑，让重点内容、错题与实验任务能够被及时看见和跟进。
                </p>
                <ul>
                  <li><Check size={15} /> 覆盖 12 个核心考点的思维导图、AR 模型与错题数据库。</li>
                  <li><Check size={15} /> 建立“1 对 N”答疑机制，协调教师资源每周开展 3 次专题突破。</li>
                </ul>
              </div>
              <div className="case-metrics">
                <div><strong>92</strong><span>班级平均分</span></div>
                <div><strong>100%</strong><span>实验报告提交率</span></div>
              </div>
              <button className="case-note-trigger" type="button" onClick={() => setOpenCase(openCase === "biology" ? null : "biology")} aria-expanded={openCase === "biology"}>
                <span>{openCase === "biology" ? "收起方法注记" : "展开方法注记"}</span>
                <ChevronDown size={17} />
              </button>
              <div className={`case-note-panel ${openCase === "biology" ? "is-open" : ""}`} aria-hidden={openCase !== "biology"}>
                <div>
                  <p className="eyebrow">{caseNotes.biology.label}</p>
                  <h4>{caseNotes.biology.title}</h4>
                  <ol>{caseNotes.biology.items.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
                </div>
              </div>
            </div>
            <div className="evidence-sheet evidence-biology" aria-label="生物学习知识图谱的整理示意">
              <div className="specimen specimen-one" />
              <div className="specimen specimen-two" />
              <p>KNOWLEDGE ATLAS</p>
              <strong>12<br /><span>核心考点</span></strong>
              <div className="evidence-index"><span>知识图谱</span><span>错题回路</span><span>专题答疑</span></div>
              <i>02<br />24</i>
            </div>
          </article>
        </section>

        <section id="path" className="path-section scroll-reveal" data-scroll-reveal aria-labelledby="path-heading">
          <SectionHeading
            index="A / 04"
            eyebrow="LEARNING PATH"
            title="专业教育，是下一段实践的起点。"
          />
          <div className="path-layout">
            <div className="education-card">
              <GraduationCap size={27} strokeWidth={1.5} />
              <p className="eyebrow">2026.09 — 2030.07</p>
              <h3>安徽科技工程大学<br />中药学</h3>
              <p>预计于 2026 年 9 月入学，围绕中药鉴定学、药理学基础等课程，建立对药物与生命科学的系统理解。</p>
              <div><span>专业学习</span><span>研究探索</span></div>
            </div>
            <div className="path-note">
              <p className="eyebrow">OPEN QUESTION</p>
              <Lightbulb size={22} strokeWidth={1.5} />
              <blockquote>如何把中药学学习、AI 工具与信息表达，组织成可持续积累的实践？</blockquote>
              <p>这将是我在大学阶段持续关注，并希望通过课程、实验与实践逐步回答的问题。</p>
            </div>
          </div>
        </section>

        <section className="recognition-section scroll-reveal" data-scroll-reveal aria-labelledby="recognition-heading">
          <SectionHeading
            index="A / 05"
            eyebrow="RECOGNITION"
            title="已取得的认证，是下一次练习的起点。"
          />
          <p className="recognition-side-note">CREDENTIALS / TRAINING / FIELD PROOF</p>
          <div className="recognition-ledger" aria-hidden="true"><span>ARCHIVE RECORD</span><i /><span>02 VERIFIED CREDENTIALS</span></div>
          <div className="award-list" id="recognition-heading">
            {awards.map((award) => (
              award.certificateId ? (
                <button className="award-entry certificate-entry" type="button" key={award.title} onClick={() => openCertificates(award.certificateId)}>
                  <span>{award.year}</span>
                  <h3><BadgeCheck size={18} strokeWidth={1.7} /> {award.title}</h3>
                  <p>{award.note}</p>
                  <Maximize2 size={19} strokeWidth={1.5} />
                </button>
              ) : (
                <article className="award-entry" key={award.title}>
                  <span>{award.year}</span>
                  <h3>{award.title}</h3>
                  <p>{award.note}</p>
                  <ArrowUpRight size={20} strokeWidth={1.5} />
                </article>
              )
            ))}
          </div>
        </section>

        <section id="work" className="work-section scroll-reveal" data-scroll-reveal aria-labelledby="work-heading">
          <div className="work-heading">
            <div className="work-heading-index" aria-hidden="true"><span className="section-mark"><img src={staticMediaUrl("portfolio-mark_1782bf8b.png")} alt="" /><i /></span><span>A / 06</span><b>SPECIMEN TABLE</b></div>
            <div>
              <p className="eyebrow">A / 06 · PORTFOLIO SPECIMEN</p>
              <h2 id="work-heading">把绿色产业化方案，<br /><em>整理成一份清晰的项目叙事。</em></h2>
            </div>
            <p>文件注记：一份 20 页的绿色产业项目汇报范例，依次记录项目背景、方案路径、市场分析与发展规划。</p>
          </div>
          <button id="ppt-archive" className="ppt-project" type="button" onClick={openPptArchive} aria-label="翻阅秸约未来图片作品集" data-cursor="verify">
            <div className="ppt-project-cover">
              <img src={staticMediaUrl("straw-future-clean-cover_be7078fc.png")} alt="秸约未来清洁版演示文稿封面：田野和麦穗背景上的项目标题" />
              <span className="ppt-project-pages">20<br /><small>PAGES</small></span>
              <span className="ppt-project-crop" aria-hidden="true" />
            </div>
            <div className="ppt-project-info">
              <div>
                <p className="eyebrow">PPT DESIGN / GREEN INDUSTRY</p>
                <h3>秸约未来——秸秆多级利用与绿色产业化发展模式</h3>
              </div>
              <p><strong>SOURCE NOTE</strong> 绿能生科创业团队 · 第十二届「挑战杯」安徽省大学生创业计划竞赛</p>
              <span className="ppt-view-call"><FileText size={18} /> ARCHIVE READER · 开始翻阅 <ArrowUpRight size={18} /></span>
            </div>
          </button>
          <div className="work-meta">
            <span><Sparkles size={15} /> A / 06 · PROJECT FILE · 20 PAGES · PDF READY</span>
            <a href={staticMediaUrl("straw-future-clean_95f53e3e.pptx")} download>下载清洁版 PPTX <Download size={15} /></a>
          </div>

          <div id="ai-work" className="game-collection" aria-label="AI 编程网页游戏作品">
            <article className="game-specimen game-specimen-tank">
              <div className="game-specimen-rail" aria-hidden="true"><span>AI CODING / INDEPENDENT RELEASE</span><span>GAME / 01</span></div>
              <div className="game-screen tank-screen" aria-hidden="true">
                <div className="tank-grid" />
                <span className="tank-route tank-route-a" />
                <span className="tank-route tank-route-b" />
                <span className="tank-wall tank-wall-a" />
                <span className="tank-wall tank-wall-b" />
                <span className="tank-unit tank-unit-player" />
                <span className="tank-unit tank-unit-enemy" />
                <span className="game-screen-index">01 / LIVE</span>
                <strong>WGD<br />DEFENSE</strong>
                <p>TOP-DOWN TACTICAL<br />CAMPUS BATTLE</p>
              </div>
              <div className="game-specimen-copy">
                <p className="eyebrow">AI CODING PRACTICE / FEATURED GAME</p>
                <h3>《WGD 校园防线：<br />坦克大战》</h3>
                <p>一款独立发布的俯视角校园战术游戏。玩家可在五张不同地图中推进战役，并在无尽模式中持续应对不同敌军、武器与战场路线。</p>
                <p className="game-status"><span>已上线</span> 五关主线 · 无尽模式 · 独立试玩</p>
                <dl className="game-ledger">
                  <div><dt>FORMAT</dt><dd>独立网页游戏</dd></div>
                  <div><dt>MODE</dt><dd>俯视操控 / 战术战斗</dd></div>
                  <div><dt>ROLE</dt><dd>AI 编程 / 系统设计</dd></div>
                </dl>
                <a className="game-launch" href={tankGame.url} target="_blank" rel="noreferrer" data-cursor="launch"><Gamepad2 size={18} /> 独立新标签试玩 <ArrowUpRight size={18} /></a>
              </div>
            </article>

            <article className="game-specimen game-specimen-stellar">
              <div className="game-specimen-rail" aria-hidden="true"><span>AI CODING / INTERACTIVE BUILD</span><span>GAME / 02</span></div>
              <div className="game-screen" aria-hidden="true">
                <div className="game-stars" />
                <div className="game-horizon" />
                <span className="game-screen-index">02 / ARCHIVE</span>
                <strong>STELLAR<br />FURY</strong>
                <span className="game-crosshair" />
                <p>WEB ARCADE<br />FLIGHT SIMULATION</p>
              </div>
              <div className="game-specimen-copy">
                <p className="eyebrow">AI CODING PRACTICE / EARLIER BUILD</p>
                <h3>《星际之怒》<br />飞机大战小游戏</h3>
                <p>一个可在线运行的网页飞机大战小游戏。我将它作为较早期的 AI 编程与交互设计实践：从游戏画面到实时输入反馈，让想法成为可试玩的网页体验。</p>
                <p className="game-status"><span>作品归档</span> 飞行战斗 · 即时输入 · 网页交互</p>
                <dl className="game-ledger">
                  <div><dt>FORMAT</dt><dd>浏览器网页游戏</dd></div>
                  <div><dt>MODE</dt><dd>实时操控 / 飞行战斗</dd></div>
                  <div><dt>ROLE</dt><dd>AI 编程实践与交互设计</dd></div>
                </dl>
                <a className="game-launch" href={stellarGame.url} target="_blank" rel="noreferrer" data-cursor="launch"><Gamepad2 size={18} /> 独立新标签试玩 <ArrowUpRight size={18} /></a>
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="contact-section scroll-reveal" data-scroll-reveal aria-labelledby="contact-heading">
          <div className="contact-topline"><span>A / 07</span><i /><span>CONTACT</span></div>
          <div className="contact-ledger" aria-hidden="true"><span>CORRESPONDENCE FILE</span><i /><span>REPLY CHANNELS / 03</span></div>
          <div className="contact-layout">
            <div>
              <p className="eyebrow">START A CONVERSATION</p>
              <h2 id="contact-heading">有一个值得推进的想法？<br /><em>写一封信，或打一个电话给我。</em></h2>
            </div>
            <div className="contact-links">
              <a href="tel:18856178379" data-cursor="envelope"><Phone size={18} /> 188 5617 8379 <ArrowUpRight size={17} /></a>
              <button type="button" onClick={copyWechat} data-cursor="envelope"><Copy size={18} /> 微信 s18856178379 <span>复制</span></button>
              <a href="mailto:2059877032@qq.com" data-cursor="envelope"><Send size={18} /> 2059877032@qq.com <ArrowUpRight size={17} /></a>
              <p><Send size={15} /> 可通过电话、微信或邮箱建立联系。</p>
            </div>
          </div>
        </section>
      </main>

      <div className={`page-turn ${pageTurning ? "is-active" : ""}`} aria-hidden="true"><span className="page-turn-left" /><span className="page-turn-right" /><b>WANG GUODIAN / ARCHIVE</b></div>
      <div className="leaf-cursor" aria-hidden="true"><span className="leaf-cursor-dot" /><span className="leaf-cursor-ring" /><span className="leaf-cursor-vein" /><span className="leaf-cursor-tag" /></div>

      <Dialog open={pptOpen} onOpenChange={closePptArchive}>
        <DialogContent className="ppt-dialog" showCloseButton={false}>
          <div className="certificate-dialog-head ppt-dialog-head">
            <div>
              <p className="eyebrow">A / 06 · PORTFOLIO FILE · 20 PAGES</p>
              <DialogTitle>秸约未来——秸秆多级利用与绿色产业化发展模式</DialogTitle>
              <DialogDescription>图片化档案放映册 · 使用左右按钮、键盘方向键或触屏滑动逐页阅读。</DialogDescription>
            </div>
            <DialogClose className="certificate-close" aria-label="关闭 PPT 查看器">
              <X size={20} />
            </DialogClose>
          </div>
          <div className="ppt-viewer ppt-archive-viewer">
            <div className="ppt-archive-stage" onTouchStart={(event) => setPptTouchStart(event.touches[0]?.clientX ?? null)} onTouchEnd={handlePptTouchEnd}>
              <div className={`ppt-page-sheet ${pptTurning ? "is-turning" : ""} ${pptTurnDirection === 1 ? "is-next" : "is-prev"}`} key={pptPageIndex}>
                <button className={`ppt-page-open is-${pptPageLoadStates[pptPageIndex] ?? "loading"}`} type="button" onClick={openPptDetail} aria-label={`放大查看第 ${pptPageIndex + 1} 页`} aria-disabled={pptPageLoadStates[pptPageIndex] === "error"}>
                  <img src={pptPages[pptPageIndex]} alt={`《秸约未来》演示文稿第 ${pptPageIndex + 1} 页`} onLoad={() => setPptPageLoadState(pptPageIndex, "ready")} onError={() => setPptPageLoadState(pptPageIndex, "error")} />
                  {pptPageLoadStates[pptPageIndex] !== "ready" ? <span className="ppt-page-load-message" aria-live="polite">{pptPageLoadStates[pptPageIndex] === "error" ? "页面图片暂时无法加载" : "正在装订此页…"}</span> : null}
                  <span className="ppt-page-detail"><Maximize2 size={16} /> 细看本页</span>
                </button>
              </div>
              <aside className="ppt-stage-meta" aria-label="当前页面信息">
                <p>ARCHIVE PAGE</p>
                <strong>{String(pptPageIndex + 1).padStart(2, "0")}<span> / {String(pptPages.length).padStart(2, "0")}</span></strong>
                <i />
                <p>左右翻阅<br />逐页查阅</p>
                <button type="button" onClick={openPptDetail}><Maximize2 size={16} /> 细看本页</button>
              </aside>
            </div>
            <div className="ppt-page-controls" aria-label="演示文稿翻页控制">
              <button type="button" onClick={() => movePptPage(-1)} disabled={pptPageIndex === 0} aria-label="查看上一页"><ChevronLeft size={18} /> 上一页</button>
              <span>PAGE {String(pptPageIndex + 1).padStart(2, "0")} / {String(pptPages.length).padStart(2, "0")}</span>
              <button type="button" onClick={() => movePptPage(1)} disabled={pptPageIndex === pptPages.length - 1} aria-label="查看下一页">下一页 <ChevronRight size={18} /></button>
              <button className="ppt-index-toggle" type="button" onClick={togglePptIndex} aria-expanded={pptIndexOpen}>{pptIndexOpen ? "收起页面索引" : "页面索引"}<ChevronDown size={16} /></button>
            </div>
            {pptIndexOpen ? (
              <div className="ppt-thumbnail-dock" aria-label="演示文稿页面索引">
                {pptPages.map((page, index) => {
                  const pageLoadState = pptPageLoadStates[index] ?? "loading";
                  const shouldShowThumbnailImage = !(pptThumbnailPreviewLoading && pageLoadState === "loading");
                  return (
                    <button key={page} type="button" className={`${index === pptPageIndex ? "is-active" : ""} ${pageLoadState === "loading" ? "is-loading" : ""}`} onClick={() => { goToPptPage(index); setPptIndexOpen(false); }} aria-label={`跳转至第 ${index + 1} 页`} aria-current={index === pptPageIndex ? "page" : undefined}>
                      {pageLoadState === "error" ? <span className="ppt-thumbnail-fallback">加载失败</span> : shouldShowThumbnailImage ? <img src={page} alt="" loading="lazy" onLoad={() => setPptPageLoadState(index, "ready")} onError={() => setPptPageLoadState(index, "error")} /> : null}
                      <span className="ppt-thumbnail-page-number">{String(index + 1).padStart(2, "0")}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="certificate-dialog-foot ppt-dialog-foot">
            <p>文件格式：PPTX / PDF · 共 20 页 · 图片按需加载</p>
            <div className="ppt-source-actions">
              <a className="ppt-pdf-link" href={staticMediaUrl("straw-future-clean_94e3813a.pdf")} target="_blank" rel="noreferrer"><FileText size={16} /> 查看 PDF</a>
              <a className="ppt-download" href={staticMediaUrl("straw-future-clean_95f53e3e.pptx")} download><Download size={16} /> 下载 PPTX</a>
            </div>
          </div>
          {pptZoomOpen ? (
            <div className="ppt-zoom-layer" role="dialog" aria-modal="true" aria-label={`《秸约未来》第 ${pptPageIndex + 1} 页放大查看`}>
              <button className="ppt-zoom-backdrop" type="button" onClick={closePptDetail} aria-label="关闭大图查看" />
              <section className="ppt-zoom-sheet">
                <div><span>DETAIL VIEW / {String(pptPageIndex + 1).padStart(2, "0")}</span><button type="button" onClick={closePptDetail} aria-label="关闭大图查看"><X size={19} /></button></div>
                <img src={pptPages[pptPageIndex]} alt={`《秸约未来》演示文稿第 ${pptPageIndex + 1} 页放大图`} onLoad={() => setPptPageLoadState(pptPageIndex, "ready")} onError={() => setPptPageLoadState(pptPageIndex, "error")} />
              </section>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>


      <Dialog open={certificateOpen} onOpenChange={setCertificateOpen}>
        <DialogContent className="certificate-dialog" showCloseButton={false}>
          <div className="certificate-dialog-head">
            <div>
              <p className="eyebrow">{activeCertificate.index} · VERIFIED CREDENTIAL</p>
              <DialogTitle>{activeCertificate.level}</DialogTitle>
              <DialogDescription>阿里达摩院 · 颁证日期：{activeCertificate.date}</DialogDescription>
            </div>
            <DialogClose className="certificate-close" aria-label="关闭证书查看器">
              <X size={20} />
            </DialogClose>
          </div>
          <div className="certificate-frame">
            <img src={activeCertificate.image} alt={`王果典的${activeCertificate.level}证书`} />
          </div>
          <div className="certificate-dialog-foot">
            <p>共 2 份认证凭证</p>
            <div className="certificate-tabs" aria-label="选择证书级别">
              {certificates.map((certificate) => (
                <button
                  key={certificate.id}
                  type="button"
                  onClick={() => setActiveCertificate(certificate)}
                  aria-pressed={activeCertificate.id === certificate.id}
                >
                  <span>{certificate.id === "junior" ? "01" : "02"}</span>
                  {certificate.id === "junior" ? "初级证书" : "高级证书"}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="site-footer">
        <div><span className="brand-mark"><img src={staticMediaUrl("portfolio-mark_1782bf8b.png")} alt="" /><i /></span> <span>WANG GUODIAN / 2026</span></div>
        <p>持续学习，持续整理，持续向前。</p>
        <a href="#top">BACK TO TOP <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  );
}
