import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { EN_DASH } from "@/constants/chars";
import { TFAQ } from "@/types";

export const PLATFORM_FAQS: TFAQ[] = [
  {
    title: "How does the full text search feature work?",
    content: (
      <>
        <p>
          When you do a keyword search or use one of our 100+ Topic classifiers, we highlight relevant phrases in the text of documents to make it
          easy for you to find what you are looking for.
        </p>
        <p>Our text search will look for the keywords in your query in any order, and in any form (e.g. singular, plural).</p>
        <p>
          Our 100+ Topic classifiers have been curated by domain experts, and automatically highlight keywords related to your topic. For example,
          'forestry sector' returns results for 'tree nurseries', 'woodland management', and 'wood industry'.
        </p>
      </>
    ),
  },
  {
    title: "Why do some Topics not highlight specific text in the document?",
    content: (
      <>
        <p>
          Some of our Topics are trained using machine learning. Our current machine learning models are only able to detect whether the entire
          passage is relevant to a topic. This means that it is not currently possible to highlight specific passages of text in these cases.
        </p>
        <p>
          Highlighting is not available on the following Topics: Target, Emissions reduction target, Net-zero target, Finance flow, Climate justice,
          Procedural justice, Distributive justice.
        </p>
      </>
    ),
  },
  {
    title: "How do I filter my results?",
    content: (
      <p>
        Use the filters under the search bar to refine your search. You can quickly filter by Topic, geography, and date, or access the full range of
        filters specific to the document type you're looking for within the 'Category' filter panel. Our Topic filter also orders results by relevance
        and highlights relevant parts of the text in the documents.
      </p>
    ),
  },
  {
    title: "How do I download search results?",
    content: (
      <>
        <p>
          You can download a csv file for 'this search' or the 'whole database' from the top right of the search results page. A csv file for 'this
          search' will contain all documents related to the top ~500 entries returned by your search. All of our exports update daily, so you'll
          always get the latest available information in your download.
        </p>
        <p>
          To download the whole database as a csv file, please{" "}
          <PageLink external href="https://form.jotform.com/250202141318339">
            fill out this form
          </PageLink>
          .
        </p>
      </>
    ),
  },
  {
    title: "Can I access your data via API or MCP?",
    content: (
      <p>
        Yes, you can use our API and MCP capabilities to bring the data into your own research, workflows, or products. Get in touch for early access:
        partners@climatepolicyradar.org
      </p>
    ),
  },
  {
    title: "Why can't I see matches in some documents?",
    content: (
      <>
        <p>
          A very small number of our documents aren't yet machine-readable, which means our tool can't extract their text and make it searchable. When
          this happens, it will look for matches to your search term in the document's title and summary instead. If your search term only appears in
          the body text, you won't get a match.
        </p>
        <p>We are working continuously on ways to improve text quality and search, across all our documents.</p>
      </>
    ),
  },
  {
    title: "Why am I being redirected to an external site for some documents?",
    content: (
      <p>
        If a document is not yet machine-readable, and therefore not searchable, matches will relate to a document's title and summary. To access the
        full text you'll be taken to the document's source.
      </p>
    ),
  },
  {
    title: "How do we assign dates to documents?",
    content: (
      <p>
        Every document in our database contains metadata of the date it was published. This does not refer to when it was added to or amended in our
        database. It is the date, captured from the document itself, of when that document was released by its publisher. The earliest major
        publication date is the one displayed on the search result.
      </p>
    ),
  },
  {
    title: "Which date does sorting by 'most recent' sort by?",
    content: (
      <p>
        'Most recent' sorts by when an item first came into being {EN_DASH} the date a law was passed, a report published, a project approved, or a
        case filed.
      </p>
    ),
  },
  {
    title: "How do I link to one of your documents?",
    content: (
      <p>
        The best way to share documents is by using the URL of the page. You can also share documents by downloading and then attaching them to an
        email. Click the 'download' button when viewing the document on our tool,click the three horizontal dots on the top right of a document view,
        and download from there.
      </p>
    ),
  },
  {
    title: "How are the documents translated to English?",
    content: (
      <p>
        Documents are translated to English using Google's Cloud Translation API. Auto-translation does not always capture full meaning and nuance
        from the original language, but we hope it is a useful first step to making documents available to more people.
      </p>
    ),
  },
  {
    title: "How do I report bugs?",
    content: (
      <p>
        Get in touch with the Climate Policy Radar team via email at support@climatepolicyradar.org. We appreciate you taking the time to do this!
      </p>
    ),
  },
  {
    title: "What are the limitations of your search?",
    content: (
      <ul>
        <li>
          Document access: The database is not exhaustive and we are continuously looking for and adding new documents, from our current data
          partners, and new ones from trusted institutions. If you're interested in becoming a data partner, please get in touch with:
          programmes@climatepolicyradar.org
        </li>
        <li>Text quality: A tiny proportion of documents aren't currently machine-readable: we can't yet extract the text from them.</li>
        <li>
          Translations: Approximately 25% of our documents are translated using Google Translate. Auto-translation does not always capture full
          meaning and nuance from the original language.
        </li>
        <li>
          Search accuracy: Domain experts have evaluated our text search and Topic filters and they are of measurably high accuracy. However, no
          search tool is 100% accurate, and you may see irrelevant results or miss relevant ones.
        </li>
      </ul>
    ),
  },
];

