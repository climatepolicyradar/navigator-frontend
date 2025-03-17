interface SlideOutProps {
  children: React.ReactNode;
}

export const SlideOut = ({ children }: SlideOutProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/25">
      <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white p-4">{children}</div>
    </div>
  );
};
