import { ExternalLink } from "@components/ExternalLink";
import { Label } from "@components/labels/Label";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
  headContent?: JSX.Element;
};

export const CONCEPTS_FAQS: TFAQ[] = [
  {
    id: "concepts",
    title: "Automatic Detection of key concepts in documents",
    headContent: <Label>Beta</Label>,
    content: (
      <>
        <p>
          This new feature automatically identifies mentions of key concepts in documents, helping you quickly find where important topics like
          economic sectors, targets, and climate finance instruments appear in our database.
        </p>

        <p>While this feature is more precise than our standard search, accuracy is not 100%.</p>
      </>
    ),
  },
  {
    title: "How should I use this feature?",
    content: (
      <>
        <p>Automatically detected concepts help you:</p>
        <ul>
          <li>Quickly locate mentions of key topics in documents.</li>
          <li>Understand the primary focus of a document.</li>
        </ul>

        <p>However, results are not 100% accurate. Be cautious when:</p>
        <ul>
          <li>Counting how often a concept appears in a document.</li>
          <li>Comparing documents based on concept frequency.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Which concepts are currently available?",
    content: (
      <>
        <p>Examples include:</p>
        <ul>
          <li>
            <b>Economic sectors</b>: e.g. energy, transport, construction.
          </li>
          <li>
            <b>Policy instruments</b>: e.g. bans, subsidies, early warning systems, targets.
          </li>
          <li>
            <b>Climate finance</b>: e.g. insurance, climate funds.
          </li>
          <li>
            <b>Greenhouse gases</b>: e.g. CO₂, methane, carbon tetrachloride.
          </li>
        </ul>
        <p>
          You can see more in our <ExternalLink url="https://climatepolicyradar.wikibase.cloud/wiki/Main_Page">concept store</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "How do we automatically detect climate concepts in documents?",
    content: (
      <>
        <p>Each detected concept is based on a combination of expert knowledge and automated models:</p>
        <ul>
          <li>
            <b>Expert-driven concept selection</b>: our policy specialists identify the most important concepts by looking at existing taxonomies and
            consulting external experts. We maintain a catalogue of these concepts in{" "}
            <ExternalLink url="https://climatepolicyradar.wikibase.cloud/wiki/Main_Page">our concept store</ExternalLink>.
          </li>
          <li>
            <b>Automated detection</b>: our data scientists and software engineers build models to find these concepts in text, continuously refining
            them based on human feedback.
          </li>
          <li>
            <b>Quality control</b>: before public release, we manually review a sample of results to ensure accuracy.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How accurate are the results?",
    content: (
      <>
        <p>Our classifiers are designed to prioritise transparency, meaning we sometimes display uncertain results rather than hide them.</p>

        <ul>
          <li>
            On average, if a classifier highlights a concept, it is correct in <b>9 out of 10 cases</b>.
          </li>
          <li>Accuracy varies by concept and document quality. For example, if text extraction fails, we cannot accurately detect concepts.</li>
          <li>We are actively improving accuracy by refining our models and ensuring consistency across different document types and languages.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Should I be concerned about the climate impact of this feature?",
    content: (
      <>
        <p>We prioritise sustainability in our technology choices:</p>

        <ul>
          <li>When two models produce similar results, we use the simpler, less energy-intensive option.</li>
          <li>Most of our models rely on efficient keyword-based detection rather than resource-heavy AI.</li>
        </ul>

        <p>Nevertheless, we’re working to measure, minimise, and report on the precise energy intensity of our data science work.</p>
      </>
    ),
  },
  {
    title: "Can I download the results?",
    content: (
      <>
        <p>
          The full dataset is not yet publicly available. If you're conducting high-impact research, you can{" "}
          <ExternalLink url="mailto:alan@climatepolicyradar.org">request early access</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "What improvements are coming?",
    content: (
      <>
        <p>We are expanding our concept database, improving accuracy, and developing new structured data features.</p>

        <p>
          See our
          <ExternalLink url="https://www.notion.so/Climate-Policy-Radar-Public-Product-Roadmap-250fdc6416824160b7b34aef4ef29e1c?pvs=21">
            public product roadmap
          </ExternalLink>
          for more details.
        </p>
      </>
    ),
  },
  {
    title: "What should I do if I spot a mistake?",
    content: (
      <>
        <p>
          If you believe a concept is missing or misclassified, <ExternalLink url="https://eu.jotform.com/250402253775352">contact us</ExternalLink>.
          Your feedback helps us improve.
        </p>
      </>
    ),
  },
];
