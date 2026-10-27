import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BrainCircuit,
  Code,
  Contact,
  Cpu,
  Database,
  Download,
  Gauge,
  Mail,
  RotateCcw,
  ShieldCheck,
  WifiOff,
} from "lucide-react";

type ViewMode = "quick" | "lab";
type ClusterMode = "healthy" | "disconnected" | "straggler";

const links = {
  github: "https://github.com/nikhildinesharora",
  linkedin: "https://www.linkedin.com/in/nikhildinesharora",
  email: "mailto:nikhildinesharora@gmail.com",
  distributed: "https://github.com/nikhildinesharora/Distributed_AI_Training",
  bert: "https://github.com/nikhildinesharora/BERT-FineTuning-SQuAD-CUDA",
  netRag: "https://github.com/nikhildinesharora/Net-RAG",
  worldMemory: "https://github.com/nikhildinesharora/Egocentric-World-Memory",
  riscV: "https://github.com/nikhildinesharora/Risc-V-Simulator",
  embedded: "https://github.com/nikhildinesharora/Embedded-Sentry",
};

const clusterStates: Record<
  ClusterMode,
  {
    headline: string;
    workers: string;
    heartbeat: string;
    allocation: string;
    logs: string[];
  }
> = {
  healthy: {
    headline: "Cluster ready",
    workers: "3 ranks ready",
    heartbeat: "Nominal",
    allocation: "Weighted shard plan",
    logs: [
      "leader accepted mac_worker",
      "leader accepted win_worker",
      "rank snapshot: [0, 1, 2]",
      "heartbeats nominal",
    ],
  },
  disconnected: {
    headline: "Worker unavailable",
    workers: "2 ranks available",
    heartbeat: "Windows timeout",
    allocation: "Refresh next snapshot",
    logs: [
      "win_worker heartbeat missed",
      "worker removed from available pool",
      "active snapshot: [0, 1]",
      "awaiting re-registration",
    ],
  },
  straggler: {
    headline: "Straggler detected",
    workers: "3 ranks ready",
    heartbeat: "macOS delayed",
    allocation: "Batch scale bounded",
    logs: [
      "mac_worker response delayed",
      "benchmark weight re-evaluated",
      "batch multiplier clamped",
      "rank snapshot unchanged",
    ],
  },
};

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      elements.forEach((element) => element.setAttribute("data-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
    </a>
  );
}

