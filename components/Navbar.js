import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">Resume Optimizer</div>
        <div className="navbar-nav">
          <Link href="/">Dashboard</Link>
          <Link href="/optimize">Optimizer</Link>
        </div>
      </div>
    </nav>
  );
}

