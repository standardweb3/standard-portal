export type BondedInfoType = {
  amount?: string;
  share?: number;
  className?: string;
};

export function BondedInfo({
  amount = '0',
  share = 0,
  className,
}: BondedInfoType) {
  return (
    <div className={className}>
      <div className="text-4xl">
        Your Bonded <span className="font-bold">STND</span>
      </div>
      <div className="text-highlight">
        <span className="font-bold text-2xl">{amount}</span> STND
      </div>

      <div
        className="
    text-grey
    text-sm
    mt-3
  "
      >
        <span className="font-bold">Your Share:</span>{' '}
        {(share * 100).toFixed(4)}%
      </div>
    </div>
  );
}