function ClusterLab({ labMode }: { labMode: boolean }) {
  const [mode, setMode] = useState<ClusterMode>("healthy");
  const state = clusterStates[mode];

  const workerClass = useMemo(
    () => ({
      mac: mode === "straggler" ? "node-warning" : "node-healthy",
      windows: mode === "disconnected" ? "node-offline" : "node-healthy",
    }),
    [mode],
  );

  return (
    <div className={`cluster-lab cluster-${mode}`} aria-label="Distributed training architecture model">
      <div className="lab-titlebar">
        <div>
          <span className="micro-label">DISTRIBUTED TRAINING / CONTROL PLANE</span>
          <strong>{state.headline}</strong>
        </div>
        <span className={`health-light health-${mode}`} aria-hidden="true" />
      </div>

      <div className="cluster-stage">
        <svg viewBox="0 0 680 390" role="img" aria-labelledby="cluster-title cluster-desc">
          <title id="cluster-title">Leader and worker training topology</title>
          <desc id="cluster-desc">
            A leader coordinates one macOS worker and one Windows worker through registration,
            heartbeats, rank assignment, and data shard transfer.
          </desc>

          <path className="network-link link-mac" d="M340 128 C300 180 245 205 185 250" />
          <path className="network-link link-win" d="M340 128 C380 180 435 205 495 250" />
          <path className="network-link link-data" d="M340 128 L340 318" />

          <g className="data-packet packet-mac">
            <circle cx="268" cy="190" r="5" />
          </g>
          <g className="data-packet packet-win">
            <circle cx="412" cy="190" r="5" />
          </g>

          <g className="cluster-node node-leader">
            <rect x="245" y="38" width="190" height="96" rx="4" />
            <circle className="node-pulse" cx="412" cy="60" r="6" />
            <text className="node-kicker" x="267" y="67">LEADER / RANK 0</text>
            <text className="node-name" x="267" y="95">Control plane</text>
            <text className="node-meta" x="267" y="116">snapshot / assign / sync</text>
          </g>

          <g className={`cluster-node ${workerClass.mac}`}>
            <rect x="72" y="248" width="220" height="100" rx="4" />
            <circle className="node-pulse" cx="267" cy="270" r="6" />
            <text className="node-kicker" x="94" y="278">WORKER / RANK 1</text>
            <text className="node-name" x="94" y="307">macOS</text>
            <text className="node-meta" x="94" y="331">
              {mode === "straggler" ? "heartbeat delayed" : "heartbeat live"}
            </text>
          </g>

          <g className={`cluster-node ${workerClass.windows}`}>
            <rect x="388" y="248" width="220" height="100" rx="4" />
            <circle className="node-pulse" cx="583" cy="270" r="6" />
            <text className="node-kicker" x="410" y="278">WORKER / RANK 2</text>
            <text className="node-name" x="410" y="307">Windows</text>
            <text className="node-meta" x="410" y="331">
              {mode === "disconnected" ? "awaiting reconnect" : "heartbeat live"}
            </text>
          </g>

          <g className="shard-label">
            <rect x="281" y="318" width="118" height="42" rx="3" />
            <text x="340" y="344" textAnchor="middle">BINARY SHARDS</text>
          </g>
        </svg>
      </div>

      <div className="cluster-controls" aria-label="Cluster state controls">
        <button
          type="button"
          className={mode === "disconnected" ? "is-active" : ""}
          aria-pressed={mode === "disconnected"}
          onClick={() => setMode("disconnected")}
        >
          <WifiOff aria-hidden="true" size={17} />
          Disconnect worker
        </button>
        <button
          type="button"
          className={mode === "straggler" ? "is-active" : ""}
          aria-pressed={mode === "straggler"}
          onClick={() => setMode("straggler")}
        >
          <Gauge aria-hidden="true" size={17} />
          Add straggler
        </button>
        <button type="button" onClick={() => setMode("healthy")}>
          <RotateCcw aria-hidden="true" size={17} />
          Recover
        </button>
      </div>

      <div className="cluster-readout" aria-live="polite">
        <span><b>Workers</b>{state.workers}</span>
        <span><b>Heartbeat</b>{state.heartbeat}</span>
        <span><b>Allocation</b>{state.allocation}</span>
      </div>

      {labMode && (
        <div className="event-log lab-only">
          {state.logs.map((line, index) => (
            <span key={line}><i>{String(index + 1).padStart(2, "0")}</i>{line}</span>
          ))}
        </div>
      )}

      <p className="truth-note">Architecture interaction based on the project workflow, not live infrastructure.</p>
    </div>
  );
}

function Metric({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
      {note && <small>{note}</small>}
    </div>
  );
}

