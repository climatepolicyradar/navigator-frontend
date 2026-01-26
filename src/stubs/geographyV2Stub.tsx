import { GeographyV2 } from "@/types";

export const GEOGRAPHY_V2_STUB: GeographyV2 = {
  id: "GBR",
  name: "United Kingdom",
  statistics: {
    name: "United Kingdom",
    legislative_process:
      '<p style="text-align: justify;">Parliament is the centre of the political system in the United Kingdom. It is the supreme legislative body and the government is drawn from and answerable to Parliament. Parliament is bicameral, consisting of the House of Commons and the House of Lords.</p>\n<p style="text-align: justify;">Draft bills are issued for consultation before being formally introduced to Parliament. A bill is a proposal for a new law, or a proposal to change an existing law that is presented for debate before Parliament. Bills are introduced in either the House of Commons or House of Lords for examination, discussion and amend­ment. When both Houses have agreed on the content of a bill, it is presented to the monarch for Royal Assent. Once Royal Assent is given, a bill becomes an Act of Parliament and is law. An Act of Parliament creates a new law or changes an existing law.</p>\n<p style="text-align: justify;">Government White Papers set out details of future policy on a particular subject. They allow the government to gather feedback before it formally presents the policies as a bill. The last general election was in May 2015. The next election is scheduled to take place in 2020. Seats in the House of Lords are unelected appointments, and are a mix of lifetime appointments and hereditary peerages.</p>\n<p style="text-align: justify;">Due to the devolution of policy making, the administrations for Scotland, Wales and Northern Ireland are individually responsible for implementing some aspects of UK climate change strategy. However, this chapter focuses on legislation passed by Parliament and policies proposed by the UK government.</p>',
    federal: true,
    federal_details: "3 devolved governments",
    political_groups: "G20;OECD;EU",
    global_emissions_percent: "0.86",
    climate_risk_index: "90.83",
    worldbank_income_group: "High income",
    visibility_status: "published",
  },
  type: "country",
  alpha_2: "GB",
  has_subconcept: [
    {
      id: "GB-ENG",
      name: "England",
      statistics: null,
      type: "subdivision",
      subconcept_of: [],
      slug: "gb-eng",
    },
    {
      id: "GB-SCT",
      name: "Scotland",
      statistics: null,
      type: "subdivision",
      subconcept_of: [],
      slug: "gb-sct",
    },
    {
      id: "GB-WLS",
      name: "Wales [Cymru GB-CYM]",
      statistics: null,
      type: "subdivision",
      subconcept_of: [],
      slug: "gb-wls",
    },
  ],
  subconcept_of: [],
  slug: "united-kingdom",
};
