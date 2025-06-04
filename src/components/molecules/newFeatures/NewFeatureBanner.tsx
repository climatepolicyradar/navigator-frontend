import { Button } from "@/components/atoms/button/Button";
import { INewFeature } from "@/constants/newFeatures";

interface IProps {
  newFeature: INewFeature;
}

export const NewFeatureBanner = ({ newFeature: { banner } }: IProps) => {
  return (
    <div className="flex gap-2 justify-center items-center p-3 bg-surface-brand pointer-events-auto select-none">
      <span className="mr-2 text-sm leading-normal text-text-light">{banner.text}</span>
      <Button size="small" variant="outlined" className="text-text-light hover:!bg-surface-mono-dark/25">
        {banner.CTA}
      </Button>
      <Button size="small" variant="ghost" className="text-text-light hover:!bg-surface-mono-dark/25">
        Dismiss
      </Button>
    </div>
  );
};
