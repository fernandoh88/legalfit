import { ArrowLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLawyer, getLawyerCases } from "../api";
import type { DemoCase, Lawyer } from "../types";

export const LawyerProfilePage = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [cases, setCases] = useState<DemoCase[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    Promise.all([getLawyer(id), getLawyerCases(id)])
      .then(([lawyerResponse, casesResponse]) => {
        setLawyer(lawyerResponse.lawyer);
        setCases(casesResponse.cases);
      })
      .catch((apiError) => {
        setError(apiError instanceof Error ? apiError.message : "Unable to load lawyer.");
      });
  }, [id]);

  if (error) {
    return (
      <div className="page narrow">
        <p className="form-error">{error}</p>
        <Link to="/intake">Return to intake</Link>
      </div>
    );
  }

  if (!lawyer) {
    return <div className="page narrow">Loading profile...</div>;
  }

  return (
    <div className="page">
      <Link className="back-link" to="/intake">
        <ArrowLeft aria-hidden="true" size={17} />
        New search
      </Link>

      <section className="profile-header">
        <div>
          <p className="eyebrow">Fictional Demo Lawyer</p>
          <h1>{lawyer.name}</h1>
          <p className="muted">
            <MapPin aria-hidden="true" size={16} />
            {lawyer.city}, {lawyer.province}
          </p>
        </div>
        <dl className="profile-facts">
          <div>
            <dt>Practice areas</dt>
            <dd>{lawyer.practiceAreas.join(", ")}</dd>
          </div>
          <div>
            <dt>Years practising</dt>
            <dd>{lawyer.yearsPractising}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{lawyer.languages.join(", ")}</dd>
          </div>
        </dl>
      </section>

      <section className="profile-section">
        <h2>Relevant Experience</h2>
        <div className="experience-grid">
          {lawyer.caseExperience.flatMap((area) => [
            <article key={`${area.practiceArea}-total`} className="stat-card">
              <span>{area.practiceArea} cases</span>
              <strong>{area.count}</strong>
            </article>,
            ...area.issues.map((issue) => (
              <article key={`${area.practiceArea}-${issue}`} className="stat-card">
                <span>{issue}</span>
                <strong>
                  {
                    cases.filter((demoCase) =>
                      demoCase.issues.some((caseIssue) => caseIssue.toLowerCase() === issue.toLowerCase())
                    ).length
                  }
                </strong>
              </article>
            ))
          ])}
        </div>
      </section>

      <section className="profile-section">
        <div className="section-heading">
          <h2>Relevant Public Cases</h2>
          <span className="demo-badge">Fictional demo cases</span>
        </div>
        <div className="case-list">
          {cases.map((demoCase) => (
            <article className="case-card" key={demoCase.id}>
              <div>
                <h3>{demoCase.caseName}</h3>
                <p className="citation">{demoCase.citation}</p>
              </div>
              <p className="muted">
                {demoCase.year} · {demoCase.court} · Represented: {demoCase.representedSide}
              </p>
              <div className="chip-row">
                {demoCase.issues.map((issue) => (
                  <span className="chip subtle" key={issue}>
                    {issue}
                  </span>
                ))}
              </div>
              <p>{demoCase.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
