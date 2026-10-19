import { Link } from 'react-router-dom'
import Seo, { crumbs } from '../components/Seo.jsx'
import { PageHero } from '../components/Blocks.jsx'
import { SITE, companyLine } from '../data/site.js'
import { openCookieSettings } from '../lib/consent.js'

const UPDATED = SITE.legalUpdated

function LegalPage({ title, description, path, children }) {
  return (
    <>
      <Seo title={title} description={description} path={path} schema={[crumbs([['Home', '/'], [title, path]])]} />
      <PageHero crumbs={[['Home', '/'], [title, path]]} eyebrow="Legal" title={title} text={`Last updated: ${UPDATED}`} />
      <section className="section pt-0">
        <div className="container narrow prose legal">{children}</div>
      </section>
    </>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      description="How Digifier UK collects, uses and protects your personal data under the UK GDPR and Data Protection Act 2018, and how to exercise your rights."
    >
      <p>
        This policy explains how {SITE.legalName} ("Digifier", "we", "us") collects and uses your personal data when you visit{' '}
        {SITE.url.replace('https://', '')} or contact us. We comply with the UK General Data Protection Regulation (UK GDPR), the Data
        Protection Act 2018 and the Privacy and Electronic Communications Regulations (PECR).
      </p>

      <h2>1. Who we are</h2>
      <p>
        The data controller is {companyLine()}
        {SITE.icoNumber && ` ICO registration: ${SITE.icoNumber}.`} Contact our privacy lead at{' '}
        <a href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a>.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Enquiry data</strong> — name, email, phone, company, service of interest, budget and message you send via our form, email, phone or WhatsApp.</li>
        <li><strong>Client data</strong> — contact and billing details and project information if you become a client.</li>
        <li><strong>Technical data</strong> — IP address, browser and device information processed by our hosting provider to deliver and secure the site.</li>
        <li><strong>Analytics data</strong> — only if you consent: pages visited and interactions, collected by Google Analytics 4 with IP anonymisation.</li>
      </ul>
      <p>We do not knowingly collect data from children under 13, and we do not collect special category data through this website.</p>

      <h2>3. How and why we use it (lawful bases)</h2>
      <table>
        <thead><tr><th>Purpose</th><th>Lawful basis</th></tr></thead>
        <tbody>
          <tr><td>Responding to your enquiry and preparing quotes</td><td>Consent (Art. 6(1)(a)) and steps prior to a contract (Art. 6(1)(b))</td></tr>
          <tr><td>Delivering services, invoicing and account management</td><td>Contract (Art. 6(1)(b))</td></tr>
          <tr><td>Keeping accounting and tax records</td><td>Legal obligation (Art. 6(1)(c))</td></tr>
          <tr><td>Website security and fraud prevention</td><td>Legitimate interests (Art. 6(1)(f))</td></tr>
          <tr><td>Analytics cookies</td><td>Consent (Art. 6(1)(a)) and PECR reg. 6</td></tr>
          <tr><td>Sending marketing emails</td><td>Consent, or soft opt-in for existing clients, with an unsubscribe link in every message</td></tr>
        </tbody>
      </table>

      <h2>4. WhatsApp</h2>
      <p>
        If you contact us via WhatsApp, your messages and phone number are processed by WhatsApp (Meta Platforms Ireland Ltd) under its own
        privacy policy, and by us to reply to you. Our website only opens WhatsApp when you click a WhatsApp button — no data is shared with
        Meta simply by visiting our site. If you would rather not use WhatsApp, please use our contact form or email.
      </p>

      <h2>5. Who we share data with</h2>
      <p>We never sell your data. We share it only with trusted processors under written contracts, such as:</p>
      <ul>
        <li>Website hosting and content delivery providers</li>
        <li>Email and form-handling providers</li>
        <li>Google (Analytics), only where you have consented</li>
        <li>Accounting and payment providers for clients</li>
        <li>Other members of the Digifier group (including Digifier Web Technologies LLP, India) who help deliver projects</li>
      </ul>

      <h2>6. International transfers</h2>
      <p>
        Some processors, and our delivery team in India, are outside the UK. Where data is transferred to a country without UK adequacy
        regulations we use appropriate safeguards such as the ICO's International Data Transfer Agreement (IDTA) or the UK Addendum to the EU
        Standard Contractual Clauses.
      </p>

      <h2>7. How long we keep it</h2>
      <ul>
        <li>Enquiries that don't become projects: up to 12 months, then deleted.</li>
        <li>Client and financial records: 6 years after the end of the financial year, as required by HMRC.</li>
        <li>Analytics data: 14 months (GA4 retention setting).</li>
      </ul>

      <h2>8. Your rights</h2>
      <p>Under UK GDPR you have the right to:</p>
      <ul>
        <li>access a copy of your personal data;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased;</li>
        <li>restrict or object to processing, including direct marketing at any time;</li>
        <li>data portability;</li>
        <li>withdraw consent at any time — for cookies use <button className="link-btn" onClick={openCookieSettings}>cookie settings</button>.</li>
      </ul>
      <p>
        Email <a href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a> to exercise any right. We respond within one month and there is
        normally no fee.
      </p>

      <h2>9. Security</h2>
      <p>The site is served over HTTPS, forms are protected against spam, and access to client data is limited to staff who need it.</p>

      <h2>10. Complaints</h2>
      <p>
        If you are unhappy with how we handle your data, please contact us first. You also have the right to complain to the Information
        Commissioner's Office (ICO): <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a>,
        0303 123 1113.
      </p>

      <h2>11. Changes</h2>
      <p>We may update this policy. The latest version will always be on this page with its revision date.</p>
    </LegalPage>
  )
}

