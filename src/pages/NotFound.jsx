import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." path="/404" noindex />
      <section className="page-hero notfound">
        <div className="container center">
          <m.p className="nf-num grad-text" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
            404
          </m.p>
          <h1 className="h2">This page went off-brief</h1>
          <p className="lead">The page you're looking for doesn't exist or has moved.</p>
          <div className="btn-row center-row">
            <Link to="/" className="btn btn-primary">Back to home</Link>
            <Link to="/services" className="btn btn-outline">View services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
