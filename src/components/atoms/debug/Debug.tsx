interface IProps {
  title: string;
  data: any[] | Record<any, any> | null;
}

export const Debug = ({ data, title }: IProps) => (
  <div className="grid grid-cols-subgrid gap-y-3 col-start-1 -col-end-1">
    <p className="col-start-1 -col-end-1">{title}:</p>
    <pre className="col-start-1 -col-end-1 max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);
