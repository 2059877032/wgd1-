/**
 * 设计提醒：编辑工作室档案。以暖白、近黑和档案墨绿构成不对称的数字档案页；
 * 以章节编号、细线和克制的图文错位叙事，避免通用营销式居中卡片布局。
 */
import { useEffect, useState, type WheelEvent } from "react";
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
    image: "/wgd1-/media/ai-trainer-junior-wang-guodian.webp",
  },
  {
    id: "advanced",
    index: "CERT / 02",
    level: "人工智能训练师 · 高级",
    date: "2026 年 8 月 1 日",
    image: "/wgd1-/media/ai-trainer-advanced-wang-guodian.webp",
  },
];

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
  { id: "herbal", number: "01", title: "中药学学习者", note: "从中药学课程出发，建立对药物与生命科学的基础理解。", target: "path", targetLabel: "查看学习路径" },
  { id: "ai", number: "02", title: "AI 编程学习者", note: "用 AI、Python 与网页小游戏，把学习中的想法变成可交互的体验。", target: "work", targetLabel: "查看互动作品" },
  { id: "ppt", number: "03", title: "PPT 设计者", note: "通过演示文稿与信息可视化，把复杂问题整理成清晰的项目叙事。", target: "work", targetLabel: "查看 PPT 作品" },
  { id: "operations", number: "04", title: "运营实践者", note: "在用户触达、资源协同与响应节奏中，练习面向真实场景的运营方法。", target: "practice", targetLabel: "查看运营实践" },
  { id: "campus", number: "05", title: "校园组织者", note: "将知识图谱、专题答疑与实验跟进组织成持续反馈的学习网络。", target: "practice", targetLabel: "查看校园实践" },
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
        <span className="section-mark"><img src="/wgd1-/media/portfolio-mark.svg" alt="" /><i /></span>
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

function IdentityLeaf({ identity }: { identity: IdentityProfile }) {
  return <>
    <span className="identity-page-number">{identity.number} / 05</span>
    <p>IDENTITY LEAF</p>
    <h4>{identity.title}</h4>
    <em>{identity.note}</em>
    <span className="identity-page-read">点击阅读这页 <ChevronRight size={15} /></span>
  </>;
}