export function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookie-policy"
      description="The cookies Digifier UK uses, why we use them, and how to change your cookie preferences at any time."
    >
      <p>
        Cookies are small files stored on your device. Under PECR we only set non-essential cookies with your consent. You can change your
        choice at any time: <button className="btn btn-outline btn-sm" onClick={openCookieSettings}>Open cookie settings</button>
      </p>
      <h2>Cookies we use</h2>
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Purpose</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>digifier-consent (local storage)</td><td>Strictly necessary</td><td>Remembers your cookie choices</td><td>Until cleared</td></tr>
          <tr><td>_ga, _ga_*</td><td>Analytics (consent)</td><td>Google Analytics 4 — distinguishes visitors to produce anonymous statistics</td><td>Up to 2 years</td></tr>
        </tbody>
      </table>
      <p>
        Analytics cookies are only placed if you choose "Accept all" or enable them in settings. We do not use advertising or marketing
        cookies; if that changes, we will update this policy and ask for your consent first. Rejecting them does not affect
        how the site works. Fonts are self-hosted, so no third-party font cookies or requests are made.
      </p>
      <h2>Third-party links</h2>
      <p>WhatsApp, Instagram and other external sites linked from ours set their own cookies under their own policies once you visit them.</p>
      <h2>Managing cookies in your browser</h2>
      <p>You can also block or delete cookies in your browser settings. See <a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noopener noreferrer">the ICO's cookie guidance</a>.</p>
      <p>Questions? Email <a href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a> or read our <Link to="/privacy-policy">privacy policy</Link>.</p>
    </LegalPage>
  )
}

