import { AddressInputPanel } from '.';

export type RecipientInputPanelProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export function RecipientInputPanel({
  id,
  value,
  onChange,
}: RecipientInputPanelProps) {
  return (
    <div
      className="
        flex items-center 
        border border-border-2 rounded-20
        overflow-hidden
        px-4 py-2
        space-x-4"
    >
      <div className="text-grey">Recipient Address</div>

      <div className="bg-opaque-secondary flex-1 rounded-20">
        <AddressInputPanel id={id} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
