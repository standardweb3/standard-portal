export function CollateralizePanelHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-4xl font-bold text-primary">{number}</div>
      <div className="">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-grey text-xs">{subtitle}</div>
      </div>
    </div>
  );
}
