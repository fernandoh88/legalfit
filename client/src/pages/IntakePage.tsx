import { Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { classifyIntake, getMatches } from "../api";
import type { LegalIntake } from "../types";

export const IntakePage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Burnaby");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const intake: LegalIntake = {
      description,
      city,
      province: "BC"
    };

    try {
      const classified = await classifyIntake(intake);
      const matched = await getMatches(classified.intake, classified.classification);

      navigate("/results", {
        state: {
          intake: classified.intake,
          classification: matched.classification,
          matches: matched.matches
        }
      });
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Unable to process intake.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page narrow">
      <section className="panel">
        <p className="eyebrow">Case Intake</p>
        <h1>Tell us what happened</h1>
        <form className="intake-form" onSubmit={handleSubmit}>
          <label>
            <span>Tell us what happened</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              minLength={20}
              maxLength={2500}
              required
              placeholder="I worked for my employer for seven years. I was recently terminated and received only two weeks of severance."
            />
          </label>

          <div className="field-grid">
            <label>
              <span>City</span>
              <input value={city} onChange={(event) => setCity(event.target.value)} required />
            </label>
            <label>
              <span>Province</span>
              <select value="BC" disabled>
                <option value="BC">British Columbia</option>
              </select>
            </label>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="button primary" type="submit" disabled={isSubmitting}>
            <Search aria-hidden="true" size={18} />
            {isSubmitting ? "Finding..." : "Find Relevant Lawyers"}
          </button>
        </form>
      </section>
    </div>
  );
};
