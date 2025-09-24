import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const PrivacyPolicy = () => {
  return (
    <Layout title="Privacy policy">
      <BreadCrumbs label={"Privacy policy"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="my-5">
                Climate Policy Radar CIC - Climate Case Chart Privacy Policy
              </Heading>
              <section>
                <Heading level={2} extraClasses="my-5">
                  What does this Privacy Policy cover?
                </Heading>
                <p>
                  The Climate Case Chart litigation databases are controlled, run and managed by Climate Policy Radar CIC, registered at Sustainable
                  Ventures, County Hall, 5th Floor, Westminster Bridge Road, London SE1 7PB, a Community Interest Company Limited by Guarantee
                  registered in England and Wales (Company number 13377442) hereafter referred to as “Climate Policy Radar UK”, “CPR UK”, “we”, “us”
                  or “our”. We understand that your privacy is important to you and that you care about how your Personal Data is used. We respect
                  your privacy and are committed to protecting your Personal Data.
                </p>
                <p>
                  This Privacy Policy applies to our collection, use and sharing of your Personal Data when making available our{" "}
                  <ExternalLink url="http://www.climatecasechart.com/">Climate Case Chart</ExternalLink> website (together, the “Site”), as well as
                  associated marketing activities and any other activities described in this Privacy Policy. Under the GDPR, we are a ‘controller’ for
                  the activities covered by this Privacy Policy.
                </p>
                <p>
                  For reference, when we refer to “Personal Data”, we mean any information which identifies you as an individual or which otherwise
                  renders you identifiable. When we use the term “GDPR”, we are referring to the so-called UK General Data Protection Regulation.
                </p>

                <Heading level={2} extraClasses="my-5">
                  What Personal Data we collect
                </Heading>
                <p>The Personal Data we typically collect about you is outlined in the table below.</p>
                <table>
                  <thead>
                    <tr>
                      <th>Category of Personal Data</th>
                      <th>What this means</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Contact Data</td>
                      <td>
                        Your full name and email address.
                        <br />
                        The organisation you work for or represent (should you provide it to us).
                      </td>
                    </tr>
                    <tr>
                      <td>Case Record Data</td>
                      <td>
                        Information extracted from publicly available court documents and coverage of legal proceedings.
                        <br />
                        This includes party information such as names, job titles and locations of plaintiffs/claimants, defendants, legal
                        representatives, and expert witnesses. It also includes information about the cases, including the jurisdiction, court name,
                        case number, filing date, decision date, and procedural status, and any other information found within the court records and
                        news summaries included on the Site.
                      </td>
                    </tr>
                    <tr>
                      <td>Technical Data</td>
                      <td>
                        Internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions,
                        operating system and platform and other technology on the devices you use to access the Site.
                        <br />
                        <em>
                          As a note: some of this information may be collected via the technologies described in our{" "}
                          <LinkWithQuery href="/cookie-policy">Cookie Policy.</LinkWithQuery>
                        </em>
                      </td>
                    </tr>
                    <tr>
                      <td>Communications Data</td>
                      <td>
                        Information you exchange with us in your communications with us, plus your preferences relating to our emails and other
                        communications (e.g., whether you have opted in to receive marketing communications), as well as your interactions with our
                        communications (e.g., whether you open and/or forward emails).
                        <br />
                        This includes any Personal Data you provide in any free-text ‘message’ fields via which you can communicate with us on the
                        Site (e.g., using any ‘Contact’ functionality or similar).
                        <br />
                        <em>
                          As a note: some of this information may be collected via the technologies described in our{" "}
                          <LinkWithQuery href="/cookie-policy">Cookie Policy.</LinkWithQuery>.
                        </em>
                      </td>
                    </tr>
                    <tr>
                      <td>Analytics Data</td>
                      <td>
                        Statistical demographic or event-based analytics based on your use of the Site.
                        <br />
                        <em>
                          As a note: some of this information may be collected via the technologies described in our{" "}
                          <LinkWithQuery href="/cookie-policy">Cookie Policy.</LinkWithQuery>.
                        </em>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Heading level={2} extraClasses="my-5">
                  How we use your Personal Data and why
                </Heading>
                <p>
                  We may use your Personal Data for the purposes listed below and any associated sharing of Personal Data (see the section called How
                  we share your Personal Data, below) now or in the future.
                </p>
                <p>
                  In respect of each of the purposes for which we use your Personal Data, the GDPR requires us to establish a ‘legal basis’ for that
                  use. Our legal bases for processing your Personal Data described in this Privacy Policy are listed below.
                </p>
                <ul>
                  <li>
                    Where we need to perform a contract we have entered into with you or are about to enter into with you (“Contractual Necessity”).
                  </li>
                  <li>
                    Where it is necessary for our pursuit of legitimate interests and your interests and fundamental rights do not override those
                    interests (“Legitimate Interests”).
                  </li>
                  <li>Where we need to comply with a legal or regulatory obligation (“Compliance with Law”).</li>
                  <li>Where we have your specific consent to carry out the processing for the purpose in question (“Consent”).</li>
                </ul>

                <Heading level={3} extraClasses="my-5">
                  SITE OPERATION
                </Heading>
                <p>
                  <strong>Purpose:</strong> To provide, operate and secure the Site.
                  <br />
                  <strong>Categories of Personal Data:</strong> Contact Data, Technical Data
                  <br />
                  <strong>Legal basis:</strong> Contractual Necessity. Legitimate Interests. We have a legitimate interest in ensuring the ongoing
                  security and proper operation of our Site, our business and associated IT services, systems and networks.
                </p>

                <Heading level={3} extraClasses="my-5">
                  ADMINISTERING HOSTING OF DATABASE
                </Heading>
                <p>
                  <strong>Purpose:</strong> To curate and publish publicly available climate litigation records in a structured, searchable format.
                  This supports transparency, legal research, and informed public engagement with climate-related legal developments.
                  <br />
                  <strong>Categories of Personal Data:</strong> Case Record Data
                  <br />
                  <strong>Legal basis:</strong> Legitimate Interests. We have a legitimate interest in promoting transparency and public access to
                  climate litigation data to support legal research, accountability, and informed public discourse.
                </p>

                <Heading level={3} extraClasses="my-5">
                  DEALING WITH YOUR CONTACTS WITH US
                </Heading>
                <p>
                  <strong>Purpose:</strong> To deal with any contact you might make with us using any 'Contact’ or similar function on the Site or via
                  any other method of communication (e.g., by email), as well as any issues arising from such contacts (including replying to you).
                  <br />
                  <strong>Categories of Personal Data:</strong> Contact Data, Technical Data, Communications Data
                  <br />
                  <strong>Legal basis:</strong> Legitimate Interests. We have a legitimate interest in communicating with you and dealing with your
                  contacts with us, as well as handling any issues that may arise from such contacts.
                </p>

                <Heading level={3} extraClasses="my-5">
                  MARKETING
                </Heading>
                <p>
                  <strong>Purpose:</strong> To communicate with you (including to provide updates on our activities, the Site and any other products
                  or services).
                  <br />
                  <strong>Categories of Personal Data:</strong> Contact Data, Communications Data
                  <br />
                  <strong>Legal basis:</strong> Consent. Applicable in circumstances or in jurisdictions where consent is required under applicable
                  data protection laws to the sending of any given marketing communications.
                </p>

                <Heading level={3} extraClasses="my-5">
                  IMPROVEMENT AND ANALYTICS
                </Heading>
                <p>
                  <strong>Purpose:</strong> To analyse your usage of our Site, understand user activity, and improve the Site.
                  <br />
                  <strong>Categories of Personal Data:</strong> Technical Data, Analytics Data
                  <br />
                  <strong>Legal basis:</strong> Legitimate Interests. We have a recognised legitimate interest in improving our Site. Consent.
                  Applicable in respect of any optional cookies used for this purpose and associated processing.
                </p>

                <Heading level={3} extraClasses="my-5">
                  PRIVACY PROTECTIVE STEPS
                </Heading>
                <p>
                  <strong>Purpose:</strong> We may aggregate, deidentify or anonymise certain Personal Data for our legitimate business purposes. If
                  we aggregate, deidentify or anonymise your Personal Data such that it is no longer Personal Data (i.e., it can no longer be
                  associated with you), we may use this information as non-Personal Data indefinitely without further notice to you.
                  <br />
                  <strong>Categories of Personal Data:</strong> Any and all data types relevant in the circumstances
                  <br />
                  <strong>Legal basis:</strong> Legitimate Interests. We have a legitimate interest in taking steps to ensure that how we use Personal
                  Data is as unintrusive on your privacy as possible. We believe it is also in your interests that we take these privacy protective
                  steps.
                </p>

                <Heading level={3} extraClasses="my-5">
                  COMPLIANCE AND PROTECTION
                </Heading>
                <p>
                  <strong>Purpose:</strong> To comply with applicable laws, lawful requests, and legal process (such as to respond to disclosure
                  orders or similar, as well as investigations or requests from government authorities); to protect our, your or others’ rights,
                  privacy, safety or property (including by making and defending legal claims); to audit our internal processes for compliance with
                  legal and contractual requirements or our internal policies; to enforce the terms of agreements that govern access to the Site; and
                  to prevent, identify, investigate and deter fraudulent, harmful, unauthorised, unethical or illegal activity, including cyberattacks
                  and identity theft.
                  <br />
                  <strong>Categories of Personal Data:</strong> Any and all data types relevant in the circumstances
                  <br />
                  <strong>Legal basis:</strong> Compliance with Law. Legitimate Interests. Where Compliance with Law is not applicable, we and any
                  relevant third parties have a legitimate interest in participating in, supporting, and following legal process and requests,
                  including through co-operation with authorities. We and any relevant third parties may also have a legitimate interest of ensuring
                  the protection, maintenance, and enforcement of our and their rights, property, and/or safety.
                </p>

                <Heading level={3} extraClasses="my-5">
                  CORPORATE EVENTS
                </Heading>
                <p>
                  <strong>Purpose:</strong> To facilitate or carry out any corporate events (including providing Personal Data to allow third parties
                  to investigate – and, where relevant, to continue to operate – all or relevant part(s) of our operations as a not-for-profit
                  community interest company).
                  <br />
                  <strong>Categories of Personal Data:</strong> Any and all data types relevant in the circumstances
                  <br />
                  <strong>Legal basis:</strong> Legitimate interests. We and any relevant third parties have a legitimate interest in us providing
                  information to certain third parties who are involved in or assisting with actual or prospective corporate event for these purposes.
                </p>

                <Heading level={3} extraClasses="my-5">
                  FURTHER USES
                </Heading>
                <p>
                  <strong>Purpose:</strong> We may use your Personal Data for further uses beyond those described above, we only do this with your
                  consent or whether those further purposes are compatible with the initial purpose for which Personal Data was collected.
                  <br />
                  <strong>Categories of Personal Data:</strong> Any and all data types relevant in the circumstances
                  <br />
                  <strong>Legal basis:</strong> The original legal basis, for ‘compatible further uses’. Consent. Applicable for ‘non-compatible
                  further uses’.
                </p>

                <Heading level={2} extraClasses="my-5">
                  How we use cookies &amp; other similar technologies
                </Heading>
                <p>
                  We also use cookies and other similar technologies on our Site. For further information on how and why we use such technologies,
                  please see our <LinkWithQuery href="/cookie-policy">Cookie Policy</LinkWithQuery>.
                </p>

                <Heading level={2} extraClasses="my-5">
                  Your rights
                </Heading>
                <Heading level={3} extraClasses="my-5">
                  What are your rights?
                </Heading>
                <p>
                  The GDPR may give you certain rights regarding your Personal Data and how we process it in certain circumstances, meaning you may
                  ask us to take the following actions in relation to your Personal Data:
                </p>
                <ul>
                  <li>
                    <strong>Access.</strong> Provide you with information about our processing of your Personal Data and give you access to your
                    Personal Data.
                  </li>
                  <li>
                    <strong>Correct.</strong> Update or correct inaccuracies in your Personal Data.
                  </li>
                  <li>
                    <strong>Delete.</strong> Delete your Personal Data where there is no good reason for us continuing to process it - you also have
                    the right to ask us to delete or remove your Personal Data where you have exercised your right to object to processing (see
                    below).
                  </li>
                  <li>
                    <strong>Transfer.</strong> Transfer to you or a third party of your choice a machine-readable copy of your Personal Data which you
                    have provided to us.
                  </li>
                  <li>
                    <strong>Restrict.</strong> Restrict the processing of your Personal Data, for example if you want us to establish its accuracy or
                    the reason for processing it.
                  </li>
                  <li>
                    <strong>Object.</strong> Object to our processing of your Personal Data where we are relying on Legitimate Interests – you also
                    have the right to object where we are processing your Personal Data for direct marketing purposes.
                  </li>
                  <li>
                    <strong>Withdraw Consent.</strong> When we use your Personal Data based on your consent, you have the right to withdraw that
                    consent at any time.
                  </li>
                </ul>

                <Heading level={3} extraClasses="my-5">
                  Exercising your rights
                </Heading>
                <p>To exercise any of the rights described above, please contact us using the contact details shown below.</p>
                <p>
                  We may request specific information from you to help us confirm your identity and process your request. Whether or not we are
                  required to fulfil any request you make will depend on a number of factors (e.g., why and how we are processing your Personal Data),
                  if we reject any request you may make (whether in whole or in part) we will let you know our grounds for doing so at the time,
                  subject to any legal restrictions. Typically, you will not have to pay a fee to exercise your rights; however, we may charge a
                  reasonable fee if your request is clearly unfounded, repetitive or excessive.
                </p>

                <Heading level={3} extraClasses="my-5">
                  Timing
                </Heading>
                <p>
                  We try to respond to all legitimate requests within a month of receipt. It may take us longer than a month if your request is
                  particularly complex or if you have made a number of requests; in this case, we will notify you and keep you updated.
                </p>

                <Heading level={3} extraClasses="my-5">
                  Exemptions
                </Heading>
                <p>
                  In some circumstances, there are exemptions and restrictions that can be applied to exempt or qualify the right of individuals to
                  exercise their rights. We process personal data for archiving purposes in the public interest and for historical research and
                  statistical purposes, which may mean that we can rely on such exemptions in relation to how we process your Personal Data.
                </p>

                <Heading level={2} extraClasses="my-5">
                  How we share your Personal Data
                </Heading>
                <p>
                  We may share your Personal Data with the following categories of recipient and as otherwise described in this Privacy Policy, in
                  other applicable notices, or at the time of collection.
                </p>
                <ul>
                  <li>
                    <strong>Affiliates.</strong> Our subsidiaries and affiliates (from time to time).
                  </li>
                  <li>
                    <strong>Service providers.</strong> Third parties that provide services on our behalf or help us operate parts of the Site or our
                    business (such as our hosting providers, information technology/security providers, customer support, email delivery, consumer
                    research and website analytics).
                  </li>
                  <li>
                    <strong>Professional advisors.</strong> Professional advisors, such as lawyers, auditors, bankers and insurers, where necessary in
                    the course of the professional services that they render to us.
                  </li>
                  <li>
                    <strong>Authorities and others.</strong> Law enforcement, government authorities, and private parties, as we believe in good faith
                    to be necessary or appropriate in the circumstances.
                  </li>
                  <li>
                    <strong>Parties to corporate events.</strong> We may disclose Personal Data in the context of actual or prospective corporate
                    events in relation to Climate Policy Radar UK’s actions undertaken as a community interest company (e.g., investments in Climate
                    Policy Radar UK, financing of Climate Policy Radar UK, or the sale, transfer or merger of all or part of our business, assets or
                    shares), for example, we may need to share certain Personal Data with prospective counterparties and their advisers. We may also
                    disclose your Personal Data to an acquirer, successor, or assignee of Climate Policy Radar UK as part of any acquisition, sale of
                    assets, or similar transaction, and/or in the event of an insolvency, bankruptcy, or receivership in which Personal Data is
                    transferred to one or more third parties as one of our business assets.
                  </li>
                </ul>

                <Heading level={2} extraClasses="my-5">
                  Transfers outside Europe
                </Heading>
                <p>We do not share your Personal Data with third parties who are based outside the UK and European Economic Area (“Europe”).</p>
                <p>
                  This may change in the future. If we share your Personal Data with third parties who are based outside Europe, we will try to ensure
                  a similar degree of protection is afforded to your Personal Data by implementing compliant transfer mechanisms.
                </p>

                <Heading level={2} extraClasses="my-5">
                  Security
                </Heading>
                <p>
                  We employ technical, organisational and physical safeguards designed to protect your Personal Data (including to prevent your
                  Personal Data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed). For example, we limit
                  access to your Personal Data to only those employees and other staff who have a business need to have such access. All such people
                  are subject to a duty of confidentiality.
                </p>
                <p>
                  In addition, we have put in place procedures to deal with potential personal data breaches affecting your Personal Data. In the
                  event of any such breach, we have systems in place to notify and work with applicable regulators where required. In addition, in
                  certain circumstances (e.g., where we are legally required to do so) we may notify you of more serious personal data breaches
                  affecting your Personal Data.
                </p>
                <p>
                  Please note that despite the efforts described above, as our Site is hosted electronically, we can make no guarantees as to the
                  security or privacy of your information.
                </p>

                <Heading level={2} extraClasses="my-5">
                  Retention
                </Heading>
                <p>
                  We are committed to only keeping your Personal Data for so long as we reasonably need to use it for the purposes set out above. This
                  general rule applies unless a longer retention period is required by law.
                </p>
                <p>
                  To determine the appropriate retention period for Personal Data, we consider the amount, nature, and sensitivity of the Personal
                  Data, the potential risk of harm from unauthorised use or disclosure of your Personal Data, the purposes for which we process your
                  Personal Data and whether we can achieve those purposes through other means, and the applicable legal requirements.
                </p>
                <p>
                  When we no longer require the Personal Data that we have collected about you, we will either delete or anonymise it or, if this is
                  not possible (for example, because your Personal Data has been stored in backup archives), then we will securely store your Personal
                  Data and isolate it from any further processing until deletion is possible.
                </p>

                <Heading level={2} extraClasses="my-5">
                  Complaints
                </Heading>
                <p>
                  If you would like to make a complaint regarding this Privacy Policy or our practices in relation to your Personal Data, please
                  contact us using the contact details shown below. We will reply to your complaint as soon as we can.
                </p>
                <p>
                  If you feel that your complaint has not been adequately addressed, please note that data protection laws give you the right to
                  contact the regulator directly.
                </p>
                <p>
                  Contact information for the UK data protection regulator can be found here:{" "}
                  <ExternalLink url="https://ico.org.uk/make-a-complaint/">https://ico.org.uk/make-a-complaint/</ExternalLink>
                </p>

                <Heading level={2} extraClasses="my-5">
                  Contact details
                </Heading>
                <p>
                  <strong>Contact Climate Policy Radar CIC:</strong>
                </p>
                <p>
                  You can contact us directly using the following contact details:
                  <br />
                  <strong>Address:</strong>
                  <br />
                  Climate Policy Radar
                  <br />
                  Sustainable Ventures
                  <br />
                  County Hall
                  <br />
                  5th Floor Westminster Bridge Road
                  <br />
                  London, SE1 7PB
                  <br />
                  <strong>Email:</strong> <ExternalLink url="mailto:info@climatepolicyradar.org">info@climatepolicyradar.org</ExternalLink>
                </p>

                <Heading level={2} extraClasses="my-5">
                  Updates
                </Heading>
                <p>
                  Any changes will be made available here (or another page we notify to you at a later date) and where applicable we might also notify
                  you via email and/or in our Site.
                </p>
                <p className="mt-8 text-sm text-text-tertiary">LAST UPDATE: 23rd September 2025</p>
              </section>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
