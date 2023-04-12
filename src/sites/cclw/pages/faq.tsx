import { AccordianItem } from "@cclw/components/AccordianItem";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";

const FAQ = () => {
  return (
    <section>
      <div className="text-content px-4 container mb-12">
        <h1 className="my-8">How to use this resource</h1>
        <p>Find information to help you get started with our resource.</p>

        <h2 className="my-6">FAQs</h2>
        <AccordianItem title="Your site looks different, what's changed?" startOpen={true}>
          <>
            <p>
              We’ve been working with our partners, <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar</ExternalLink>, to
              redesign and upgrade our legislation database, bringing you a better experience and new features to help you explore and interact with
              our data. You can now:
            </p>
            <ul>
              <li>
                Conduct searches that return results based on ‘reading’ the whole text of documents in the database (previously, search functionality
                was limited to returning results based on document titles, summaries, and keywords assigned by our researchers).This improves the
                comprehensiveness of your search results.
              </li>
              <li>
                More easily find relevant information. Our new search function looks for similar and related phrases to your query, known as ‘semantic
                search’. Previously, results were based on finding exact matches to your query within document titles, summaries, and document
                metadata (keywords).
              </li>
              <li>
                See where a search term or relevant text appears in a document, with relevant passages of text automatically highlighted in yellow to
                help you identify important information more quickly.
              </li>
            </ul>
            <p>
              More features are coming soon. <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/mailing-list/">Stay updated</ExternalLink> to
              find out when we launch them.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="What is Climate Change Laws of the World?">
          <>
            <p>
              Climate Change Laws of the World is a database covering national-level climate change legislation and policies from around the world.
              These laws and policies address policy areas directly relevant to climate change mitigation, adaptation, loss and damage or disaster
              risk management. More specifically, the database includes laws and policies that establish rules and procedures related to the
              transition to low-carbon economies, enhancing adaptation capabilities, and disaster risk management. For more information on how we
              define the scope of what we include in the dataset,{" "}
              <LinkWithQuery href="/methodology">please visit our Methodology section</LinkWithQuery>.
            </p>
            <p>
              This database originates from a collaboration between the Grantham Research Institute and GLOBE International on a series of Climate
              Legislation Studies. Since then, Climate Change Laws of the World has transformed into one of the Grantham Research Institute’s core
              strategic projects, underpinning much of the Institute’s work on our governance and legislation theme.
            </p>
            <p>
              The database is now powered by new technology built by our partners{" "}
              <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar</ExternalLink>. This includes a series of features and
              functionality to make it easier to explore the data.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="What can I do with your tool?">
          <>
            <ul>
              <li>Find climate and climate-related laws, policies, strategies and action plans from every national government worldwide</li>
              <li>Search for keywords and policy concepts (like electric vehicles and blue hydrogen) across all of our documents</li>
              <li>See where your search term and related phrases appear in documents with our automatic highlighting tool</li>
              <li>Browse country profiles to find and compare their climate laws, policies and strategies</li>
              <li>Access our raw data: you just need to fill out our form to request a copy of our entire dataset.</li>
            </ul>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="What’s the difference between Climate Change Laws of the World and Climate Policy Radar?">
          <>
            <p>
              These resources have the same data, features and functionality. The Grantham Research Institute and Climate Policy Radar are delivering
              these resources in partnership, using Climate Policy Radar's technology to help you get more out of Climate Change Laws of the World's
              data.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="Am I free to download and use your data?">
          <>
            <p>
              Yes - and we encourage you to do so! The content of our database is available under the Creative Commons Attribution Licence{" "}
              <ExternalLink url="https://creativecommons.org/licenses/by/4.0/">(CC-BY)</ExternalLink>. Before doing so, you should read our Terms of
              Use for more information and to find out how to credit our data. You will also need to{" "}
              <ExternalLink url="https://docs.google.com/forms/d/e/1FAIpQLSdFkgTNfzms7PCpfIY3d2xGDP5bYXx8T2-2rAk_BOmHMXvCoA/viewform">
                fill out our form
              </ExternalLink>{" "}
              to receive a copy of the dataset as a .csv file.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="How up-to-date is your database?">
          <>
            <p>
              New data, and updates to existing data, are collected from official sources such as government websites, parliamentary records and court
              documents. We add these to the database on a rolling basis. You can help grow our database by telling us about any laws, policies or
              strategies that are missing using our <ExternalLink url="https://forms.gle/QQMXoKdnvAEWh9Sr5">data contributors form</ExternalLink>.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="How many laws and policies do you have in your database?">
          <>
            <p>We have over 3,100 laws and policies in the database. This number is regularly updated as new data is entered.</p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="Where can I find climate litigation data?">
          <>
            <p>
              The litigation data previously accessible through Climate Change Laws of the World stemmed from our ongoing partnership with{" "}
              <ExternalLink url="https://climate.law.columbia.edu/">The Sabin Center for Climate Change Law</ExternalLink>. The Sabin Center has been
              leading efforts to collect global litigation data since 2011. We are now working together to launch an enhanced version of the
              litigation database, with new features similar to our legislation database. The data will be available through an integrated global
              resource in the coming months.{" "}
              <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/mailing-list/">Sign up for our newsletter</ExternalLink> to hear about this
              update. In the meantime, you can access climate case documents at the Sabin Center’s{" "}
              <ExternalLink url="http://www.climatecasechart.com">Climate Change Litigation Databases</ExternalLink> website.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="How do I find climate change framework laws?">
          <>
            <p>
              Climate Change framework laws are a subset of all laws and policies in the database (see our{" "}
              <LinkWithQuery href="/methodology">Methodology</LinkWithQuery> for further detail). If you are interested in this subset of the data,
              please request a download of the full dataset. You can then filter this so you only see legislative documents (column L). From there you
              can filter for any entry that includes data in Column O on frameworks.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="How do I download all your data?">
          <>
            <p>
              You’ll need to{" "}
              <ExternalLink url="https://docs.google.com/forms/d/e/1FAIpQLSdFkgTNfzms7PCpfIY3d2xGDP5bYXx8T2-2rAk_BOmHMXvCoA/viewform">
                fill out our form
              </ExternalLink>{" "}
              to request our entire dataset.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="Why do you limit the number of search results?">
          <>
            <p>
              We limit the number of search results you’ll see to 100 so that you get the best performance from our system. We’re working to remove
              this limit.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="How do I download the data from my search result?">
          <>
            <p>You can download the data from your search result by clicking ‘download search result as csv’.</p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="What does ‘exact phrase only’ mean?">
          <>
            <p>
              ‘Toggling’ (or clicking on) this option in the sidebar will narrow down your search to only show documents that include the exact words
              you typed in the search bar. However, this means a search for ‘electric vehicles’ wouldn’t pick up ‘EVs’ in the text, for example.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="What am I seeing if I don’t toggle ‘exact phrase only’?">
          <>
            <p>
              If you don’t toggle (or click on) ‘exact phrase only’, our new search feature searches our database for similar and related terms to the
              query you typed into the search bar. This means you’ll get a richer search experience, as often climate or policy concepts are described
              in different ways by the government actors and policymakers producing the documents (such as petrol cars, internal combustion engine
              vehicles, gasoline-powered cars, etc). This feature relies on a technique called{" "}
              <ExternalLink url="https://climatepolicyradar.org/latest/building-natural-language-search-for-climate-change-laws-and-policies">
                natural language processing
              </ExternalLink>
              , which trains computers to understand text and the meaning of words and phrases. This work is verified by our team of humans and we’re
              working to improve it continually.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="How do I use the sidebar features to create filters for my results?">
          <>
            <p>
              After conducting a search in the search bar, you can click on various features in the sidebar to the left of the page to narrow down
              your results. These features include showing ‘only exact matches’ (i.e. only searching the database for the precise words entered into
              the search bar), regions of the world where laws and policies have been published, specific jurisdictions (or countries), and date
              ranges for when documents have been published. This can help you narrow down and find accurate results more quickly.
            </p>
          </>
        </AccordianItem>

        <hr />

        <AccordianItem title="What are the document matches?">
          <>
            <p>
              This feature shows you where your search term or relevant text appears in a document. For PDF documents, you’ll see the passage of text
              highlighted in yellow. We are currently working on developing this for HTML.
            </p>
            <p>
              This feature is made possible thanks to technology developed by Climate Policy Radar, which uses an AI technique called natural language
              processing to identify similar and related words and phrases. This means you can find information relevant to your search query even if
              it’s described in a slightly different way in the text of documents. Find out more about how{" "}
              <ExternalLink url="https://climatepolicyradar.org/latest/building-natural-language-search-for-climate-change-laws-and-policies">
                natural language processing
              </ExternalLink>{" "}
              works.
            </p>
          </>
        </AccordianItem>

        <hr />
      </div>
    </section>
  );
};

export default FAQ;
