export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-purple mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>

      <div className="prose prose-sm max-w-none space-y-8 text-gray-700">

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Who we are</h2>
          <p>
            This survey is operated by Women's Health World ("we", "us", "our"). Our main website is{' '}
            <a href="https://womenshealth.world" className="text-brand-purple underline">womenshealth.world</a>.
            If you have any questions about this policy, please contact us at{' '}
            <a href="mailto:hello@womenshealth.world" className="text-brand-purple underline">
              hello@womenshealth.world
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">What data we collect</h2>
          <p>We collect two separate types of data:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Survey responses</strong> — your answers to the Pulse Check questions, together with your
              age range and country. These are stored <strong>anonymously</strong>. We do not record your IP
              address alongside your answers, and we cannot identify you from your responses alone.
            </li>
            <li>
              <strong>Email address</strong> (optional) — if you choose to sign up for our newsletter,
              we store your email address <strong>separately</strong> from your survey responses.
              There is no way to link your email to your answers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How we use your data</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Survey responses are aggregated and analysed to produce insights about women's health and wellbeing.</li>
            <li>Aggregated (not individual) findings are shared publicly and with potential research partners and sponsors.</li>
            <li>Email addresses are used only to send you our newsletter and survey findings. We will not email you for any other purpose without your permission.</li>
            <li>We do not sell, rent, or trade your data with third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Legal basis for processing (GDPR)</h2>
          <p>
            For respondents in the UK and European Economic Area, our legal basis for processing your
            survey answers is <strong>consent</strong> — you provide this by ticking the consent box
            on the survey start page. For newsletter subscribers, our legal basis is also
            <strong> consent</strong> — which you can withdraw at any time by unsubscribing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Data storage and security</h2>
          <p>
            Survey responses are stored in a secure cloud database provided by Supabase
            (hosted on AWS in the EU). Email addresses are held by Beehiiv, our newsletter platform.
            Both providers maintain industry-standard security measures.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How long we keep your data</h2>
          <p>
            Anonymous survey responses are retained indefinitely for research purposes. Email addresses
            are held until you unsubscribe. You may request deletion of your email at any time by
            contacting us or clicking unsubscribe in any newsletter.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your rights</h2>
          <p>Depending on where you live, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your personal data</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p className="mt-2">
            Because survey responses are anonymous, we are unable to identify or retrieve a specific
            individual's answers. For email data, contact us at{' '}
            <a href="mailto:hello@womenshealth.world" className="text-brand-purple underline">
              hello@womenshealth.world
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Cookies</h2>
          <p>
            We use only a single session cookie to prevent accidental duplicate survey submissions.
            This cookie is not used for tracking or advertising purposes, contains no personal data,
            and is deleted when you close your browser.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Children</h2>
          <p>
            This survey is open to all ages, but we do not actively target or promote it to children
            under 13. We do not knowingly collect personal data from children. If you believe a child
            has provided us with their email address, please contact us and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page shows when
            it was last revised. Continued use of the survey after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

      </div>
    </div>
  )
}
