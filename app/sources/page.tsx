"use client";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { courseSources } from "../../lib/course";
export default function SourcesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>("Unit 1");
  const filters = ["All", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Research"];
  useEffect(() => {
    const unit = new URLSearchParams(window.location.search).get("unit");
    const selected =
      unit === "AI Foundations"
        ? "Unit 1"
        : unit === "AI Lingo"
          ? "Unit 2"
          : unit === "Using AI"
            ? "Unit 3"
            : unit === "Responsible AI"
              ? "Unit 4"
              : "All";
    setFilter(selected);
    setOpen(selected === "All" ? "Unit 1" : selected);
  }, []);
  const visible = useMemo(
    () =>
      courseSources.filter((source) => {
        const text =
          `${source.title} ${source.organization} ${source.description} ${source.units.join(" ")}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (filter === "All" ||
            filter === "Research" ||
            source.units.includes(filter))
        );
      }),
    [query, filter],
  );
  const units = ["Unit 1", "Unit 2", "Unit 3", "Unit 4"];
  return (
    <>
      <h1 className="page-title">References &amp; Copyright</h1>
      <p className="page-sub">
        Explore the research, educational resources, and trusted organizations
        behind AI Lingo&apos;s lessons.
      </p>
      <label className="source-search">
        <Search size={19} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sources, organizations, or lessons"
          aria-label="Search sources"
        />
      </label>
      <div className="source-filters">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={filter === item ? "selected" : ""}
          >
            {item}
          </button>
        ))}
      </div>
      {units.map((unit) => {
        const unitSources = visible.filter((source) =>
          source.units.includes(unit),
        );
        if (!unitSources.length) return null;
        return (
          <section className="source-unit" key={unit}>
            <button
              className="source-unit-head"
              onClick={() => setOpen(open === unit ? null : unit)}
              aria-expanded={open === unit}
            >
              <span>{unit.toUpperCase()} SOURCES</span>
              <b>{open === unit ? "−" : "+"}</b>
            </button>
            {open === unit && (
              <div className="source-grid">
                {unitSources.map((source) => (
                  <article className="source-card" key={source.id}>
                    <div className="step-label">
                      {source.organization} · {source.year}
                    </div>
                    <h2>{source.title}</h2>
                    <p>{source.description}</p>
                    <p className="supported">
                      <b>Supports:</b>{" "}
                      {source.lessons
                        .map((id) => id.replaceAll("-", " "))
                        .join(", ")}
                    </p>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      Visit source <ExternalLink size={14} />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        );
      })}
      {filter === "Research" && (
        <section className="source-unit">
          <div className="source-unit-head">
            <span>RESEARCH SOURCES</span>
          </div>
          <div className="source-grid">
            {visible.map((source) => (
              <article className="source-card" key={source.id}>
                <div className="step-label">
                  {source.organization} · {source.year}
                </div>
                <h2>{source.title}</h2>
                <p>{source.description}</p>
                <a href={source.url} target="_blank" rel="noreferrer">
                  Visit source <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
      {!visible.length && (
        <div className="card" style={{ marginTop: 22 }}>
          <h2>No sources found</h2>
          <p className="page-sub">Try another search or filter.</p>
        </div>
      )}
      <section className="card" style={{ marginTop: 28 }}>
        <h2>Competition documentation</h2>
        <p>The following documents must be completed and supplied by the student team before submission. They are not currently available.</p>
        <ul>
          <li>Student Copyright Checklist — official completed PDF required (one page maximum).</li>
          <li>Resources and AI Reflection — official completed PDF required (four pages maximum).</li>
          <li>Student Work Log — completed state documentation required; verify the applicable format with your advisor.</li>
        </ul>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h2>Generative AI and design</h2>
        <p>ChatGPT and Codex assisted with development, including code, design ideas, and educational content. The student team should review, verify, and describe its own contributions and decisions in the required reflection. This statement does not substitute for that completed form.</p>
        <p>AI Lingo uses general learning mechanics such as sequential lessons, experience points, and streaks. It is not affiliated with or endorsed by Duolingo.</p>
      </section>
      <section className="card" style={{ marginTop: 28 }}>
        <h2>Additional research references</h2>
        <p>The Research Center also refers to these resources:</p>
        <ul>
          <li><a className="source" href="https://www.nist.gov/itl/ai-risk-management-framework">NIST: AI Risk Management Framework</a></li>
          <li><a className="source" href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics">UNESCO: Recommendation on the Ethics of Artificial Intelligence</a></li>
          <li><a className="source" href="https://aiindex.stanford.edu/report/">Stanford HAI: AI Index Report</a></li>
        </ul>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h2>Website technology and credits</h2>
        <p>AI Lingo is built with Next.js and React, using TypeScript and CSS. It also uses Framer Motion and Lucide icons. These projects are distributed under open-source licenses; their authors retain copyright.</p>
        <ul>
          <li><a className="source" href="https://github.com/vercel/next.js/blob/canary/license.md">Next.js license</a> and <a className="source" href="https://github.com/facebook/react/blob/main/LICENSE">React license</a></li>
          <li><a className="source" href="https://github.com/lucide-icons/lucide/blob/main/LICENSE">Lucide license</a> and <a className="source" href="https://github.com/motiondivision/motion/blob/main/LICENSE.md">Motion license</a></li>
          <li><a className="source" href="https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt">TypeScript license</a></li>
        </ul>
        <p>Research sources are linked for readers to consult. Source listings do not by themselves establish permission to reproduce copyrighted material.</p>
      </section>
    </>
  );
}