export const TOPICS_FAQS: TFAQ[] = [
  {
    title: "Searching Topics within documents",
    content: (
      <>
        <p>
          When you search using a Topic, rather than returning results based on a keyword match alone, you're searching with expert knowledge built
          in: related terms, regional variations, and contextual nuance, drawn from in-depth research, questioning, and collaboration.
        </p>
        <p>
          You can filter by any of our Topics, including Targets, Renewable energy, and Policy instruments. Documents most relevant to this Topic will
          appear at the top of search results, and relevant passages will be highlighted in each one.
        </p>
        <p>
          This makes a Topic search significantly more precise than a standard keyword search - though, as with any search tool, it won't catch every
          relevant passage with perfect accuracy.
        </p>
      </>
    ),
  },
  {
    title: "How should I use this feature?",
    content: (
      <>
        <p>The Topic filters help you:</p>
        <ul>
          <li>Quickly locate mentions of key Topics in documents to create a richer and more useful search.</li>
          <li>Understand the primary focus of a document.</li>
        </ul>
        <p>However, results are not 100% accurate. Be cautious when:</p>
        <ul>
          <li>Counting how often a Topic appears in a document.</li>
          <li>Comparing documents based on Topic frequency.</li>
        </ul>
      </>
    ),
  },
  {
    title: "What happens if I select multiple Topics or add a text search?",
    content: (
      <>
        <p>
          When you select more than one Topic, or combine a Topic with a text search, the tool looks for documents that contain all of the selected
          Topics and/or keywords, anywhere in the document. Results are ordered by relevancy, with the most relevant documents at the top. Documents
          near the bottom of the list will likely be of low relevance, often because the Topics or keywords are found far apart in the text, rather
          than appearing close together or in the same section.
        </p>
        <p>
          When you search inside a document, results are ordered by relevancy. Passages of text containing the most Topics and/or keywords will appear
          at the top. Passages at the bottom of the list will likely be of lower relevance, as they will only contain one of the Topics or keywords.
        </p>
        <p>
          We're working on improving this feature to give users greater control over how Topics and keywords can be combined. For example, by allowing
          users to have greater control over the AND/OR logic between queries, and whether to more strictly look for co-occurrence of queries within
          the same or neighbouring text passage.
        </p>
      </>
    ),
  },
  {
    title: "Which Topics are currently available?",
    content: (
      <>
        <p>Examples include:</p>
        <ul>
          <li>
            <strong>Policy instruments:</strong> e.g. bans, subsidies, early warning systems, targets.
          </li>
          <li>
            <strong>Risk:</strong> e.g. drought, heavy precipitation, hot extremes.
          </li>
          <li>
            <strong>Climate finance:</strong> e.g.climate funds, finance flows.
          </li>
          <li>
            <strong>Greenhouse gases:</strong> e.g. CO₂, methane.
          </li>
        </ul>
        <p>
          You can see more in our{" "}
          <PageLink external href="https://climatepolicyradar.wikibase.cloud/wiki/Main_Page">
            concept store
          </PageLink>
          .
        </p>
      </>
    ),
  },
  {
    title: "How do we select and build a new Topic?",
    content: (
      <>
        <p>Each detected Topic is based on a combination of expert knowledge and automated classifier models:</p>
        <ul>
          <li>
            <strong>Expert-driven Topic selection:</strong> our policy specialists identify the most important Topics by looking at existing
            taxonomies and consulting external experts. We maintain a catalogue of these Topics{" "}
            <PageLink external href="https://climatepolicyradar.wikibase.cloud/wiki/Main_Page">
              in our concept store
            </PageLink>
            .
          </li>
          <li>
            <strong>Automated detection:</strong> our data scientists and software engineers build models to find these Topics in text, continuously
            refining them based on human feedback.
          </li>
          <li>
            <strong>Quality control:</strong> before public release, we manually review a sample of results to ensure accuracy.
          </li>
          <li>
            Read our Topics{" "}
            <PageLink external href="https://github.com/climatepolicyradar/methodology/blob/main/knowledge-graph-methodology.md">
              methodology
            </PageLink>{" "}
            for more information.
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
            On average, if a classifier highlights a Topic, it is correct in <strong>8 out of 10 cases</strong>. Accuracy varies by Topic and document
            quality. For example, if text extraction fails, we cannot accurately detect Topics.
          </li>
          <li>We are actively improving accuracy by refining our models and ensuring consistency across different document types and languages.</li>
          <li>
            View the{" "}
            <PageLink external href="https://docs.google.com/spreadsheets/d/1jMdB9nSnKf0RomZ6wAyGdOxEbXOIlHNVOgB8vPGyMXM/edit?gid=0#gid=0">
              performance metrics
            </PageLink>{" "}
            for our live classifiers for more information.
          </li>
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
          <li>We deliberately work with targeted and efficient domain-specific models, rather than large general-purpose ones.</li>
          <li>Most of our models rely on efficient keyword-based detection rather than resource-heavy generation.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Can I download the Topic results?",
    content: (
      <p>
        The full Topics dataset is not yet publicly available. If you're conducting high-impact research, you can{" "}
        <PageLink external href="partners@climatepolicyradar.org">
          request early access
        </PageLink>
        .
      </p>
    ),
  },
  {
    title: "What improvements are coming?",
    content: (
      <>
        <p>We are expanding our concept database, improving accuracy, and developing new structured data features.</p>
        <p>
          See our{" "}
          <PageLink external href="https://www.notion.so/Climate-Policy-Radar-Public-Product-Roadmap-250fdc6416824160b7b34aef4ef29e1c?pvs=21">
            public product roadmap
          </PageLink>{" "}
          for more details.
        </p>
      </>
    ),
  },
  {
    title: "What should I do if I spot a mistake?",
    content: (
      <p>
        If you believe a Topic is missing or misclassified,{" "}
        <PageLink external href="https://eu.jotform.com/250402253775352">
          contact us
        </PageLink>
        . Your feedback helps us improve.
      </p>
    ),
  },
];
