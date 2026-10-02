import { ArrowRight, ClipboardList, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => (
  <div className="page">
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">British Columbia MVP</p>
        <h1>Find a lawyer with experience that fits your case.</h1>
        <p className="hero-copy">
          Describe what happened and LegalFit will help you discover lawyers with relevant experience.
        </p>
        <Link className="button primary" to="/intake">
          Find a Lawyer
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>

    <section className="steps" aria-label="How LegalFit works">
      <article>
        <ClipboardList aria-hidden="true" />
        <span>1</span>
        <h2>Tell us what happened</h2>
        <p>Share a short description of the legal situation and your city in British Columbia.</p>
      </article>
      <article>
        <Search aria-hidden="true" />
        <span>2</span>
        <h2>We identify the type of legal issue</h2>
        <p>We identify general issue categories to help find relevant experience.</p>
      </article>
      <article>
        <ShieldCheck aria-hidden="true" />
        <span>3</span>
        <h2>Explore lawyers with relevant experience</h2>
        <p>Review fictional demo lawyers and clearly marked fictional public case metadata.</p>
      </article>
    </section>

    <aside className="disclaimer">
      LegalFit helps you discover lawyers based on information you provide and publicly available
      professional experience. LegalFit does not provide legal advice and does not evaluate the merits
      or likely outcome of your case.
    </aside>
  </div>
);
