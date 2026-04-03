import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

const MENU = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/eligible-projects', label: 'Eligible Projects' },
  { to: '/for-companies', label: 'For Companies' },
  { to: '/for-it-providers', label: 'For IT Providers' },
  { to: '/become-certified', label: 'Become Certified' },
  { to: '/about', label: 'About' },
  { to: '/standards', label: 'Standards' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const PRIMARY_MENU_PATHS = new Set(['/','/about','/contact']);
const PRIMARY_MENU = MENU.filter((m) => PRIMARY_MENU_PATHS.has(m.to));
const MORE_MENU = MENU.filter((m) => !PRIMARY_MENU_PATHS.has(m.to));

function Icon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (name) {
    case 'shield':
      return (
        <svg {...common}>
          <path
            d="M12 2.5l7 3.5v7.1c0 4.3-2.8 8.2-7 9.4-4.2-1.2-7-5.1-7-9.4V6l7-3.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9.2 12.1l1.9 1.9 3.9-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...common}>
          <path
            d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.7 1.7A3.3 3.3 0 1 1 18.5 18H7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'key':
      return (
        <svg {...common}>
          <path d="M7.5 14a4.5 4.5 0 1 1 3.8-7.1L22 7v4l-3 0v3h-4v-3h-2.7A4.5 4.5 0 0 1 7.5 14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M6.8 10.2h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'doc':
      return (
        <svg {...common}>
          <path d="M7 3h7l3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M14 3v4a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M16 3.1a4 4 0 0 1 0 7.8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 21s-7-4.4-7-10A7 7 0 0 1 12 4a7 7 0 0 1 7 7c0 5.6-7 10-7 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
  }
}

function ButtonLink({ variant, to, children, onClick }) {
  const cls = `btn ${variant === 'secondary' ? 'btnSecondary' : 'btnPrimary'}`;
  return (
    <NavLink to={to} className={cls} onClick={onClick}>
      {children}
    </NavLink>
  );
}

function Button({ variant, children, onClick, type = 'button' }) {
  const cls = `btn ${variant === 'secondary' ? 'btnSecondary' : 'btnPrimary'}`;
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

function Container({ children }) {
  return <div className="container">{children}</div>;
}

function Accordion({ items, defaultOpenId }) {
  const [openId, setOpenId] = useState(defaultOpenId ?? null);
  return (
    <div className="accordion">
      {items.map((it) => {
        const isOpen = it.id === openId;
        return (
          <div key={it.id} className="accItem">
            <button
              className="accButton"
              onClick={() => setOpenId((prev) => (prev === it.id ? null : it.id))}
              aria-expanded={isOpen}
            >
              <span>{it.q}</span>
              <span className="chev" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen ? <div className="accPanel">{it.a}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

function HeaderInner() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreWrapRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreOpen) return;

    const onDown = (e) => {
      const el = moreWrapRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      setMoreOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [moreOpen]);

  const activeClass = ({ isActive }) => (isActive ? 'navLink navLinkActive' : 'navLink');

  return (
    <div className="siteHeader">
      <Container>
        <div className="headerInner">
          <NavLink to="/" className="brand" onClick={() => setMobileOpen(false)}>
            <img
              className="brandLogoImg"
              src={`${process.env.PUBLIC_URL}/logo_final.png`}
              alt="EU Subsidies logo"
            />
            <div className="brandText">
              <strong>EU Subsidies</strong>
              <span>Certified IT Partnership</span>
            </div>
          </NavLink>

          <nav className="navDesktop" aria-label="Primary">
            {PRIMARY_MENU.map((m) => (
              <NavLink key={m.to} to={m.to} className={activeClass}>
                {m.label}
              </NavLink>
            ))}

            <div className="moreWrap" ref={moreWrapRef}>
              <button
                className="moreBtn"
                onClick={() => setMoreOpen((v) => !v)}
                aria-label="More pages"
                aria-expanded={moreOpen}
              >
                <span className="moreHamburger" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="moreText">More</span>
              </button>

              {moreOpen ? (
                <div className="moreDropdownPanel" role="menu" id="more-menu">
                  {MORE_MENU.map((m) => (
                    <NavLink
                      key={m.to}
                      to={m.to}
                      className={activeClass}
                      onClick={() => setMoreOpen(false)}
                      role="menuitem"
                    >
                      {m.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="headerCtas">
            <ButtonLink variant="primary" to="/become-certified" onClick={() => setMobileOpen(false)}>
              Become Certified
            </ButtonLink>
            <button className="mobileMenuBtn" onClick={() => setMobileOpen((v) => !v)} aria-label="Open more menu">
              <span style={{ fontWeight: 800 }}>{mobileOpen ? '×' : '≡'}</span>
              <span style={{ color: 'var(--color-muted)', fontWeight: 700 }}>More</span>
            </button>
          </div>
        </div>

        <div className={`mobilePanel ${mobileOpen ? 'mobilePanelOpen' : ''}`}>
          <div className="mobilePanelLinks">
            {PRIMARY_MENU.map((m) => (
              <NavLink key={m.to} to={m.to} className={activeClass} onClick={() => setMobileOpen(false)}>
                {m.label}
              </NavLink>
            ))}
            <div style={{ height: 1, background: 'rgba(226, 232, 240, 0.95)', margin: '12px 0' }} />
            {MORE_MENU.map((m) => (
              <NavLink key={m.to} to={m.to} className={activeClass} onClick={() => setMobileOpen(false)}>
                {m.label}
              </NavLink>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

function SiteHeader() {
  return <HeaderInner />;
}

function SiteFooter() {
  return (
    <footer className="siteFooter">
      <Container>
        <div className="footerGrid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="brandMark" style={{ width: 34, height: 34, borderRadius: 12 }}>
                EU
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>EU Subsidies</div>
                <div className="smallText">Structured funding support for eligible IT projects.</div>
              </div>
            </div>
            <div className="footerLinks">
              <div className="smallText">
                This demo website matches the professional, calm and structured design rules from your PDF guideline.
              </div>
            </div>
          </div>
          <div>
            <div className="titleH4" style={{ marginBottom: 10 }}>
              Quick Links
            </div>
            <div className="footerLinks">
              {MENU.filter((m) => ['/', '/how-it-works', '/standards', '/faq', '/contact'].includes(m.to)).map((m) => (
                <NavLink key={m.to} to={m.to} className="footerLink">
                  {m.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function PageSection({ title, subtitle, children }) {
  return (
    <section className="section">
      <Container>
        <div className="sectionHeader">
          <div>
            {title ? <div className="titleH2">{title}</div> : null}
            {subtitle ? <p className="bodyText" style={{ marginTop: 12 }}>{subtitle}</p> : null}
          </div>
        </div>
        {children}
      </Container>
    </section>
  );
}

function Home() {
  const [introVideoHovered, setIntroVideoHovered] = useState(false);
  const [introAlwaysShowControls, setIntroAlwaysShowControls] = useState(() =>
    typeof window !== 'undefined'
      ? !window.matchMedia('(hover: hover) and (pointer: fine)').matches
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setIntroAlwaysShowControls(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const homeImageOrder = useMemo(() => {
    // Randomize gallery order once per page load (avoid reshuffling on re-renders).
    const arr = [1, 2, 3, 4, 5, 6];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const steps = useMemo(
    () => [
      { n: 1, t: 'Choose eligible IT project', d: 'Plan an eligible digital transformation project that fits programme criteria.' },
      { n: 2, t: 'Work with a certified provider', d: 'Certified IT providers submit subsidy requests on behalf of clients.' },
      { n: 3, t: 'Review and documentation check', d: 'Standards and oversight teams verify compliance and evidence quality.' },
    ],
    []
  );

  const trust = useMemo(
    () => [
      { icon: 'shield', t: 'Provider screening', d: 'Certification requires quality controls and professional standards.' },
      { icon: 'doc', t: 'Documentation review', d: 'Clear review steps ensure the application is complete and traceable.' },
      { icon: 'users', t: 'Reliable process', d: 'Structured flow helps both companies and IT providers understand next steps.' },
    ],
    []
  );

  const projects = useMemo(
    () => [
      { icon: 'bolt', t: 'Cybersecurity upgrades', d: 'Security hardening, compliance readiness, and risk reduction for organisations.' },
      { icon: 'cloud', t: 'Cloud migration & modernization', d: 'Modern architecture to improve efficiency, resilience, and data handling.' },
      { icon: 'key', t: 'Identity & access management', d: 'Secure authentication, authorization workflows, and access governance.' },
      { icon: 'doc', t: 'ERP and enterprise digitization', d: 'Replace manual processes with structured, audit-friendly systems.' },
      { icon: 'users', t: 'Data platforms & analytics', d: 'Governed data pipelines for decision-making and reporting.' },
      { icon: 'shield', t: 'Quality assurance controls', d: 'Implementation and verification methods that support approval and delivery reporting.' },
    ],
    []
  );

  const faqPreview = useMemo(
    () => [
      {
        id: 'f1',
        q: 'Who submits the subsidy request?',
        a: 'Certified IT providers submit subsidy applications on behalf of their clients, including required evidence and compliance documentation.',
      },
      {
        id: 'f2',
        q: 'How do we know a project is eligible?',
        a: 'Eligibility depends on the planned scope and programme criteria. Start by reviewing “Eligible Projects” and then confirm fit with a certified provider.',
      },
      {
        id: 'f3',
        q: 'Is certification required for IT providers?',
        a: 'Yes. IT providers must qualify for certification so they can responsibly handle applications and meet the required standards.',
      },
    ],
    []
  );

  return (
    <>
      <section className="introVideoSection">
        <Container>
          <div
            className="introVideoWrap"
            onMouseEnter={() => setIntroVideoHovered(true)}
            onMouseLeave={() => setIntroVideoHovered(false)}
          >
            <iframe
              className="introVideoEl"
              src="https://www.youtube.com/embed/eqaEcBSGZQM"
              title="Introductory video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Container>
      </section>

      <section className="section hero">
        <Container>
          <div className="heroWrap">
            <div className="grid2">
              <div>
                <h1 className="titleH1">IT project funding support through EU-style standards</h1>
                <p className="bodyText heroLead">
                  If you are planning an eligible IT project, your organisation may qualify for EU subsidies. Applications are submitted by certified IT providers on behalf of their clients.
                </p>
                <div className="heroActions">
                  <ButtonLink variant="primary" to="/become-certified">Become a Certified IT Partner</ButtonLink>
                  <ButtonLink variant="secondary" to="/how-it-works">Learn How It Works</ButtonLink>
                </div>
                <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {trust.map((c) => (
                    <div key={c.t} className="card" style={{ padding: 14, borderRadius: 14, minWidth: 220 }}>
                      <div className="iconBox" style={{ width: 40, height: 40, borderRadius: 14, marginBottom: 10 }}>
                        <Icon name={c.icon} />
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>{c.t}</div>
                      <div className="smallText" style={{ marginTop: 6 }}>{c.d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="card cardSoft">
                  <div className="titleH4" style={{ color: 'var(--color-text)' }}>Your next step</div>
                  <p className="bodyText" style={{ marginTop: 12, color: 'var(--color-muted)' }}>
                    Choose the audience you are: a company looking for eligible project support, or an IT provider seeking certification.
                  </p>
                  <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                    <ButtonLink variant="primary" to="/for-companies">For Companies</ButtonLink>
                    <ButtonLink variant="secondary" to="/for-it-providers">For IT Providers</ButtonLink>
                    <ButtonLink variant="secondary" to="/contact">Contact Us</ButtonLink>
                  </div>
                  <div className="smallText" style={{ marginTop: 12 }}>
                    Calm, structured, and credible presentation is part of the programme experience.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="homeImagesSection">
        <Container>
          <div className="homeImagesGrid" aria-label="People highlights">
            {homeImageOrder.map((n) => (
              <div key={n} className="homeImageTile">
                <img
                  className="homeImageEl"
                  src={`${process.env.PUBLIC_URL}/images/${n}.jfif`}
                  alt={`Smiling hipster style person ${n}`}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Container>
          <div className="sectionHeader">
            <div>
              <div className="titleH2">How it works</div>
              <p className="bodyText" style={{ marginTop: 12 }}>
                A reliable process built around clear eligibility, certified partners, and documentation review.
              </p>
            </div>
          </div>
          <div className="stepRow">
            {steps.map((s) => (
              <div key={s.n} className="card stepCard">
                <div className="stepNum">{s.n}</div>
                <div className="titleH4" style={{ color: 'var(--color-text)' }}>{s.t}</div>
                <p className="smallText">{s.d}</p>
              </div>
            ))}
            <div className="card" style={{ gridColumn: 'span 3' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div className="titleH4" style={{ color: 'var(--color-text)' }}>Need the full process?</div>
                  <div className="smallText" style={{ marginTop: 8 }}>Go to “How It Works” for the complete six-step model.</div>
                </div>
                <Button variant="primary" onClick={() => (window.location.href = '/how-it-works')}>View Full Process</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <PageSection
        title="Eligible IT project types"
        subtitle="Explore example categories. Eligibility depends on programme fit and documented scope."
      >
        <div className="grid3">
          {projects.map((p) => (
            <div key={p.t} className="card">
              <div className="iconBox" style={{ marginBottom: 14 }}>
                <Icon name={p.icon} />
              </div>
              <div className="titleH4" style={{ color: 'var(--color-text)' }}>{p.t}</div>
              <p className="smallText" style={{ marginTop: 10 }}>{p.d}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <ButtonLink variant="secondary" to="/eligible-projects">Explore All Projects</ButtonLink>
        </div>
      </PageSection>

      <PageSection
        title="Certification explained"
        subtitle="IT providers must meet standards to responsibly prepare and submit subsidy applications."
      >
        <div className="grid3">
          {[
            { n: 1, t: 'Requirements review', d: 'Assess eligibility, quality controls, and documentation readiness.' },
            { n: 2, t: 'Screening & evaluation', d: 'Standards team reviews evidence and compliance approach.' },
            { n: 3, t: 'Approved participation', d: 'Certified providers can submit applications on behalf of clients.' },
          ].map((s) => (
            <div key={s.n} className="card">
              <div className="stepNum" style={{ width: 38, height: 38, marginBottom: 12 }}>{s.n}</div>
              <div className="titleH4" style={{ color: 'var(--color-text)' }}>{s.t}</div>
              <p className="smallText" style={{ marginTop: 10 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 18 }}>
          <ButtonLink variant="primary" to="/become-certified">Become Certified</ButtonLink>
          <ButtonLink variant="secondary" to="/standards">See Programme Standards</ButtonLink>
        </div>
      </PageSection>

      <PageSection title="FAQ preview" subtitle="Clear answers to common questions—designed to reduce hesitation.">
        <Accordion items={faqPreview} defaultOpenId="f1" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <ButtonLink variant="secondary" to="/faq">Read Full FAQ</ButtonLink>
        </div>
      </PageSection>

      <PageSection title="Contact & next step" subtitle="If you want support, reach out. We will route you to the correct audience.">
        <div className="grid2">
          <div className="card">
            <div className="titleH4" style={{ color: 'var(--color-text)' }}>Companies</div>
            <p className="smallText" style={{ marginTop: 10 }}>
              Ask about eligible project options and how a certified provider submits an application on your behalf.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              <ButtonLink variant="primary" to="/contact">Contact Us</ButtonLink>
              <ButtonLink variant="secondary" to="/for-companies">For Companies</ButtonLink>
            </div>
          </div>
          <div className="card">
            <div className="titleH4" style={{ color: 'var(--color-text)' }}>IT Providers</div>
            <p className="smallText" style={{ marginTop: 10 }}>
              Learn certification requirements and the screening process, then submit for approval.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              <ButtonLink variant="primary" to="/become-certified">Become Certified</ButtonLink>
              <ButtonLink variant="secondary" to="/for-it-providers">For IT Providers</ButtonLink>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, icon: 'doc', t: 'Plan an eligible project scope', d: 'Define the IT objectives and expected outcomes that align with programme criteria.' },
    { n: 2, icon: 'users', t: 'Select a certified IT provider', d: 'Work with a provider that is approved to submit subsidy applications on behalf of clients.' },
    { n: 3, icon: 'doc', t: 'Prepare application evidence', d: 'The provider compiles structured documentation, implementation approach, and compliance evidence.' },
    { n: 4, icon: 'shield', t: 'Standards and documentation review', d: 'Quality control verifies completeness, traceability, and eligibility alignment.' },
    { n: 5, icon: 'bolt', t: 'Approval and funding submission', d: 'After review, the application follows the programme submission path for funding consideration.' },
    { n: 6, icon: 'check', t: 'Delivery reporting and verification', d: 'Approved projects follow reporting and verification steps to support audit readiness.' },
  ];

  return (
    <PageSection title="How it works" subtitle="A structured process that reduces confusion and increases trust.">
      <div className="stepRow">
        {steps.map((s) => (
          <div key={s.n} className="card stepCard">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="stepNum">{s.n}</div>
              <div className="iconBox" style={{ width: 42, height: 42, borderRadius: 14 }}>
                <Icon name={s.icon} />
              </div>
            </div>
            <div className="titleH4" style={{ color: 'var(--color-text)' }}>{s.t}</div>
            <p className="smallText" style={{ marginTop: 10 }}>{s.d}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 18, justifyContent: 'flex-end' }}>
        <ButtonLink variant="secondary" to="/eligible-projects">Check Eligible Projects</ButtonLink>
        <ButtonLink variant="primary" to="/contact">Contact for Guidance</ButtonLink>
      </div>
    </PageSection>
  );
}

function EligibleProjects() {
  const items = [
    { icon: 'bolt', t: 'Cybersecurity upgrades', d: 'Security improvements and controls that support compliant delivery and reduced risk.' },
    { icon: 'cloud', t: 'Cloud modernization', d: 'Modern architecture to improve resilience and operational efficiency.' },
    { icon: 'key', t: 'Identity & access management', d: 'Secure authentication and authorization governance.' },
    { icon: 'doc', t: 'ERP and enterprise digitization', d: 'Audit-friendly process automation and digital governance.' },
    { icon: 'users', t: 'Data platforms & analytics', d: 'Governed data pipelines for reporting and decision-making.' },
    { icon: 'shield', t: 'Quality assurance controls', d: 'Implementation and verification methods that support approval and reporting.' },
  ];

  return (
    <PageSection title="Eligible Projects" subtitle="Example categories of IT programmes that may qualify.">
      <div className="grid3">
        {items.map((p) => (
          <div key={p.t} className="card">
            <div className="iconBox" style={{ marginBottom: 14 }}>
              <Icon name={p.icon} />
            </div>
            <div className="titleH4" style={{ color: 'var(--color-text)' }}>{p.t}</div>
            <p className="smallText" style={{ marginTop: 10 }}>{p.d}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div className="titleH4" style={{ color: 'var(--color-text)' }}>How to confirm eligibility</div>
        <ul className="points" style={{ marginTop: 12 }}>
          <li className="point">
            <span className="check"><Icon name="check" /></span>
            <span>Start with programme-aligned scope and evidence of need.</span>
          </li>
          <li className="point">
            <span className="check"><Icon name="check" /></span>
            <span>Choose a certified provider for structured application submission.</span>
          </li>
          <li className="point">
            <span className="check"><Icon name="check" /></span>
            <span>Complete documentation review steps to verify compliance fit.</span>
          </li>
        </ul>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 16 }}>
          <ButtonLink variant="primary" to="/for-companies">I am a Company</ButtonLink>
          <ButtonLink variant="secondary" to="/for-it-providers">I am an IT Provider</ButtonLink>
        </div>
      </div>
    </PageSection>
  );
}

function ForCompanies() {
  return (
    <PageSection title="For Companies" subtitle="Understand what you get, and what the certified provider does for you.">
      <div className="grid2">
        <div className="card">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>Why companies benefit</div>
          <ul className="points" style={{ marginTop: 14 }}>
            {[
              'Subsidy requests are prepared through certified IT partners.',
              'A structured process supports clarity from eligibility to reporting.',
              'Standards and documentation review build confidence in the submission.',
            ].map((t) => (
              <li key={t} className="point">
                <span className="check"><Icon name="check" /></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card cardSoft">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>What you should do next</div>
          <p className="smallText" style={{ marginTop: 10 }}>
            Identify the IT project you plan to deliver and request guidance. We will route you to a certified provider path.
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <ButtonLink variant="primary" to="/eligible-projects">Explore Eligible Projects</ButtonLink>
            <ButtonLink variant="secondary" to="/contact">Contact a Specialist</ButtonLink>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

function ForITProviders() {
  return (
    <PageSection title="For IT Providers" subtitle="A clear role: meet certification standards and submit applications responsibly.">
      <div className="grid2">
        <div className="card">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>Your role in the programme</div>
          <div className="listGrid" style={{ marginTop: 14 }}>
            {[
              { icon: 'doc', t: 'Prepare evidence', d: 'Compile structured documentation aligned with programme criteria.' },
              { icon: 'shield', t: 'Meet standards', d: 'Follow quality controls, screening and oversight expectations.' },
              { icon: 'users', t: 'Support clients', d: 'Explain the process clearly and manage submission steps on behalf of clients.' },
            ].map((it) => (
              <div key={it.t} className="card" style={{ padding: 16, borderRadius: 14 }}>
                <div className="iconBox" style={{ width: 42, height: 42, borderRadius: 14, marginBottom: 12 }}>
                  <Icon name={it.icon} />
                </div>
                <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>{it.t}</div>
                <div className="smallText" style={{ marginTop: 8 }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card cardSoft">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>Certification path</div>
          <p className="smallText" style={{ marginTop: 10 }}>
            Providers must qualify and be approved to submit subsidy requests. Certification includes screening and documentation review.
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <ButtonLink variant="primary" to="/become-certified">Become Certified</ButtonLink>
            <ButtonLink variant="secondary" to="/standards">View Standards</ButtonLink>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

function BecomeCertified() {
  const requirements = [
    { icon: 'shield', t: 'Quality control process', d: 'Documented methods for implementation, verification, and responsible delivery.' },
    { icon: 'doc', t: 'Evidence handling', d: 'Traceable documentation, clear scope definition, and application readiness.' },
    { icon: 'key', t: 'Security & compliance mindset', d: 'Practical controls aligned with programme expectations and oversight.' },
    { icon: 'users', t: 'Client communication', d: 'Structured explanation of eligibility, process steps, and required inputs.' },
  ];

  return (
    <PageSection title="Become Certified" subtitle="A calm, step-by-step certification process designed for institutional trust.">
      <div className="grid3">
        {[
          { n: 1, t: 'Review requirements', d: 'Understand certification scope, screening criteria, and evidence expectations.' },
          { n: 2, t: 'Prepare compliance evidence', d: 'Collect documentation that supports your quality and delivery approach.' },
          { n: 3, t: 'Submit application', d: 'Submit the certification application through the programme path.' },
          { n: 4, t: 'Screening & evaluation', d: 'Review of evidence by standards and oversight teams.' },
          { n: 5, t: 'Approval & ongoing oversight', d: 'Maintain standards for continued participation and responsible submissions.' },
          { n: 6, t: 'Submit subsidy requests', d: 'Approved certified providers submit applications on behalf of clients.' },
        ].map((s) => (
          <div key={s.n} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="stepNum">{s.n}</div>
              <div className="iconBox" style={{ width: 42, height: 42, borderRadius: 14 }}>
                <Icon name={s.n % 2 === 0 ? 'doc' : 'shield'} />
              </div>
            </div>
            <div className="titleH4" style={{ color: 'var(--color-text)', marginTop: 12 }}>{s.t}</div>
            <p className="smallText" style={{ marginTop: 10 }}>{s.d}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="titleH4" style={{ color: 'var(--color-text)', marginBottom: 12 }}>Certification requirements</div>
        <div className="grid4">
          {requirements.map((r) => (
            <div key={r.t} className="card" style={{ padding: 18 }}>
              <div className="iconBox" style={{ marginBottom: 12 }}>
                <Icon name={r.icon} />
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>{r.t}</div>
              <div className="smallText" style={{ marginTop: 8 }}>{r.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 18, justifyContent: 'flex-end' }}>
        <ButtonLink variant="secondary" to="/standards">Read Programme Standards</ButtonLink>
        <ButtonLink variant="primary" to="/contact">Contact for Certification</ButtonLink>
      </div>
    </PageSection>
  );
}

function About() {
  return (
    <PageSection title="About EU Subsidies" subtitle="Mission, vision, and credibility—presented with clarity.">
      <div className="grid2">
        <div className="card">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>Mission</div>
          <p className="bodyText" style={{ marginTop: 12 }}>
            Provide structured funding guidance for eligible IT projects, ensuring subsidy requests are handled by certified IT partners.
          </p>
          <div style={{ marginTop: 18 }} className="card">
            <div className="titleH4" style={{ color: 'var(--color-text)' }}>Vision</div>
            <p className="smallText" style={{ marginTop: 10 }}>
              A trustworthy ecosystem where companies and providers understand eligibility, standards, and next steps—without confusion.
            </p>
          </div>
        </div>
        <div className="card cardSoft">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>Credibility through standards</div>
          <ul className="points" style={{ marginTop: 14 }}>
            {[
              'Provider screening and certification requirements.',
              'Documentation review and quality verification.',
              'Professional process and consistent communication.',
            ].map((t) => (
              <li key={t} className="point">
                <span className="check"><Icon name="check" /></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            <ButtonLink variant="secondary" to="/standards">Our Standards</ButtonLink>
            <ButtonLink variant="primary" to="/contact">Contact</ButtonLink>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

function Standards() {
  const cards = [
    { icon: 'shield', t: 'Strict provider screening', d: 'Verification of quality controls, evidence handling, and responsible delivery capability.' },
    { icon: 'doc', t: 'Documentation review', d: 'Complete, consistent, and traceable submission evidence required for review.' },
    { icon: 'key', t: 'Compliance oversight', d: 'Guidance and oversight to support eligibility alignment and audit readiness.' },
    { icon: 'users', t: 'Professional communication', d: 'Structured explanations and clear next steps for companies and providers.' },
    { icon: 'bolt', t: 'Quality assurance expectations', d: 'Implementation and verification methods that support responsible outcomes.' },
    { icon: 'check', t: 'Ongoing standards maintenance', d: 'Providers maintain quality expectations as part of continued participation.' },
  ];
  return (
    <PageSection title="Our Standards" subtitle="Trust-building elements through structured requirements and review.">
      <div className="grid3">
        {cards.map((c) => (
          <div key={c.t} className="card">
            <div className="iconBox" style={{ marginBottom: 14 }}>
              <Icon name={c.icon} />
            </div>
            <div className="titleH4" style={{ color: 'var(--color-text)' }}>{c.t}</div>
            <p className="smallText" style={{ marginTop: 10 }}>{c.d}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 18, justifyContent: 'flex-end' }}>
        <ButtonLink variant="secondary" to="/faq">Read FAQ</ButtonLink>
        <ButtonLink variant="primary" to="/become-certified">Become Certified</ButtonLink>
      </div>
    </PageSection>
  );
}

function FAQPage() {
  const items = [
    {
      id: 'q1',
      q: 'What is the main conversion message of the programme?',
      a: 'Subsidy requests are submitted by certified IT providers on behalf of their clients. This reduces confusion and ensures structured, standards-driven applications.',
    },
    {
      id: 'q2',
      q: 'Do we need to already have a fully defined project?',
      a: 'You should identify your intended scope and objectives. The certified provider helps structure the evidence and application approach so it can pass documentation review.',
    },
    {
      id: 'q3',
      q: 'Who should apply: the company or the IT provider?',
      a: 'Companies typically work with certified IT providers. Providers submit the subsidy application on behalf of their clients.',
    },
    {
      id: 'q4',
      q: 'How does the standards and oversight process work?',
      a: 'A standards team reviews evidence and documentation for completeness, eligibility alignment, and quality controls. Approved submissions follow the programme submission path.',
    },
    {
      id: 'q5',
      q: 'What does certification require for IT providers?',
      a: 'Certification expects a quality control process, responsible evidence handling, and the ability to communicate and manage applications on behalf of clients.',
    },
    {
      id: 'q6',
      q: 'How can we confirm a project is eligible?',
      a: 'Use “Eligible Projects” to start. Then contact a specialist or choose a certified provider to review fit against programme criteria.',
    },
    {
      id: 'q7',
      q: 'Is the website only for IT providers?',
      a: 'No. The site supports both companies and IT providers, with page-specific messaging and clear next steps for each audience.',
    },
    {
      id: 'q8',
      q: 'Do you support mobile users?',
      a: 'Yes. Layout spacing and card stacking are designed to remain readable and easy to navigate on phones.',
    },
  ];

  return (
    <PageSection title="FAQ" subtitle="Accordion answers keep the page clean and easy to scan.">
      <Accordion items={items} defaultOpenId="q1" />
    </PageSection>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', org: '', audience: 'company', message: '' });

  return (
    <PageSection title="Contact" subtitle="A clear next step—send your message and we’ll route you.">
      <div className="grid2" style={{ alignItems: 'start' }}>
        <div className="card">
          {submitted ? (
            <div>
              <div className="titleH4" style={{ color: 'var(--color-text)' }}>Message received</div>
              <p className="bodyText" style={{ marginTop: 12 }}>
                Thanks—your request is saved locally for this demo. In a real deployment, this form would send data to your backend or email service.
              </p>
              <div style={{ marginTop: 16 }}>
                <Button variant="secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', org: '', audience: 'company', message: '' }); }}>
                  Send another message
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="formGrid">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="org">Organisation</label>
                  <input
                    id="org"
                    value={form.org}
                    onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="audience">Audience</label>
                  <select
                    id="audience"
                    value={form.audience}
                    onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
                  >
                    <option value="company">Company</option>
                    <option value="provider">IT Provider</option>
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginTop: 16 }}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your eligible IT project (or certification interest) and your next step."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 16, justifyContent: 'flex-end' }}>
                <Button variant="secondary" type="button" onClick={() => setForm({ name: '', email: '', org: '', audience: 'company', message: '' })}>
                  Clear
                </Button>
                <Button variant="primary" type="submit">Send message</Button>
              </div>
            </form>
          )}
        </div>
        <div className="card cardSoft">
          <div className="titleH4" style={{ color: 'var(--color-text)' }}>Direct support options</div>
          <p className="smallText" style={{ marginTop: 10 }}>
            For this minimal demo, these links don’t send requests, but the content is ready to connect to your backend.
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <div className="card" style={{ padding: 16, borderRadius: 14 }}>
              <div style={{ fontWeight: 900, color: 'var(--color-text)' }}>Email</div>
              <div className="smallText" style={{ marginTop: 6 }}>contact@eusubsidies.example</div>
            </div>
            <div className="card" style={{ padding: 16, borderRadius: 14 }}>
              <div style={{ fontWeight: 900, color: 'var(--color-text)' }}>Live chat</div>
              <div className="smallText" style={{ marginTop: 6 }}>Available during working hours (demo)</div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <ButtonLink variant="secondary" to="/faq">Read FAQ</ButtonLink>
              <ButtonLink variant="primary" to="/standards">View Standards</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

function NotFound() {
  return (
    <PageSection title="Page not found" subtitle="The requested page does not exist in this demo.">
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <ButtonLink variant="primary" to="/">Go to Home</ButtonLink>
        <ButtonLink variant="secondary" to="/contact">Contact</ButtonLink>
      </div>
    </PageSection>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/eligible-projects" element={<EligibleProjects />} />
      <Route path="/for-companies" element={<ForCompanies />} />
      <Route path="/for-it-providers" element={<ForITProviders />} />
      <Route path="/become-certified" element={<BecomeCertified />} />
      <Route path="/about" element={<About />} />
      <Route path="/standards" element={<Standards />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="appRoot">
        <SiteHeader />
        <AppRoutes />
        <SiteFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