export default function Home() {
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [pptOpen, setPptOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
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
    window.setTimeout(() => setIdentityIndex(nextIndex), 305);
    window.setTimeout(() => { setBookTurning(false); setTurnLeaf(null); }, 650);
  };

  const handleBookWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 8 || bookTurning) return;
    event.preventDefault();
    moveIdentity(event.deltaY > 0 ? 1 : -1);
  };

  const turnToSection = (sectionId: string) => {
    setDirectoryOpen(false);
    setIdentityCardOpen(false);
    setPageTurning(true);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }, 260);
    window.setTimeout(() => setPageTurning(false), 760);
  };

  return (
    <div className="archive-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回王果典个人档案首页">
          <span className="brand-mark"><img src="/wgd1-/media/portfolio-mark.svg" alt="" /><i /></span>
          <span className="wordmark"><b>WANG</b><i>/</i><b>GUODIAN</b><em>PERSONAL ARCHIVE · 2026</em></span>
        </a>
        <button className="header-directory" type="button" onClick={() => setDirectoryOpen(true)} aria-haspopup="dialog" aria-expanded={directoryOpen}>
          <span>目录</span><small>CONTENTS</small><ChevronRight size={15} />
        </button>
        <a className="header-contact" href="#contact">
          联系 <ArrowUpRight size={15} strokeWidth={1.8} />
        </a>
        <div className="site-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      </header>

      <div className={`archive-directory ${directoryOpen ? "is-open" : ""}`} aria-hidden={!directoryOpen}>
        <button className="directory-backdrop" type="button" onClick={() => setDirectoryOpen(false)} aria-label="关闭目录" />
        <section id="archive-contents" className="directory-sheet" role="dialog" aria-modal="true" aria-label="个人档案目录">
          <div className="directory-sheet-head">
            <div><p className="eyebrow">PERSONAL ARCHIVE / 2026</p><h2>目录</h2></div>
            <button type="button" className="directory-close" onClick={() => setDirectoryOpen(false)} aria-label="关闭目录"><X size={20} /></button>
          </div>
          <p className="directory-intro">选择一页，继续翻阅王果典的个人档案。</p>
          <div className="directory-list">
            {archiveSections.map((section) => (
              <button key={section.id} type="button" onClick={() => turnToSection(section.id)}>
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
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">A / 00 · PERSONAL ARCHIVE</p>
            <h1 id="hero-title">
              王果典
              <em>以中药学学习为起点，用 AI、代码与运营经验解决真实问题。</em>
            </h1>
            <p className="hero-intro">
              即将进入中药学专业学习。我正在把对人工智能的兴趣、基础编程能力与真实运营经验，整理成一条持续生长的跨学科路径。
            </p>
            <div className="hero-actions">
              <a className="ink-button" href="#practice">
                阅读实践档案 <ArrowDown size={17} />
              </a>
              <a className="text-link" href="#contact">
                查看身份索引 <ChevronRight size={16} />
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
            <section className="hero-directory" aria-label="展开的个人档案目录">
              <div className="hero-directory-head"><span>INDEX / 07</span><strong>目录</strong><small>章节导览</small></div>
              <div className="hero-directory-list">
                {archiveSections.map((section) => (
                  <button key={section.id} type="button" onClick={() => turnToSection(section.id)}>
                    <span>{section.index}</span><strong>{section.label}</strong><small>{section.description}</small><ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </section>
          </div>
          <div className="hero-art">
            <div className="hero-art-meta">
              <span>FIELD NOTES</span>
              <span>01 / 03</span>
            </div>
            <img
              src="/wgd1-/media/portfolio-hero-editorial.jpg"
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

        <section id="profile" className="profile-section" aria-labelledby="profile-heading">
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
                <button className="identity-page" type="button" key={currentIdentity.id} onClick={() => setIdentityCardOpen(true)}>
                  <IdentityLeaf identity={currentIdentity} />
                </button>
                {turnLeaf ? <div className={`book-turn-leaf is-turning ${turnLeaf.direction === 1 ? "is-next" : "is-prev"}`} aria-hidden="true"><div className="turn-leaf-face turn-leaf-front"><IdentityLeaf identity={turnLeaf.from} /></div><div className="turn-leaf-face turn-leaf-back"><IdentityLeaf identity={turnLeaf.to} /></div></div> : null}
              </div>
              <div className={`identity-card ${identityCardOpen ? "is-open" : ""}`} aria-hidden={!identityCardOpen}>
                <div><p className="eyebrow">IDENTITY NOTE / {currentIdentity.number}</p><h4>{currentIdentity.title}</h4><p>{currentIdentity.note}</p><button type="button" onClick={() => turnToSection(currentIdentity.target)}>{currentIdentity.targetLabel}<ArrowUpRight size={16} /></button></div>
                <button className="identity-card-close" type="button" onClick={() => setIdentityCardOpen(false)}>合上这一页 <X size={14} /></button>
              </div>
              <div className="book-controls" aria-label="切换身份书页"><button type="button" onClick={() => moveIdentity(-1)} aria-label="上一页身份"><ChevronLeft size={18} /></button><span>{currentIdentity.number} / 05</span><button type="button" onClick={() => moveIdentity(1)} aria-label="下一页身份"><ChevronRight size={18} /></button></div>
            </div>
          </div>
        </section>

        <section id="capability" className="capability-section" aria-labelledby="capability-heading">
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

        <section id="practice" className="practice-section" aria-labelledby="practice-heading">
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

        <section id="path" className="path-section" aria-labelledby="path-heading">
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

        <section className="recognition-section" aria-labelledby="recognition-heading">
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

        <section id="work" className="work-section" aria-labelledby="work-heading">
          <div className="work-heading">
            <div className="work-heading-index" aria-hidden="true"><span className="section-mark"><img src="/wgd1-/media/portfolio-mark.svg" alt="" /><i /></span><span>A / 06</span><b>SPECIMEN TABLE</b></div>
            <div>
              <p className="eyebrow">A / 06 · PORTFOLIO SPECIMEN</p>
              <h2 id="work-heading">把绿色产业化方案，<br /><em>整理成一份清晰的项目叙事。</em></h2>
            </div>
            <p>文件注记：一份 20 页的绿色产业项目汇报范例，依次记录项目背景、方案路径、市场分析与发展规划。</p>
          </div>
          <button className="ppt-project" type="button" onClick={() => setPptOpen(true)} aria-label="在线查看秸约未来演示文稿">
            <div className="ppt-project-cover">
              <img src="/wgd1-/media/straw-future-clean-cover.png" alt="秸约未来清洁版演示文稿封面：田野和麦穗背景上的项目标题" />
              <span className="ppt-project-pages">20<br /><small>PAGES</small></span>
              <span className="ppt-project-crop" aria-hidden="true" />
            </div>
            <div className="ppt-project-info">
              <div>
                <p className="eyebrow">PPT DESIGN / GREEN INDUSTRY</p>
                <h3>秸约未来——秸秆多级利用与绿色产业化发展模式</h3>
              </div>
              <p><strong>SOURCE NOTE</strong> 绿能生科创业团队 · 第十二届「挑战杯」安徽省大学生创业计划竞赛</p>
              <span className="ppt-view-call"><FileText size={18} /> READING ROOM · 在线查看 <ArrowUpRight size={18} /></span>
            </div>
          </button>
          <div className="work-meta">
            <span><Sparkles size={15} /> A / 06 · PROJECT FILE · 20 PAGES · PDF READY</span>
            <a href="/wgd1-/media/straw-future-clean.pptx" download>下载清洁版 PPTX <Download size={15} /></a>
          </div>

          <article className="game-specimen">
            <div className="game-specimen-rail" aria-hidden="true"><span>AI CODING / INTERACTIVE BUILD</span><span>GAME / 01</span></div>
            <div className="game-screen" aria-hidden="true">
              <div className="game-stars" />
              <div className="game-horizon" />
              <span className="game-screen-index">01 / LIVE</span>
              <strong>STELLAR<br />FURY</strong>
              <span className="game-crosshair" />
              <p>WEB ARCADE<br />FLIGHT SIMULATION</p>
            </div>
            <div className="game-specimen-copy">
              <p className="eyebrow">AI CODING PRACTICE / WEB GAME</p>
              <h3>《星际之怒》<br />飞机大战小游戏</h3>
              <p>一个可在线运行的网页飞机大战小游戏。我将它作为 AI 编程与交互设计的实践样本：从游戏画面到实时输入反馈，让想法成为可试玩的网页体验。</p>
              <dl className="game-ledger">
                <div><dt>FORMAT</dt><dd>浏览器网页游戏</dd></div>
                <div><dt>MODE</dt><dd>实时操控 / 飞行战斗</dd></div>
                <div><dt>ROLE</dt><dd>AI 编程实践与交互设计</dd></div>
              </dl>
              <button className="game-launch" type="button" onClick={() => setGameOpen(true)}><Gamepad2 size={18} /> 进入试玩台 <ArrowUpRight size={18} /></button>
            </div>
          </article>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
          <div className="contact-topline"><span>A / 07</span><i /><span>CONTACT</span></div>
          <div className="contact-ledger" aria-hidden="true"><span>CORRESPONDENCE FILE</span><i /><span>REPLY CHANNELS / 03</span></div>
          <div className="contact-layout">
            <div>
              <p className="eyebrow">START A CONVERSATION</p>
              <h2 id="contact-heading">有一个值得推进的想法？<br /><em>写一封信，或打一个电话给我。</em></h2>
            </div>
            <div className="contact-links">
              <a href="tel:18856178379"><Phone size={18} /> 188 5617 8379 <ArrowUpRight size={17} /></a>
              <button type="button" onClick={copyWechat}><Copy size={18} /> 微信 s18856178379 <span>复制</span></button>
              <a href="mailto:2059877032@qq.com"><Send size={18} /> 2059877032@qq.com <ArrowUpRight size={17} /></a>
              <p><Send size={15} /> 可通过电话、微信或邮箱建立联系。</p>
            </div>
          </div>
        </section>
      </main>

      <div className={`page-turn ${pageTurning ? "is-active" : ""}`} aria-hidden="true"><span className="page-turn-left" /><span className="page-turn-right" /><b>WANG GUODIAN / ARCHIVE</b></div>

      <Dialog open={pptOpen} onOpenChange={setPptOpen}>
        <DialogContent className="ppt-dialog" showCloseButton={false}>
          <div className="certificate-dialog-head ppt-dialog-head">
            <div>
              <p className="eyebrow">A / 06 · PORTFOLIO FILE · 20 PAGES</p>
              <DialogTitle>秸约未来——秸秆多级利用与绿色产业化发展模式</DialogTitle>
              <DialogDescription>项目汇报范例 · 在线阅读清洁版 PDF 预览，或下载清洁版 PPTX 文件。</DialogDescription>
            </div>
            <DialogClose className="certificate-close" aria-label="关闭 PPT 查看器">
              <X size={20} />
            </DialogClose>
          </div>
          <div className="ppt-viewer">
            <iframe title="秸约未来——秸秆多级利用与绿色产业化发展模式清洁版 PDF 预览" src="/wgd1-/media/straw-future-clean.pdf" />
          </div>
          <div className="certificate-dialog-foot ppt-dialog-foot">
            <p>文件格式：PPTX / PDF · 共 20 页</p>
            <a className="ppt-download" href="/wgd1-/media/straw-future-clean.pptx" download><Download size={16} /> 下载清洁版 PPTX</a>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={gameOpen} onOpenChange={setGameOpen}>
        <DialogContent className="game-dialog" showCloseButton={false}>
          <div className="certificate-dialog-head game-dialog-head">
            <div>
              <p className="eyebrow">GAME / 01 · AI CODING PRACTICE</p>
              <DialogTitle>STELLAR FURY / 星际之怒</DialogTitle>
              <DialogDescription>网页飞机大战小游戏。点击游戏画面后使用键盘开始体验；如内嵌预览无法加载，可打开独立试玩页。</DialogDescription>
            </div>
            <DialogClose className="certificate-close" aria-label="关闭小游戏试玩台">
              <X size={20} />
            </DialogClose>
          </div>
          <div className="game-viewer">
            <iframe title="STELLAR FURY 星际之怒飞机大战小游戏" src="https://comforting-tiramisu-1b5156.netlify.app/" allow="fullscreen" />
          </div>
          <div className="certificate-dialog-foot game-dialog-foot">
            <p>在线试玩 · 外部作品地址</p>
            <a className="game-external" href="https://comforting-tiramisu-1b5156.netlify.app/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> 在新页面试玩</a>
          </div>
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
        <div><span className="brand-mark"><img src="/wgd1-/media/portfolio-mark.svg" alt="" /><i /></span> <span>WANG GUODIAN / 2026</span></div>
        <p>持续学习，持续整理，持续向前。</p>
        <a href="#top">BACK TO TOP <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  );
}
