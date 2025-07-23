import { Section } from "@/components/molecules/section/Section";

export const MetadataBlock = () => {
  return (
    <Section title="About this case">
      <div className="rounded border border-border-light p-12">
        <div className="grid gap-3">
          <div className="grid md:gap-3 md:grid-cols-(--info-grid)">
            <div className="text-text-primary font-semibold">Filing year</div>
            <div>2025</div>
          </div>
          <div className="grid md:gap-3 md:grid-cols-(--info-grid)">
            <div className="text-text-primary font-semibold">Geography</div>
            <div>
              <a href="" className="underline">
                United States
              </a>
            </div>
          </div>
          <div className="grid md:gap-3 md:grid-cols-(--info-grid)">
            <div className="text-text-primary font-semibold">Principal law</div>
            <div>
              <div className="grid">
                <span>Article I (U.S. Constitution)</span>
                <span>Administrative Procedure Act (APA)</span>
                <span>State Law—Conversion</span>
                <span>Take Care Clause</span>
                <span>Separation of Powers Doctrine</span>
                <span>Antideficiency Act</span>
                <span>Inflation Reduction Act of 2022</span>
                <span>Spending Clause</span>
                <span>Appropriations Clause</span>
                <span>Replevin</span>
                <span>Appointments Clause</span>
                <span>Impoundment Control Act</span>
                <span>Uniform Grant Guidance Regulations</span>
                <span>Legislative Vesting Clause</span>
                <span>Fifth Amendment—Due Process</span>
                <span>Contract Law</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
