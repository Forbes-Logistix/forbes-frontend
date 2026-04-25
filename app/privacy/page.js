const TITLE = "Privacy Policy | Forbes Logistix";
const DESCRIPTION =
  "Learn how Forbes Logistix collects, uses, and protects information submitted through its website, recruiting forms, and communications channels.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/privacy" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/privacy",
  },
};

const EFFECTIVE = "April 25, 2026";

export default function PrivacyPage() {
  return (
    <main className="bg-white text-black">
      <article className="max-w-3xl mx-auto px-6 py-20">
        <header className="mb-10 border-b border-black/10 pb-6">
          <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">Forbes Logistix</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-600">Effective: {EFFECTIVE}</p>
        </header>

        <div className="space-y-6 text-base md:text-[17px] leading-relaxed text-gray-800">
          <p>
            This Privacy Policy explains how Forbes Logistix, LLC (&ldquo;Forbes Logistix,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information
            in connection with our website at{" "}
            <a className="underline" href="https://www.forbeslogistix.com">forbeslogistix.com</a> and any
            related forms, communications, or services we provide through the site (collectively, the
            &ldquo;Site&rdquo;).
          </p>

          {/* Carrier-friendly summary box: written so a 10DLC / SMS reviewer can confirm
              the three required disclosures (collection + use + opt-out, plus the no-share
              guarantee for mobile numbers) at a glance, without reading the full policy. */}
          <aside className="mt-8 rounded-2xl border border-black bg-black text-white p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-3">
              Plain-English summary
            </h2>
            <ul className="list-disc ml-5 space-y-2 text-base leading-relaxed">
              <li>
                We collect what you give us through forms on this Site (name, phone, email, years of
                driving experience, message contents) and standard technical data your browser sends.
              </li>
              <li>
                We use it to respond to your inquiry, evaluate recruiting interest, communicate with
                you by phone, email, or text where you have given us consent, and operate this Site.
              </li>
              <li className="font-semibold">
                Mobile phone numbers and SMS opt-in data are <span className="underline">not shared
                or sold to third parties for marketing or promotional purposes</span>, and that
                information is not shared with affiliates for their own marketing or promotional
                purposes.
              </li>
              <li>
                You can opt out of recruiting calls or texts at any time. Reply{" "}
                <span className="font-semibold">STOP</span> to a text message to stop texts. Reply{" "}
                <span className="font-semibold">HELP</span> for help. Tell our recruiter to remove
                you from call lists, or email{" "}
                <a className="underline" href="mailto:recruiting@forbeslogistix.com">recruiting@forbeslogistix.com</a>.
                Message and data rates may apply. Message frequency may vary.
              </li>
            </ul>
          </aside>

          <h2 className="text-2xl font-bold mt-10">1. Information We Collect</h2>
          <p>We collect the following categories of information:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <span className="font-semibold">Contact information</span> &mdash; name, phone number, email
              address, and similar identifiers you provide when you fill out a form or otherwise contact us.
            </li>
            <li>
              <span className="font-semibold">Inquiry and applicant information</span> &mdash; information
              you submit through the Quick Apply form, the general contact form, or any subsequent recruiting
              communication, including years of driving experience and the contents of your messages.
            </li>
            <li>
              <span className="font-semibold">Device, browser, and usage data</span> &mdash; information
              automatically collected when you use the Site, such as IP address, browser type, device type,
              referring URL, pages viewed, and timestamps.
            </li>
            <li>
              <span className="font-semibold">Cookies and analytics data</span> &mdash; we and our service
              providers may use cookies, similar technologies, and analytics tools to understand how the Site
              is used and to improve it.
            </li>
            <li>
              <span className="font-semibold">Communications data</span> &mdash; records of phone calls,
              text messages, and emails between you and our recruiting or operations teams, including consent
              and opt-out preferences you give us.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">2. How We Collect It</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>directly from you when you submit a form, send us a message, or speak with us;</li>
            <li>automatically as you interact with the Site; and</li>
            <li>during recruiting and application processes, including any follow-up conversations.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">3. How We Use Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>respond to inquiries and requests for information;</li>
            <li>evaluate and follow up with applicants for driver and other roles;</li>
            <li>communicate with you by phone, email, or text where you have given us appropriate consent;</li>
            <li>operate, maintain, secure, and improve the Site, and detect and prevent fraud or misuse;</li>
            <li>maintain business records; and</li>
            <li>comply with legal, regulatory, and audit obligations.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">4. Disclosures of Information</h2>
          <p>We may disclose information in the following categories of circumstances:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <span className="font-semibold">Service providers</span> &mdash; hosting providers, email and
              communications platforms, analytics tools, and other vendors that process information on our
              behalf, in each case subject to appropriate confidentiality obligations.
            </li>
            <li>
              <span className="font-semibold">Professional advisors</span> &mdash; lawyers, accountants,
              auditors, and similar advisors when reasonably necessary.
            </li>
            <li>
              <span className="font-semibold">Legal and compliance</span> &mdash; when we reasonably believe
              disclosure is required to comply with law, respond to lawful requests, enforce our agreements,
              protect rights, or address security or fraud concerns.
            </li>
            <li>
              <span className="font-semibold">Business transfers</span> &mdash; in connection with a merger,
              acquisition, reorganization, financing, or sale of assets, subject to applicable law.
            </li>
          </ul>
          <p className="font-semibold">
            We do not share or sell your mobile phone number or SMS opt-in data with any third party for
            marketing or promotional purposes. We do not share that information with affiliates for their
            own marketing or promotional purposes.
          </p>
          <p>
            More broadly: we do not sell personal information for monetary value, and we do not share
            personal information for cross-context behavioral advertising as those terms are commonly used
            in U.S. state privacy laws.
          </p>

          <h2 className="text-2xl font-bold mt-10">5. Cookies and Analytics</h2>
          <p>
            The Site may use cookies and similar technologies to remember your preferences, measure usage, and
            keep the Site secure. Most browsers let you control cookies through their settings. If you disable
            cookies, parts of the Site may not work as intended.
          </p>

          <h2 className="text-2xl font-bold mt-10">6. Communications Preferences and Opt-Out</h2>
          <p>
            If you provide your phone number and consent, we may contact you by phone or text for recruiting
            follow-up, interview scheduling, application status, and onboarding-related communications.
            Message and data rates may apply. Message frequency varies.
          </p>
          <p className="font-semibold">How to opt out:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <span className="font-semibold">Texts:</span> reply{" "}
              <span className="font-semibold">STOP</span> to any recruiting text message and we will stop
              texting that number. Reply <span className="font-semibold">HELP</span> for help.
            </li>
            <li>
              <span className="font-semibold">Calls:</span> tell our recruiter you want to be removed from
              the call list, or email{" "}
              <a className="underline" href="mailto:recruiting@forbeslogistix.com">recruiting@forbeslogistix.com</a>.
            </li>
            <li>
              <span className="font-semibold">Email:</span> use the unsubscribe link in any marketing
              email, or email{" "}
              <a className="underline" href="mailto:contact@forbeslogistix.com">contact@forbeslogistix.com</a>{" "}
              with the words &ldquo;Unsubscribe&rdquo; in the subject line.
            </li>
          </ul>
          <p>
            Opting out of recruiting communications does not affect our ability to respond to general
            inquiries you initiate, and does not waive any rights you have under applicable law.
          </p>

          <h2 className="text-2xl font-bold mt-10">7. Data Retention</h2>
          <p>
            We retain personal information for as long as reasonably necessary for the purposes described in
            this Policy, including to maintain recruiting and business records, to operate the Site, to comply
            with legal and regulatory obligations, to resolve disputes, and to enforce our agreements. When
            information is no longer needed for those purposes, we delete or de-identify it.
          </p>

          <h2 className="text-2xl font-bold mt-10">8. Security</h2>
          <p>
            We use reasonable administrative, technical, and physical safeguards designed to protect personal
            information against accidental or unauthorized loss, access, disclosure, alteration, or
            destruction. No system is perfectly secure, however, and we cannot guarantee the security of
            information transmitted over the internet or stored electronically.
          </p>

          <h2 className="text-2xl font-bold mt-10">9. Children&rsquo;s Privacy</h2>
          <p>
            The Site is not directed to children under 13, and we do not knowingly collect personal
            information from children under 13. If you believe a child under 13 has provided us with personal
            information, please contact us so we can delete it.
          </p>

          <h2 className="text-2xl font-bold mt-10">10. U.S. State Privacy Rights (Where Applicable)</h2>
          <p>
            Some U.S. states give residents specific privacy rights when their state law applies to a
            business. Where applicable to Forbes Logistix and to you, you may have the right to: (a) request
            access to or a copy of certain personal information we hold about you; (b) request correction of
            inaccurate information; (c) request deletion of personal information, subject to legal
            exceptions; and (d) opt out of certain processing activities. To exercise any rights that apply,
            email us at{" "}
            <a className="underline" href="mailto:contact@forbeslogistix.com">contact@forbeslogistix.com</a>{" "}
            with the words &ldquo;Privacy Request&rdquo; in the subject line. We may verify your identity
            before responding. We do not discriminate against you for exercising any privacy right.
          </p>
          {/* TODO: revisit threshold-based U.S. state privacy laws (e.g., CCPA/CPRA, VCDPA, CTDPA, CPA, UCPA, TDPSA, OCPA, MCDPA, NHPA, NJDPA, FDBR) once company processing volumes are confirmed and counsel has weighed in. */}

          <h2 className="text-2xl font-bold mt-10">11. International Users</h2>
          <p>
            The Site is operated from the United States. If you access the Site from outside the U.S., you
            understand that your information may be processed in the U.S. and that U.S. data protection laws
            may differ from those of your country.
          </p>

          <h2 className="text-2xl font-bold mt-10">12. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will post the updated policy
            here with a new &ldquo;Effective&rdquo; date. Updates apply prospectively from the new effective
            date.
          </p>

          <h2 className="text-2xl font-bold mt-10">13. How to Contact Us</h2>
          <p>
            For privacy questions or to make a privacy request, please contact us at{" "}
            <a className="underline" href="mailto:contact@forbeslogistix.com">contact@forbeslogistix.com</a>{" "}
            or by mail at Forbes Logistix, LLC, 3180 Utica Ave, Jackson, MS 39209.
          </p>
        </div>
      </article>
    </main>
  );
}
