import { Info, MapPin } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { formatIssue, formatPracticeArea } from "../format";
import type { ResultsState } from "../types";

export const ResultsPage = () => {
  const location = useLocation();
  const state = location.state as ResultsState | null;

  if (!state) {
    return <Navigate to="/intake" replace />;
  }

  return (
    <div className="page">
      <section className="results-header">
        <p className="eyebrow">Experience Matching</p>
        <h1>Lawyers with experience relevant to your situation</h1>
        <div className="classification-box">
          <div>
            <span className="label">Interpreted legal problem</span>
            <h2>{formatPracticeArea(state.classification.primaryArea)}</h2>
            {state.classification.summary ? <p>{state.classification.summary}</p> : null}
          </div>
          <div>
            <span className="label">Relevant issues</span>
            <div className="chip-row">
              {state.classification.issues.map((issue) => (
                <span className="chip" key={issue}>
                  {formatIssue(issue)}
                </span>
              ))}
            </div>
          </div>
        </div>
        {state.classification.needsMoreInformation ? (
          <div className="follow-up-box">
            <h2>We need a little more information to improve your matches.</h2>
            <ul>
              {state.classification.followUpQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="match-grid">
        {state.matches.map((match) => (
          <article className="lawyer-card" key={match.lawyer.id}>
            <div className="card-topline">
              <div>
                <h2>{match.lawyer.name}</h2>
                <p className="muted">
                  <MapPin aria-hidden="true" size={15} />
                  {match.lawyer.city}, {match.lawyer.province}
                </p>
              </div>
              <div className="score" title={match.explanation}>
                <strong>{match.experienceMatch}%</strong>
                <span>
                  Experience Match <Info aria-hidden="true" size={14} />
                </span>
              </div>
            </div>
            <p>{match.lawyer.bio}</p>
            <dl className="meta-grid">
              <div>
                <dt>Practice areas</dt>
                <dd>{match.lawyer.practiceAreas.join(", ")}</dd>
              </div>
              <div>
                <dt>Years practising</dt>
                <dd>{match.lawyer.yearsPractising}</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>{match.lawyer.languages.join(", ")}</dd>
              </div>
              <div>
                <dt>Relevant demo cases</dt>
                <dd>{match.relevantCaseCount}</dd>
              </div>
            </dl>
            <div className="chip-row">
              {match.relevantIssues.map((issue) => (
                <span className="chip subtle" key={issue}>
                  {issue}
                </span>
              ))}
            </div>
            <Link className="button secondary" to={`/lawyers/${match.lawyer.slug}`}>
              View Profile
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};