export function Terms() {
  return (
    <LegalPage
      title="Terms of Business"
      path="/terms"
      description="Terms of business for Digifier UK website, marketing, SEO and development services."
    >
      <p>These terms apply to services provided by {SITE.legalName}. Each project is also governed by its written proposal or statement of work, which takes priority if there is any conflict.</p>
      <h2>1. Quotes &amp; pricing</h2>
      <p>All prices are in pounds sterling (GBP). Package prices on this website are guide prices and {SITE.pricesIncludeVat ? 'include' : 'exclude'} VAT; your written quote confirms the final price, scope and timeline.</p>
      <h2>2. Payment</h2>
      <p>One-off projects are normally invoiced 50% on acceptance and 50% before launch. Monthly retainers are billed in advance. Invoices are payable within 14 days.</p>
      <h2>3. Third-party costs</h2>
      <p>Advertising spend (e.g. Google Ads, Meta Ads), premium plugins, stock assets and marketplace fees are paid by the client and are not included in our fees unless stated.</p>
      <h2>4. Monthly services</h2>
      <p>Monthly plans have no long-term lock-in and can be cancelled with 30 days' written notice.</p>
      <h2>5. Results</h2>
      <p>We use proven, white-hat methods but cannot guarantee specific rankings, traffic or sales, which depend on factors outside our control.</p>
      <h2>6. Intellectual property</h2>
      <p>On full payment, ownership of the bespoke deliverables we create for you transfers to you. We may show non-confidential work in our portfolio unless you ask us not to.</p>
      <h2>7. Data protection</h2>
      <p>Where we process personal data on your behalf we act as your processor under a data processing agreement compliant with Article 28 UK GDPR. See our <Link to="/privacy-policy">privacy policy</Link>.</p>
      <h2>8. Consumers</h2>
      <p>If you are a consumer buying online, you have a 14-day cancellation right under the Consumer Contracts Regulations 2013. If you ask us to start work within that period you may have to pay for work already done.</p>
      <h2>9. Liability</h2>
      <p>Nothing in these terms limits liability that cannot be limited by law. Otherwise our total liability is limited to the fees paid for the relevant service in the previous 12 months.</p>
      <h2>10. Law</h2>
      <p>These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction.</p>
    </LegalPage>
  )
}

export function AccessibilityStatement() {
  return (
    <LegalPage
      title="Accessibility Statement"
      path="/accessibility"
      description="How accessible the Digifier UK website is, known limitations, and how to tell us about a problem or ask for content in another format."
    >
      <p>
        {SITE.legalName} wants everyone to be able to use {SITE.url.replace('https://', '')}. We aim to meet the Web Content
        Accessibility Guidelines (WCAG) 2.2 at level AA.
      </p>
      <h2>What you can do on this site</h2>
      <ul>
        <li>navigate every page with a keyboard, with a visible focus indicator and a "Skip to content" link;</li>
        <li>zoom text up to 200% and use the site at 320 pixels wide without scrolling sideways;</li>
        <li>pause all moving content with the "Pause animations" button, or turn animation off with your device's reduced-motion setting;</li>
        <li>read every page without JavaScript, including all of our prices;</li>
        <li>use a screen reader: pages have headings, landmarks, labelled form fields and error messages that are announced.</li>
      </ul>
      <h2>How accessible this website is</h2>
      <p>
        We believe the site is <strong>partially compliant</strong> with WCAG 2.2 AA. Automated testing with axe-core found no issues on the
        pages we checked, but automated tools only catch some problems. Known limitations:
      </p>
      <ul>
        <li>we have not yet completed a full manual test with screen readers such as NVDA, JAWS and VoiceOver;</li>
        <li>some headings use gradient-coloured text, whose contrast cannot be measured automatically;</li>
        <li>WhatsApp, Instagram and other external services we link to are outside our control.</li>
      </ul>
      <h2>Feedback and other formats</h2>
      <p>
        If you find a problem, or need information from this site in another format such as large print or plain text, email{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call <a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a> ({SITE.hours}).
        Tell us the page address and what went wrong.
      </p>
      <h2>Enforcement</h2>
      <p>
        If you are not happy with how we respond, you can contact the{' '}
        <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer">Equality Advisory and Support Service (EASS)</a>.
      </p>
      <h2>How we tested</h2>
      <p>
        This statement was prepared on {UPDATED}. We tested the site using axe-core automated checks against WCAG 2.2 A and AA, keyboard-only
        navigation, reflow at 320 pixels, reduced-motion settings and with JavaScript turned off. We will review it at least once a year
        and whenever the site changes significantly.
      </p>
    </LegalPage>
  )
}
