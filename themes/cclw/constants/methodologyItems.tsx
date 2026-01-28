import { JSX } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";

type TDataListItem = {
  title: string;
  content: JSX.Element;
};

export const METHODOLOGY: TDataListItem[] = [
  {
    title: "Scope of documents included",
    content: (
      <>
        <p>
          This database covers all UNFCCC parties (196 countries plus the European Union), and several territories that are not in the UN or UNFCCC,
          such as Taiwan, Palestine and Western Sahara.
        </p>

        <p>
          <b>The database focuses exclusively on climate change-related laws and policies</b>. We define climate change-related laws and policies
          broadly as legal documents that are directly relevant to climate change mitigation, adaptation, loss and damage or disaster risk management.
          Typically, to be included in the database one or more aspects of a law or policy must be demonstrably motivated by climate change concerns.
        </p>

        <p>
          <b>We include legal documents that</b>: establish rules and procedures related to reducing energy demand; promote low-carbon energy supply;
          restrict the development of fossil fuel-based infrastructure; promote or mandate low-carbon buildings; set carbon pricing policy; lower
          industry emissions; tackle deforestation and promote or mandate sustainable land use; contain other mitigation efforts; cover
          climate-related research and development; promote or mandate low-carbon transport; enhance adaptation capabilities; or put in place natural
          disaster risk management. In some instances, laws addressing disaster risk management and/or energy-related matters may have been included
          even where no explicit mention of climate change is made, given the close connection between these areas and climate change. Laws aimed at
          enhancing other areas of environmental action or environmental protection are not included unless they include provisions with directly
          relevant impacts on climate change action, such as a reduction in greenhouse gas emissions, significant enhancement or protection of carbon
          sinks, or if they expressly contribute to climate adaptation and resilience.
        </p>

        <p>
          <b>The dataset includes legislation and policy at the national and sectoral levels only</b>. At present, it excludes information about the
          policy response of sub-national governments. For EU member states, laws transposing EU Directives are in the process of being added to the
          database, along with the relevant EU law, since in many instances these may contain additional relevant provisions. Where possible these
          additional provisions have been noted in the description of the relevant law.
        </p>
        <p>
          As noted above, alongside the CCLW dataset, the database includes documents submitted by Parties and non-Party stakeholders to the UNFCCC,
          including, among others, Nationally Determined Contributions (NDCs), National Communications and Adaptation Communications, IPCC reports,
          and submissions to the first Global Stocktake. For more details on the scope of UNFCCC documents, please see FAQ{" "}
          <LinkWithQuery href="/faq" hash="unfccc-docs">
            Which Submissions to the UNFCCC are included?
          </LinkWithQuery>
        </p>
        <p>
          <b>Documents included in the database must have full legal force</b>, having passed through the legislature or through an executive
          decision-making body, <b>and/or set out a current governmental policy objective or set of policy objectives</b>. In some instances, we may
          also include documents that have not passed through the legislature or an executive decision-making body, but are legally relevant to
          interpretation or implementation of a law or policy (e.g. guidelines published by government agencies in line with their statutory
          mandates). This change has been made to reflect the proliferation of guidance to private entities (primarily financial and non-financial
          companies) in recent years. We note that the inclusion of this type of document is likely less exhaustive than our coverage of core climate
          change legislation and policy such as climate change framework laws.
        </p>
        <p>
          To the best of our ability, we capture major amendments to legislation and update document summaries accordingly. Where we become aware that
          laws are outdated, either because they have been repealed or replaced, or because they were in force for a limited time period, these
          documents may be removed from the database and archived. In general, precedence is given to the document with the highest possible status
          dealing with a given matter. In some instances, policies or regulations aimed at giving effect to legislation or regulation of a higher
          order ('parent legislation'), such as statutory instruments or other guidance adopted to provide detail on the implementation of an act of
          parliament, may be included in the database alongside their 'parent legislation' where these provide a significantly more detailed picture.
        </p>
      </>
    ),
  },
  {
    title: "Definitions and classifications: currently in use",
    content: (
      <>
        <p>
          <b>
            We assign a number of classifications and categories to laws and policies in the CCLW database to enhance the usability and searchability
            of the data
          </b>
          . The system of classifications has evolved to remain in step with developments in climate governance, the growth of the dataset, and the
          needs of our user community. Codes and categories currently in use include:
        </p>

        <h4>Legislation and policy</h4>
        <p>
          <b>
            We categorise documents as legislation or policy depending on if they are enacted by the legislative or executive branch of government
          </b>
          . Where the same body holds both legislative and executive power, a determination of whether a document constitutes a law or policy is made
          based on our best understanding of the country’s legal system.
        </p>

        <h4>Document types</h4>
        <p>
          <b>Document types are determined with reference to a non-exhaustive list of options</b> and may be classified according to their legal
          status, i.e. as a Constitution or a Decree Law, or, in the case of policy documents, by their content, e.g. as a strategy, a roadmap or a
          government guidance note.
        </p>

        <h4>Topics</h4>
        <p>
          <b>Laws and policies are categorised according to the climate policy response to which they are most relevant</b>: mitigation, adaptation,
          loss and damage, or disaster risk management. Where appropriate, laws may be tagged as relevant to more than one policy response.
        </p>
        <ol>
          <li>
            <b>Mitigation</b>: Mitigation laws and policies refer to a legislative or executive disposition focused on curbing a country’s greenhouse
            gases emissions in one sector or more. Measures can be directly related to emission reductions, such as establishing a national carbon
            budget or cap and trade system, or indirectly related, such as establishing relevant institutions or providing additional funding for
            research and development into low-carbon technologies. Laws and policies addressing forests and land use are included if they explicitly
            support climate change mitigation through activities that reduce emissions and increase carbon removals. General forest management and
            conservation laws are not included, even if they may have implicit consequences for climate change mitigation.
          </li>

          <li>
            <b>Adaptation</b>: Adaptation laws and policies contain explicit provisions concerning climate change adaptation, i.e. the need for
            changes in the management of ecological, social or economic systems in response to the actual or expected impacts of climate change. We
            conducted a comprehensive review of adaptation laws and policies in 2018 and have added documents since then. Note that in many cases,
            climate change adaptation responses may be embedded in development policies, general planning policies, risk-reduction and disaster
            management policies, water policies, land use and forestry policies and health policies, which can make them difficult to identify.
            <a href="#note-i">[i]</a>
          </li>

          <li>
            <b>Disaster risk management</b>: Laws and policies governing countries’ approaches to disaster risk management (DRM) and disaster risk
            reduction (DRR) were first added to the database in 2019. We have adopted a broad approach to assessing whether these documents fall
            within the database scope, as laws and policies often target natural and human disasters in a holistic manner, making it harder to isolate
            climate-related adverse events. Nonetheless, in determining whether a disaster risk management law or policy falls within scope, our
            researchers will usually consider whether the document relates to the types of disaster that are expected to become more frequent due to
            climate change, such as hurricanes, typhoons, flooding, heatwaves, droughts, forest fires and sea-level rise (this list is
            non-exhaustive). In some cases these laws and policies may constitute exceptions to the general rule that laws and policies must be
            explicitly ‘climate-motivated’ to justify their inclusion.
          </li>

          <li>
            <b>Loss and damage</b>: We define loss and damage-related laws and policies as those that explicitly reduce the risk of climate-related
            loss and damage by increasing resilience and those that provide compensation or other relief measures to support victims of
            climate-related loss and damage. The guiding definition of loss and damage includes both economic and non-economic losses that arise due
            to climate impacts that are made more frequent or more severe by anthropogenic greenhouse gas emissions. Policy measures may include
            national climate relief funds, risk transfer mechanisms, internal relocation arrangements, mainstreaming loss and damage across government
            departments and ministries, and social protection programmes and safety nets. Loss and damage is the most recent policy response area
            included in the database. Our current categorisation accounts for documents that explicitly mention the term ‘loss and damage’ and is
            exhaustive for laws and policies that were passed from 2015 onward. Documents addressing loss and damage with regard to specific impacts,
            such as biodiversity loss or drought, but which do not use an explicit loss and damage framing, do not have the loss and damage tag.
          </li>
        </ol>

        <h4>Frameworks</h4>
        <p>
          <b>A number of laws or policies in the database are categorised as ‘framework’ documents</b>. While there is no agreed definition of a
          ‘climate change framework law’, this term is applied with increasing frequency to a discrete class of laws that share some or all of the
          following characteristics, and we tag legislative documents within the database as ‘framework laws’ accordingly:
        </p>
        <ol>
          <li>Set out the strategic of travel for national climate change policy</li>
          <li>Are passed by the legislative branch of government</li>
          <li>Contain national long-term and/or medium targets and/or pathways for change</li>
          <li>Set out institutional arrangements for climate governance at the national level</li>
          <li>Are multi-sectoral in scope</li>
          <li>
            Involve mechanisms for transparency and/or accountability.
            <a href="#note-ii">[ii]</a>
          </li>
        </ol>

        <p>
          However, in the case of executive policies, we employ a broader definition than described above. Examples range from overarching
          multi-sectoral action plans that serve to provide a unifying basis for climate change action within a country, to documents with a narrower
          focus but that nonetheless establish a governance framework for a specific aspect of climate action, such as a national low-carbon energy
          policy. Data users interested in this sub-set of climate laws are advised to review the sub-set of laws tagged as frameworks and to use
          their discretion to determine which of these laws may be most relevant to their subject of inquiry.
        </p>

        <p>
          Framework documents are tagged to indicate the policy response area(s) to which they relate, whether mitigation, adaptation or disaster risk
          management.
        </p>

        <h4>Sectors</h4>
        <p>
          <b>Each document is assessed to determine the most relevant sector or sectors to which it relates</b>. The following sectors are currently
          considered: Agriculture, Transport, Energy, Waste, Environment, Tourism, Land Use, Land-Use Change and Forestry (LULUCF), Industry,
          Buildings, Water, Health, Public Sector, and Other. Where a document relates to multiple sectors or appears cross-cutting in intention, we
          assign the labels ‘economy-wide’ or ‘cross-cutting area’. We also consider whether laws relate primarily to urban or rural sectors of the
          economy and/or to coastal zones. We currently only cover waste laws that explicitly mention methane, another greenhouse gas, or if they deal
          with waste-to-energy schemes.
        </p>

        <h4>Targets</h4>
        <p>
          <b>Up until January 2023, efforts were made to manually identify all targets included in laws and policies</b>. We are currently in the
          process of developing an automated process to identify targets. For documents added after January 2023, we only manually identify “net zero”
          targets or their equivalent. See further detail in the Definitions and classifications: not currently in use section.
        </p>
        <h4>Keywords</h4>
        <p>
          <b>Discretionary keywords may be assigned to cases to enable data users to identify these more easily</b>. We do not maintain a
          comprehensive list of keywords.
        </p>
      </>
    ),
  },
  {
    title: "Data collection process",
    content: (
      <>
        <p>
          The Climate Change Laws of the World Database started life in 2010 as a printed publication, comprising an overview of climate change laws
          and policies in just 16 countries. Since then, it has expanded to include all countries in the present scope and has moved online to enable
          users to access relevant information when it becomes available. Updates to the data are now collected on a rolling basis from official
          sources such as government websites and parliamentary records.
        </p>
        <p>
          Some of our key strategies for identifying new documents include: review of documentation submitted to UNFCCC processes, such as NDCs;
          country-specific research; thematic reviews of different types of legislation (e.g. net zero laws, coal phase out laws); and media and
          social media alerts. Data collection is overseen by LSE, supported by Climate Policy Radar and other partners. These efforts are regularly
          supplemented by contributions from lawyers, scholars, policymakers and other colleagues from around the world, who alert us to new data.
          Please use 
          <ExternalLink url="https://form.jotform.com/233294135296359">this link</ExternalLink>
           or email us at 
          <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>
           if you wish to contribute.
        </p>
        <p>
          In July 2024, a large volume of data not previously included in the database was ingested from the 
          <ExternalLink url="https://climatepolicydatabase.org/">Climate Policy Database</ExternalLink>. Prior to their ingest into the database,
          entries were reviewed by researchers at Climate Policy Radar to ensure that no duplicate entries were added. Entries were also reviewed to
          ensure they fell within scope of this methodology (for example international treaties were excluded) and metadata from the Climate Policy
          Database was converted to match values in the metadata schema of the CCLW dataset. Relevant entries are identified by the Climate Policy
          Database logo.
        </p>
      </>
    ),
  },
  {
    title: "Country profiles data",
    content: (
      <>
        <p>
          Country profiles include data showing the share of global emissions and the Global Climate Risk Index. The share of global emissions data is
          from <ExternalLink url="https://www.climatewatchdata.org/">Climate Watch</ExternalLink>, managed by the World Resources Institute. This
          percentage is based on emissions data from 2020. This data was last updated on this site on 18 September 2023. The annually published Global
          Climate Risk Index analyses to what extent countries have been affected by the impacts of weather-related loss events (storms, floods, heat
          waves etc.). This data is from the Global Risk Index 2021 published by{" "}
          <ExternalLink url="https://www.germanwatch.org/en/cri">German Watch</ExternalLink>. Numbers marked with an asterisk (*) are from the Global
          Risk Index 2020, being the latest available data for that country. This data was last updated on this site on 18 September 2023.
        </p>
      </>
    ),
  },
  {
    title: "Principles and limitations",
    content: (
      <>
        <p>
          <b>In general, our approach has been to be inclusive and flexible with definitions</b>, to allow for the different regulatory approaches and
          cultures among 200 countries, and to recognise the elusive boundaries of climate change, which spans multiple sectors and issues.
        </p>
        <p>
          <b>We aim for the data collected through this resource to be as comprehensive and accurate as possible</b>. However, we do not claim to have
          identified every relevant law or policy in the countries covered. Language limitations, levels of media coverage, and the specific expertise
          of our researchers and contributors may all result in information for certain countries being more comprehensive than others. Our current
          data collection process prioritises the most recently passed laws and policies.
        </p>
        <p>
          <b>
            Although the Grantham Research Institute has developed rigorous internal protocols to guide the process of data collection, the
            categorisation of each document has been determined by individuals and has not generally been subject to checks for inter-coder
            reliability
          </b>
          . The records in the database have been published in a wide variety of languages, and researchers frequently use automated translation
          software to understand the content of these records. The determination of whether a given law is in scope, as well as its categorisation in
          accordance with the definitions outlined above, may therefore be open to differing interpretations.
        </p>
        <p>
          <b>
            We acknowledge that our current focus on national level legislation may mean that the database does not capture the full detail of the
            climate change policy response in many countries
          </b>
          , particularly those where a significant quantity of climate action is governed by decision-making at the sub-national level.
        </p>
        <p>We invite users to exercise their judgment when using the data and any data sub-sets that serve their research and policy purposes.</p>
      </>
    ),
  },
  {
    title: "Definitions and classifications: not currently in use",
    content: (
      <>
        <p>
          This section provides details on classifications found in the full data download that are not currently in regular use, but have been
          previously assigned to subsets of documents in the database.{" "}
          <b>
            We are working with our partners at Climate Policy Radar to develop new automated processes to improve our classification of documents and
            apply these classifications to the entire dataset
          </b>
          .
        </p>
        <h4>Targets</h4>
        <p>
          As noted above, until January 2023 efforts were made to manually identify targets in laws and policies. Full details of the methodology for
          this process can be found below in <b>Annex I</b>.
        </p>
        <h4>Instruments</h4>
        <p>
          <b>A subset of documents have been assessed to determine the primary policy instruments or ‘tools’ on which they rely</b>, in order to
          facilitate a more nuanced understanding of the ways in which governments around the world seek to influence the drivers and impacts of
          climate change. We categorise instruments according to an adapted version of the classic Hood and Margetts NATO typology of instruments.
          <a href="#note-iii">[iii]</a> We assess documents to determine the most relevant area(s) of government activity and then tag them with the
          specific types of instrument they employ to achieve their stated aims and objectives. The vast majority of documents relate to more than one
          area of government activity and rely on multiple instruments. See <b>Annex II</b> below for the full list of instruments considered.
        </p>
        <h4>Natural hazards</h4>
        <p>
          Natural hazards, such as floods and droughts, have been identified for a subset of documents relating to disaster risk management and
          adaptation.
        </p>
      </>
    ),
  },
  {
    title: "Notes",
    content: (
      <>
        <p>
          <span className="block" id="note-i">
            <span className="text-primary-600">[i]</span> Nachmany M, Byrnes R, Surminski S (2019) National laws and policies on climate change
            adaptation: a global review. London: Grantham Research Institute on Climate Change and the Environment.
          </span>
          <span className="block" id="note-ii">
            <span className="text-primary-600">[ii]</span> See further: Nachmany M et al. (2015) The 2015 Global Climate Legislation Study: A Review
            of Climate Change Legislation in 99 Countries. London: Grantham Research Institute on Climate Change and the Environment; Nash S, Steurer
            R (2019) Taking stock of Climate Change Acts in Europe: Living policy processes or symbolic gestures? Climate Policy 3:1; World Bank
            (2020) World Bank Reference Guide to Climate Change Framework Legislation. EFI Insight-Governance. Washington, DC: World Bank.
          </span>
          <span className="block" id="note-iii">
            <span className="text-primary-600">[iii]</span> See Hood C, Margetts H (2007) The Tools of Government in the Digital Age, London:
            Macmillan Education. We have loosely mapped Hood and Margetts’ four basic ‘resources’ of government – Nodality, Authority, Treasure and
            Organization – to areas of government activity as Capacity Building (Nodality), Regulation (Authority), Incentives and Direct Investment
            (Treasure), and Governance and Planning (Organization). We developed these adaptations to enhance the searchability of the database and to
            enable observations of particular relevance to climate change practitioners.
          </span>
        </p>
      </>
    ),
  },
  {
    title: "Annex I: Targets methodology",
    content: (
      <>
        <p>
          <b>This Annex outlines the process used to collect and categorise the targets displayed in the Climate Change Laws of the World database</b>
          . Data on targets was originally collected in 2018 following a review of the Nationally Determined Contributions (NDCs) submitted by parties
          to the Paris Agreement and around 1,500 climate change laws and policies then available in the CCLW database. In some instances where the
          text of the law was unavailable press releases or other secondary source material regarding the nature of targets set may have been
          consulted. Until January 2023, data was updated as new laws were added to the database but data for some countries may be incomplete. This
          data was reviewed extensively during the first semester of 2022.
        </p>

        <h4>Scope</h4>
        <p>
          Targets were included in the target dataset based on whether they are quantifiable. Both mitigation and adaptation targets are included.
          Aspirational or non-measurable targets are not generally included.
        </p>

        <h4>Sector</h4>
        <p>
          Upon addition to the database, targets are categorised by sector. Targets are defined as ‘economy-wide’ if they are communicated on a
          national level, without further detail on the specific sectors to which they apply.
        </p>
      </>
    ),
  },
  {
    title: "Annex II: List of instruments",
    content: (
      <>
        <p>This Annex lists the instrument types currently included in the CCLW data download.</p>
        <h4>Regulation</h4>
        <ul>
          <li>Standards, obligations and norms</li>
          <li>Disclosure obligations</li>
          <li>Moratoria and bans</li>
          <li>Zoning and spatial planning</li>
          <li>Other</li>
        </ul>
        <h4>Economic</h4>
        <ul>
          <li>Subsidies</li>
          <li>Tax incentives</li>
          <li>Carbon pricing and emissions trading</li>
          <li>Insurance</li>
          <li>Climate finance tools</li>
          <li>Other</li>
        </ul>
        <h4>Direct investment</h4>
        <ul>
          <li>Provision of climate funds</li>
          <li>Nature based solutions and ecosystem restoration</li>
          <li>Provision of climate finance</li>
          <li>Green procurement</li>
          <li>Early warning systems</li>
          <li>Other</li>
        </ul>
        <h4>Governance</h4>
        <ul>
          <li>Capacity building</li>
          <li>Institutional mandates</li>
          <li>Planning</li>
          <li>Processes, plans and strategies</li>
          <li>Monitoring Reporting and Verification (MRV)</li>
          <li>Subnational and citizen participation</li>
          <li>International cooperation</li>
          <li>Other</li>
        </ul>
        <h4>Information</h4>
        <ul>
          <li>Education, training and knowledge dissemination</li>
          <li>Research and Development, knowledge generation</li>
        </ul>
      </>
    ),
  },
];
