import { useCallback, useState } from 'react';
import Add from './Add';
import Remove from './Remove';

export default function Liquidity({
  userHasBalance,
  tokenAId,
  tokenBId,
  liquidityToken,
}) {
  const [add, setAdd] = useState(true);

  const handleToRemove = useCallback(() => {
    setAdd(false);
  }, []);

  const handleToAdd = useCallback(() => {
    setAdd(true);
  }, []);

  return (
    <div>
      {userHasBalance && (
        <div className="flex items-center justify-center p-3px">
          <div
            className={`
          cursor-pointer
          flex items-center justify-center 
          py-1
          px-2
          text-base font-medium text-center
          border-b-4
          ${add ? 'border-primary' : 'border-opaque-border-2'}
          `}
            onClick={handleToAdd}
          >
            Add
          </div>
          <div
            className={`
          cursor-pointer
          flex items-center justify-center 
          py-1
          px-2
          text-base font-medium text-center 
          border-b-4
          ${!add ? 'border-primary' : 'border-opaque-border-2'}
          `}
            onClick={handleToRemove}
          >
            Remove
          </div>
        </div>
      )}
      {add ? (
        <Add
          liquidityToken={liquidityToken}
          tokenAId={tokenAId}
          tokenBId={tokenBId}
        />
      ) : (
        <Remove
          liquidityToken={liquidityToken}
          tokenAId={tokenAId}
          tokenBId={tokenBId}
        />
      )}
    </div>
  );
}
