import { classNames } from '../../functions';

export type StndStakerHeaderTypes = {
  stake: boolean;
  onStake: () => void;
  onUnstake: () => void;
};

export function StndStakerHeader({
  stake,
  onStake,
  onUnstake,
}: StndStakerHeaderTypes) {
  const style =
    'rounded-full inline-flex text-grey items-center px-4 py-2 cursor-pointer';
  const activeStyle =
    '!bg-opaque border border-opaque-border font-bold !text-text';

  return (
    <div
      className="
      rounded-full bg-opaque-inactive
      inline-flex
      items-center justify-between"
    >
      <div
        className={classNames(style, stake && activeStyle)}
        onClick={onStake}
      >
        Stake
      </div>
      <div
        className={classNames(style, !stake && activeStyle)}
        onClick={onUnstake}
      >
        Unstake
      </div>
    </div>
  );
}
