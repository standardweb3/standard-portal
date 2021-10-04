import { useActiveWeb3React } from '../../hooks';
import { Button } from '../Button';
import { Input as NumericalInput } from '../NumericalInput';
import Image from '../Image';
import { Typographies } from '../../utils/Typography';

export type UnbondProps = {
  unbond: () => void;
  bondedAmount: string;
  unbondAmount: string;
  onMax: () => void;
  setUnbondAmount: () => void;
  disabled?: boolean;
  atMax: boolean;
};

export function Unbond({
  atMax,
  unbond,
  bondedAmount,
  unbondAmount,
  onMax,
  setUnbondAmount,
  disabled = false,
}) {
  const { account } = useActiveWeb3React();
  return (
    <div
      className="
  w-full h-full 
  space-y-3 
  bg-background-5 
  rounded-20
  py-8
  px-12
  flex flex-col justify-center items-center"
    >
      <div className="text-center space-y-2 w-full">
        <div className="font-bold text-2xl">Unbonding Period</div>
        <div className="flex justify-center items-center space-x-2">
          {disabled ? (
            <>
              <Button color="danger" className="!font-black" type="bordered">
                Closed
              </Button>
              <span className="font-bold">30</span> days left
            </>
          ) : (
            <Button color="success" className="!font-black" type="bordered">
              Open
            </Button>
          )}
        </div>
      </div>
      <div className="text-center space-y-2 w-full">
        <div className="flex items-center px-4 bg-opaque-secondary rounded-20">
          <Image
            layout="fixed"
            width="36px"
            height="36px"
            src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png"
            alt="STND logo"
          />
          <NumericalInput
            className="
          !py-3 !px-4 
          outline-none 
          text-right
          !bg-transparent"
            value={unbondAmount}
            onUserInput={setUnbondAmount}
          />

          {account && (
            <Button type="bordered" onClick={onMax}>
              max
            </Button>
          )}
        </div>
        <Button className={Typographies.fullButton} onClick={unbond}>
          Unbond
        </Button>
      </div>
      {atMax && (
        <div className="col-span-2 text-danger text-center text-sm mt-4">
          Unbond amount exceeds Bonded STND amount
        </div>
      )}
    </div>
  );
}
