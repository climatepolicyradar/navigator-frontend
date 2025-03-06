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
    title: "Automatic Detection of Climate Concepts in Documents",
    headContent: <Label>Beta</Label>,
    content: (
      <>
        <p>This new feature automatically detects climate concepts in documents.</p>

        <p>
          You can use it to find mentions of key climate concepts like sectors of the economy, targets, and policy instruments in any of the documents
          in our database.
        </p>

        <p>While the results should be more accurate than our existing search feature, accuracy is still not 100%.</p>
      </>
    ),
  },
  {
    title: "How should I use this feature?",
    content: (
      <>
        <p>Our automatically detected concepts make it easy to:</p>
        <ul>
          <li>Quickly find mentions of significant concepts in documents</li>
          <li>Understand what a document is primarily about</li>
        </ul>

        <p>However, our results aren't perfect. You should exercise caution when:</p>
        <ul>
          <li>Trying to precisely count the number of times a concept is mentioned</li>
          <li>Making comparisons between documents based on how often a concept appears</li>
        </ul>
      </>
    ),
  },
  {
    title: "Which concepts are currently available?",
    content: (
      <>
        <ul>
          <li>Sectors (e.g., Energy, Transport, Agriculture)</li>
          <li>Policy Instruments</li>
          <li>Targets</li>
          <li>Adaptation Measures</li>
          <li>Mitigation Strategies</li>
        </ul>
        <p>
          <ExternalLink url="https://climatepolicyradar.wikibase.cloud/wiki/Main_Page">View our full concept catalogue</ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "How do we automatically detect climate concepts in documents?",
    content: (
      <>
        <p>
          Each mention of a concept is the product of both human expertise and clever automation. Our in-house team of policy experts decides which
          concepts are most significant for understanding climate policy. We combine existing taxonomies, our expertise, and input from external
          experts to produce a catalogue of these concepts.
        </p>

        <p>
          Our data scientists and software engineers then use this data to build models that automatically detect concepts in text. These models vary
          in complexity, and we always evaluate a sample of results before releasing the full set.
        </p>
      </>
    ),
  },
  {
    title: "How accurate are the results?",
    content: (
      <>
        <p>
          We prioritize transparency, which means occasionally showing results we're uncertain about. While each model performs differently, a good
          rule of thumb is that if a classifier identifies a concept, it's correct in 9 out of 10 cases.
        </p>

        <p>
          Our classifiers are only as accurate as the text we can extract. If we can't accurately parse a document's text, we won't be able to find
          concepts within it.
        </p>
      </>
    ),
  },
  {
    title: "Can I download the results?",
    content: (
      <>
        <p>
          The full set of raw results is not yet publicly available. If you're doing high-impact work that might benefit from the complete dataset,
          you can request early access.
        </p>
      </>
    ),
  },
  {
    title: "What improvements are coming?",
    content: (
      <>
        <p>
          We plan to:
          <ul>
            <li>Add new concepts</li>
            <li>Improve the accuracy of existing classifiers</li>
            <li>Build new features using our structured data</li>
          </ul>
        </p>

        <p>
          <ExternalLink url="https://www.notion.so/Climate-Policy-Radar-Public-Product-Roadmap-250fdc6416824160b7b34aef4ef29e1c?pvs=21">
            Read our public product roadmap
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "What should I do if I spot a mistake?",
    content: (
      <>
        <p>
          If you notice a concept that's particularly important to your research or think a classifier is making crucial mistakes, please contact us
          at <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>.
        </p>
      </>
    ),
  },
];
