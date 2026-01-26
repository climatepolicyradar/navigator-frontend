interface IProps {
  title: string;
  data: any[] | Record<any, any> | null;
}

export const Debug = ({ data, title }: IProps) => (
  <>
    <span>{title}:</span>
    <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(data, null, 2)}</pre>
  </>
);
