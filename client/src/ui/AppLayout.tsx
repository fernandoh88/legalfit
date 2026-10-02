import { Scale } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export const AppLayout = () => (
  <div className="app-shell">
    <header className="site-header">
      <Link className="brand" to="/">
        <Scale aria-hidden="true" size={24} />
        <span>LegalFit</span>
      </Link>
      <nav aria-label="Primary">
        <Link to="/intake">Find a Lawyer</Link>
      </nav>
    </header>
    <aside className="demo-notice" aria-label="Demo notice">
      Portfolio demo. All lawyers and cases are fictional. Please use fictional descriptions.
    </aside>
    <main>
      <Outlet />
    </main>
    <footer className="site-footer">
      LegalFit helps you discover lawyers based on information you provide and publicly available
      professional experience. LegalFit does not provide legal advice and does not evaluate the merits
      or likely outcome of your case.
    </footer>
  </div>
);