function BenchmarkBar({
  label,
  value,
  width,
  accent = false,
}: {
  label: string;
  value: string;
  width: string;
  accent?: boolean;
}) {
  return (
    <div className={`benchmark-row ${accent ? "benchmark-accent" : ""}`}>
      <span>{label}</span>
      <div className="benchmark-track">
        <i style={{ "--bar-width": width } as CSSProperties} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("quick");
  const labMode = viewMode === "lab";
  useReveal();

  return (
    <div className={`site-shell ${labMode ? "lab-view" : "quick-view"}`}>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Nikhil Arora home">
          <span>NA</span>
          <b>Nikhil Arora</b>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#systems">Systems</a>
          <a href="#failures">Failures</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <div className="view-switch" aria-label="Portfolio detail level">
            <button
              type="button"
              className={viewMode === "quick" ? "is-selected" : ""}
              aria-pressed={viewMode === "quick"}
              onClick={() => setViewMode("quick")}
            >
              Quick scan
            </button>
            <button
              type="button"
              className={viewMode === "lab" ? "is-selected" : ""}
              aria-pressed={viewMode === "lab"}
              onClick={() => setViewMode("lab")}
            >
              Lab mode
            </button>
          </div>
          <a className="icon-link" href="/Nikhil-Arora-Resume.pdf" target="_blank" aria-label="Open resume">
            <Download aria-hidden="true" size={19} />
          </a>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">SOFTWARE ENGINEER / ML SYSTEMS / APPLIED AI</p>
            <h1>Nikhil Arora</h1>
            <p className="hero-statement">
              I build software and machine learning systems, then test what happens when their
              assumptions break.
            </p>
            <p className="hero-context">
              Recent NYU M.S. Computer Engineering graduate working across distributed training,
              GPU performance, retrieval, data quality, and backend systems.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#systems">
                Explore systems
                <ArrowDown aria-hidden="true" size={18} />
              </a>
              <a className="secondary-button" href="/Nikhil-Arora-Resume.pdf" target="_blank">
                Resume
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>

          <div className="hero-lab" data-reveal>
            <ClusterLab labMode={labMode} />
          </div>
        </section>

        <section className="identity-strip" aria-label="Profile summary">
          <div><span>Education</span><strong>NYU / M.S. Computer Engineering</strong></div>
          <div><span>Base</span><strong>New York / Open to relocation</strong></div>
          <div><span>Focus</span><strong>Reliable software and ML systems</strong></div>
        </section>

        <section id="systems" className="systems-intro section-pad" data-reveal>
          <p className="eyebrow dark">SELECTED SYSTEMS / 01-04</p>
          <div>
            <h2>Proof over adjectives.</h2>
            <p>
              Four projects, each shown through the constraint, the system, the evidence, and the
              failure that changed the work.
            </p>
          </div>
        </section>

        <article className="project-case project-distributed" data-reveal>
          <header className="project-header">
            <div className="project-index">01</div>
            <div>
              <p className="project-domain">DISTRIBUTED SYSTEMS</p>
              <h2>Heterogeneous Distributed ML Training</h2>
            </div>
            <ExternalLink href={links.distributed}>GitHub</ExternalLink>
          </header>

          <div className="project-body">
            <div className="project-narrative">
              <p className="project-lede">
                A leader-worker training workflow that coordinates macOS and Windows machines
                through registration, heartbeats, rank assignment, binary shard transfer, and
                synchronized PyTorch execution.
              </p>
              <div className="metric-row">
                <Metric value="2" label="operating systems" />
                <Metric value="9" label="unit tests" />
                <Metric value="3.11 / 3.12" label="Python CI" />
              </div>
              <div className="project-stack">Python / PyTorch Distributed / Gloo / Tailscale</div>
              {labMode && (
                <aside className="evidence-note lab-only">
                  <ShieldCheck aria-hidden="true" size={20} />
                  <p>
                    <strong>Public scope:</strong> the distributed path uses a compact CNN so the
                    workflow can run on laptops. Larger ResNet and ViT workloads are documented in
                    the linked single-device benchmark.
                  </p>
                </aside>
              )}
            </div>

            <div className="system-spec" aria-label="Distributed training system responsibilities">
              <div><Activity aria-hidden="true" /><span>Control plane</span><b>registration / heartbeats / reconnect</b></div>
              <div><Cpu aria-hidden="true" /><span>Execution</span><b>rank assignment / Gloo synchronization</b></div>
              <div><Database aria-hidden="true" /><span>Data path</span><b>weighted slices / binary shard transfer</b></div>
            </div>
          </div>
        </article>

        <article className="project-case project-bert" data-reveal>
          <header className="project-header">
            <div className="project-index">02</div>
            <div>
              <p className="project-domain">GPU PERFORMANCE</p>
              <h2>GPU-Efficient BERT Fine-Tuning</h2>
            </div>
            <ExternalLink href={links.bert}>GitHub</ExternalLink>
          </header>

          <div className="project-body">
            <div className="benchmark-panel" aria-label="BERT benchmark comparison">
              <div className="panel-heading">
                <span>THROUGHPUT / SAMPLES PER SECOND</span>
                <b>NVIDIA T4 / SQuAD v2</b>
              </div>
              <BenchmarkBar label="FP16 AdamW baseline" value="43.9" width="85%" />
              <BenchmarkBar label="Dynamic padding" value="51.6" width="100%" accent />
              <div className="benchmark-foot">
                <span><b>76.6 to 77.2</b> dev F1</span>
                <span><b>up to 30%</b> lower peak allocated VRAM</span>
              </div>
            </div>

            <div className="project-narrative">
              <p className="project-lede">
                A controlled benchmark across SDPA, <code>torch.compile</code>, dynamic padding,
                LoRA, BitFit, layer freezing, 8-bit AdamW, and gradient checkpointing.
              </p>
              <div className="project-stack">PyTorch / CUDA / Hugging Face / torch.compile</div>
              <aside className="failure-callout">
                <span>WHAT BROKE</span>
                <p>
                  A bucketing ablation looked faster but was invalid. The root cause was
                  answer-span label misalignment, not the model or optimizer.
                </p>
              </aside>
            </div>
          </div>
        </article>

        <article className="project-case project-netrag" data-reveal>
          <header className="project-header">
            <div className="project-index">03</div>
            <div>
              <p className="project-domain">OPEN-SET ML / RETRIEVAL</p>
              <h2>Net-RAG Intrusion Detection</h2>
            </div>
            <ExternalLink href={links.netRag}>GitHub</ExternalLink>
          </header>

          <div className="project-body">
            <div className="project-narrative">
              <p className="project-lede">
                An intrusion-detection workflow that holds an attack family out of training,
                retrieves comparable flows, and constrains local LLM explanations with model and
                policy evidence.
              </p>
              <div className="metric-row">
                <Metric value="10,000" label="indexed known flows" />
                <Metric value="1.6% to 68.8%" label="held-out-family recall" />
                <Metric value="1" label="family excluded from training" note="Shellcode" />
              </div>
              <div className="project-stack">Python / scikit-learn / Chroma / Ollama / Streamlit</div>
            </div>

            <div className="pipeline" aria-label="Net-RAG evidence pipeline">
              <div><span>01</span><b>Flow</b><small>UNSW-NB15 features</small></div>
              <i aria-hidden="true" />
              <div><span>02</span><b>Classifiers</b><small>binary + calibrated family model</small></div>
              <i aria-hidden="true" />
              <div><span>03</span><b>Retrieval</b><small>neighbor evidence from Chroma</small></div>
              <i aria-hidden="true" />
              <div><span>04</span><b>Guardrails</b><small>threshold + deterministic policy</small></div>
              <i aria-hidden="true" />
              <div><span>05</span><b>Review</b><small>local explanation in Streamlit</small></div>
            </div>
          </div>
        </article>

        <article className="project-case project-world" data-reveal>
          <header className="project-header">
            <div className="project-index">04</div>
            <div>
              <p className="project-domain">VISION / SPATIAL RETRIEVAL</p>
              <h2>Egocentric World Memory</h2>
            </div>
            <ExternalLink href={links.worldMemory}>GitHub</ExternalLink>
          </header>

          <div className="project-body world-layout">
            <div className="world-visual">
              <figure>
                <div className="image-label">REAL VIEWS / DOORWAY QUERY</div>
                <img src="/assets/doorway-real.png" alt="Top retrieved real room views for the doorway query" />
              </figure>
              <figure>
                <div className="image-label">NERF VIEWS / SAME QUERY</div>
                <img src="/assets/doorway-nerf.png" alt="Top retrieved NeRF room views for the doorway query" />
              </figure>
              {labMode && (
                <figure className="pipeline-figure lab-only">
                  <img
                    src="/assets/world-memory-pipeline.png"
                    alt="Pipeline from Replica Room0 views through NeRF and real memory banks to CLIP retrieval"
                  />
                </figure>
              )}
            </div>

            <div className="project-narrative">
              <p className="project-lede">
                A pose-aligned semantic memory over 100 Replica Room0 views, associating
                512-dimensional OpenCLIP embeddings from real and NeRF-rendered frames with camera
                positions.
              </p>
              <div className="score-table" aria-label="Doorway retrieval concentration scores">
                <div><span>Real views</span><strong>0.106</strong></div>
                <div><span>NeRF views</span><strong>0.176</strong></div>
                <div><span>Random baseline</span><strong>0.357</strong></div>
              </div>
              <p className="metric-explainer">Mean pairwise camera distance at K=5. Lower means tighter spatial retrieval.</p>
              <div className="project-stack">OpenCLIP / Nerfstudio / CUDA / experiment design</div>
            </div>
          </div>
        </article>

        <section id="failures" className="failure-log section-pad" data-reveal>
          <div className="section-side-title">
            <p className="eyebrow">FAILURE LOG / THE USEFUL PART</p>
            <h2>What changed after the demo worked.</h2>
          </div>
          <div className="failure-list">
            <details>
              <summary><span>01</span><b>A worker disappears</b><em>Distributed training</em></summary>
              <p>Added heartbeats, availability snapshots, re-registration, and explicit rank assignment around the training loop.</p>
            </details>
            <details>
              <summary><span>02</span><b>The faster run is wrong</b><em>BERT benchmark</em></summary>
              <p>Traced the anomaly to answer-span labels drifting during bucketing and rejected the result instead of reporting a false speedup.</p>
            </details>
            <details>
              <summary><span>03</span><b>The attack was never in training</b><em>Net-RAG</em></summary>
              <p>Defined an open-set evaluation, held Shellcode out, swept the decision threshold, and added a shuffled-label leakage check.</p>
            </details>
            <details>
              <summary><span>04</span><b>The render changes the meaning</b><em>World memory</em></summary>
              <p>Compared real, NeRF, and random retrieval spatially, exposing semantic drift that a qualitative montage alone would hide.</p>
            </details>
          </div>
        </section>

        <section className="more-systems section-pad" data-reveal>
          <header>
            <p className="eyebrow dark">SYSTEMS BREADTH</p>
            <h2>Below the model layer.</h2>
          </header>
          <div className="more-system-list">
            <a href={links.riscV} target="_blank" rel="noreferrer">
              <span>RV32I Processor Simulator</span>
              <p>Single-stage and five-stage execution, forwarding, hazard handling, cycle traces, and CPI/IPC reporting.</p>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href={links.embedded} target="_blank" rel="noreferrer">
              <span>Embedded Sentry</span>
              <p>Gesture-based access control on STM32F429I with gyroscope input, touchscreen UI, and multithreaded sensing.</p>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="experience" className="experience section-pad" data-reveal>
          <div className="section-side-title">
            <p className="eyebrow">EXPERIENCE</p>
            <h2>Systems, data, and technical judgment.</h2>
          </div>
          <div className="timeline">
            <article>
              <time>Jul 2025 - Sep 2025</time>
              <div><h3>Digital Tech Startup Analyst</h3><p>NYU Stern / Endless Frontier Labs</p></div>
              <p>Evaluated 50+ AI and software startups, with deeper diligence across architecture, data infrastructure, scalability, demonstrated capability, and execution risk.</p>
            </article>
            <article>
              <time>Jan 2024 - Apr 2024</time>
              <div><h3>Software Developer Intern, Data Systems</h3><p>TD Tech Solutions</p></div>
              <p>Built a Python and SQL financial-record workflow with reusable Flask modules, validation checks, standardized outputs, and documented recovery procedures.</p>
            </article>
            <article>
              <time>2023</time>
              <div><h3>IoT &amp; Data Engineering Intern</h3><p>Tech Elecon</p></div>
              <p>Aligned equipment telemetry and built diagnostic views for missing readings, throughput regressions, transmission failures, and abnormal operating patterns.</p>
            </article>
          </div>
        </section>

        <section className="working-style section-pad" data-reveal>
          <div>
            <p className="eyebrow dark">HOW I WORK</p>
            <h2>Measure first. Keep the failed run.</h2>
          </div>
          <div className="working-copy">
            <p>
              I like projects with explicit baselines, observable behavior, and enough evidence to
              explain both the gain and the tradeoff. Negative results stay when they teach
              something.
            </p>
            <p>
              I use AI development tools for exploration and implementation support, then verify
              changes by reading the code, running tests, inspecting outputs, and checking the
              assumptions the tool cannot see.
            </p>
          </div>
          <div className="skill-table" aria-label="Technical skills">
            <div><span>Languages</span><b>Python / SQL / Java / C/C++ / Bash</b></div>
            <div><span>Systems</span><b>PyTorch Distributed / CUDA / Spark / Docker / Linux</b></div>
            <div><span>Backend &amp; data</span><b>FastAPI / Flask / PostgreSQL / REST APIs / pandas</b></div>
            <div><span>ML &amp; retrieval</span><b>PyTorch / Hugging Face / scikit-learn / RAG / Chroma</b></div>
          </div>
        </section>

        <section id="contact" className="contact section-pad" data-reveal>
          <div>
            <p className="eyebrow">NEW YORK / OPEN TO RELOCATION</p>
            <h2>Build the system.<br />Interrogate the result.</h2>
          </div>
          <div className="contact-copy">
            <p>
              I'm looking for early-career software engineering, ML systems, applied AI, and data
              infrastructure roles where reliability and measurement matter.
            </p>
            <div className="contact-links">
              <a href={links.email}><Mail aria-hidden="true" />Email</a>
              <a href={links.github} target="_blank" rel="noreferrer"><Code aria-hidden="true" />GitHub</a>
              <a href={links.linkedin} target="_blank" rel="noreferrer"><Contact aria-hidden="true" />LinkedIn</a>
              <a href="/Nikhil-Arora-Resume.pdf" target="_blank"><Download aria-hidden="true" />Resume</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>Nikhil Arora / 2026</span>
        <span>Designed around evidence, not effects.</span>
        <a href="#top">Back to top <ArrowUp aria-hidden="true" /></a>
      </footer>
    </div>
  );
}

export default App;
