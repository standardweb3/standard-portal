import { DividendProgressBar } from '../CircularProgressBar/DividendProgressBar';
import Image from '../Image';

export type DividendPercentageProps = {
  value: number;
};

export function DividendPercentage({ value }: DividendPercentageProps) {
  return (
    <div
      className="
    flex-1 max-w-[150px] 
    flex-col justify-center 
    space-y-2"
    >
      <div className="relative">
        <div className="relative z-10">
          <DividendProgressBar value={value}></DividendProgressBar>
        </div>
        <div
          className="
absolute z-0 top-0 left-0 w-full h-full"
        >
          <div className="flex flex-col w-full h-full justify-center items-center">
            <Image
              src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png"
              layout="fill"
              className="opacity-30"
              alt="STND logo"
            />
          </div>
        </div>
      </div>
      <div
        className="
    text-center
    text-grey
  "
      >
        <span className="font-bold">Your Share:</span> 3.25%
      </div>
    </div>
  );
}
