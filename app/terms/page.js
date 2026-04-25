const TITLE = "Terms of Use | Forbes Logistix";
const DESCRIPTION =
  "Terms governing the use of the Forbes Logistix website, recruiting inquiries, and online submissions.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/terms" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/terms",
  },
};

const EFFECTIVE = "April 25, 2026";

export default function TermsPage() {
  return (
    <main className="bg-white text-black">
      <article className="max-w-3xl mx-auto px-6 py-20">
        <header className="mb-10 border-b border-black/10 pb-6">
          <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">Forbes Logistix</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Terms of Use</h1>
          <p className="text-sm text-gray-600">Effective: {EFFECTIVE}</p>
        </header>

        <div className="prose-styles space-y-6 text-base md:text-[17px] leading-relaxed text-gray-800">
          <p>
            These Terms of Use (the &ldquo;Terms&rdquo;) govern your access to and use of the website
            located at <a className="underline" href="https://www.forbeslogistix.com">forbeslogistix.com</a>{" "}
            and any related subdomains, pages, content, and online forms (collectively, the &ldquo;Site&rdquo;)
            operated by Forbes Logistix, LLC, a Mississippi limited liability company (&ldquo;Forbes
            Logistix,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using
            the Site, you agree to these Terms. If you do not agree, do not use the Site.
          </p>

          <h2 className="text-2xl font-bold mt-10">1. Eligibility and Lawful Use</h2>
          <p>
            You may use the Site only if you can form a binding contract with Forbes Logistix and only in
            compliance with these Terms and all applicable laws. You agree to use the Site only for lawful
            purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else&rsquo;s
            use and enjoyment of the Site.
          </p>

          <h2 className="text-2xl font-bold mt-10">2. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>access, scrape, copy, or harvest content from the Site by automated means without our prior written consent;</li>
            <li>interfere with or disrupt the Site, our servers, or our networks, or attempt to circumvent any security or access control;</li>
            <li>reverse engineer, decompile, or otherwise attempt to derive source code from the Site, except to the extent permitted by law;</li>
            <li>access or use any portion of the Site you are not authorized to access;</li>
            <li>upload, transmit, or distribute viruses, worms, malware, or any other harmful code; or</li>
            <li>impersonate any person or misrepresent your affiliation with any person or entity.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">3. Intellectual Property; Limited License</h2>
          <p>
            All content on the Site &mdash; including text, graphics, logos, photographs, video, audio,
            user interface designs, software, and the selection and arrangement thereof &mdash; is owned by
            Forbes Logistix or its licensors and is protected by U.S. and international intellectual property
            laws. The names &ldquo;Forbes Logistix&rdquo; and the buffalo mark, together with any related
            logos, are trademarks of Forbes Logistix.
          </p>
          <p>
            Subject to your compliance with these Terms, Forbes Logistix grants you a limited, non-exclusive,
            non-transferable, revocable license to access and use the Site for your personal or internal
            business informational purposes. No other rights are granted, expressly or by implication.
          </p>

          <h2 className="text-2xl font-bold mt-10">4. Information Is for General Reference Only</h2>
          <p>
            The Site is provided for general informational purposes. Recruiting opportunities, compensation
            details, lanes, home time, equipment, schedules, requirements, and other operational specifics may
            change without notice and may not apply to every position, applicant, or driver. Nothing on the Site
            constitutes a contract, guarantee, or binding offer of employment, lease, settlement terms, or other
            commercial relationship. Specific terms applicable to any employment or engagement will be set forth
            in separate written agreements.
          </p>

          <h2 className="text-2xl font-bold mt-10">5. No Professional Advice</h2>
          <p>
            The Site does not provide legal, regulatory, safety, medical, financial, tax, or other professional
            advice. Information provided through the Site is not a substitute for advice from qualified
            professionals familiar with your particular circumstances.
          </p>

          <h2 className="text-2xl font-bold mt-10">6. Third-Party Links and Resources</h2>
          <p>
            The Site may include links to third-party websites or resources. Forbes Logistix does not control
            and is not responsible for any third-party content, products, or services. Your use of any
            third-party site or resource is at your own risk and subject to that third party&rsquo;s terms.
          </p>

          <h2 className="text-2xl font-bold mt-10">7. User Submissions</h2>
          <p>
            If you submit information through any form on the Site &mdash; including the Quick Apply form, the
            general contact form, or any inquiry tied to a recruiting or commercial conversation &mdash; you
            agree that the information you provide is, to your knowledge, truthful, current, and not
            misleading. You authorize Forbes Logistix to use that information to respond to your inquiry,
            evaluate recruiting interest, and otherwise as described in our{" "}
            <a className="underline" href="/privacy">Privacy Policy</a>.
          </p>
          <p>
            You are responsible for the content of your submissions. Do not submit information you do not have
            the right to share, and do not submit sensitive personal data unless we have specifically requested
            it through a separate, secure channel.
          </p>

          <h2 className="text-2xl font-bold mt-10">8. Reservation of Rights</h2>
          <p>
            Forbes Logistix may, in its sole discretion and without notice, restrict, suspend, or terminate any
            user&rsquo;s access to the Site, in whole or in part, for any conduct that violates these Terms or
            that we reasonably believe is harmful to the Site, our customers, our drivers, or any other person.
          </p>

          <h2 className="text-2xl font-bold mt-10">9. Disclaimer of Warranties</h2>
          <p className="uppercase text-sm tracking-wide font-semibold">
            The Site and all content and materials available through the Site are provided &ldquo;as is&rdquo;
            and &ldquo;as available,&rdquo; without warranties of any kind, whether express, implied, or
            statutory, including warranties of merchantability, fitness for a particular purpose,
            non-infringement, accuracy, or uninterrupted or error-free operation. Forbes Logistix does not
            warrant that the Site will be secure or free from defects.
          </p>

          <h2 className="text-2xl font-bold mt-10">10. Limitation of Liability</h2>
          <p className="uppercase text-sm tracking-wide font-semibold">
            To the fullest extent permitted by law, Forbes Logistix and its members, managers, officers,
            employees, contractors, and agents will not be liable for any indirect, incidental, special,
            consequential, exemplary, or punitive damages, or for any loss of profits, revenues, data, or
            goodwill, arising out of or related to your use of, or inability to use, the Site, even if advised
            of the possibility of such damages. The aggregate liability of Forbes Logistix arising out of or
            related to your use of the Site will not exceed one hundred U.S. dollars (US$100).
          </p>

          <h2 className="text-2xl font-bold mt-10">11. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Forbes Logistix and its members, managers,
            officers, employees, contractors, and agents from and against any claims, damages, liabilities, and
            expenses (including reasonable attorneys&rsquo; fees) arising out of or related to your misuse of
            the Site or violation of these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-10">12. Governing Law and Venue</h2>
          <p>
            These Terms and any dispute arising out of or relating to your use of the Site are governed by the
            laws of the State of Mississippi, without regard to its conflict of laws principles. Subject to
            Section 13, you and Forbes Logistix consent to the exclusive jurisdiction of the state and federal
            courts located in Hinds County, Mississippi for any action permitted under these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-10">13. Equitable Relief; Limited Scope</h2>
          <p>
            Notwithstanding any other provision of these Terms, Forbes Logistix may seek injunctive or other
            equitable relief in any court of competent jurisdiction to protect its intellectual property,
            confidential information, or to prevent misuse of the Site.
          </p>
          <p>
            These Terms do not, and are not intended to, govern the terms of any employment, lease, or
            independent-contractor relationship between Forbes Logistix and any individual, and they do not
            create any waiver of any non-waivable statutory right or any right to participate in proceedings
            before any government agency. Any agreement to arbitrate disputes related to employment or
            engagement, if any, must be set forth in a separate written agreement.
          </p>

          <h2 className="text-2xl font-bold mt-10">14. Severability; Waiver; Assignment</h2>
          <p>
            If any provision of these Terms is held unenforceable, that provision will be modified to the
            minimum extent necessary to make it enforceable, and the remaining provisions will remain in full
            force and effect. Our failure to enforce any provision is not a waiver of our right to do so later.
            You may not assign these Terms without our prior written consent. We may assign these Terms in
            connection with a merger, acquisition, reorganization, or sale of all or substantially all of our
            assets.
          </p>

          <h2 className="text-2xl font-bold mt-10">15. Changes to These Terms</h2>
          <p>
            Forbes Logistix may update these Terms from time to time. When we do, we will post the updated
            Terms on this page and revise the &ldquo;Effective&rdquo; date above. Updates apply prospectively
            to your continued use of the Site after the updated Terms take effect.
          </p>

          <h2 className="text-2xl font-bold mt-10">16. Contact</h2>
          <p>
            Questions about these Terms can be sent to{" "}
            <a className="underline" href="mailto:contact@forbeslogistix.com">contact@forbeslogistix.com</a>{" "}
            or by mail to Forbes Logistix, LLC, 3180 Utica Ave, Jackson, MS 39209.
          </p>
        </div>
      </article>
    </main>
  );
}
