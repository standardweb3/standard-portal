import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Image from '../../../components-ui/Image';

const Radiation = styled.div`
  filter: drop-shadow(0px 4px 10px rgba(195, 159, 159, 0.25));
  border-radius: 50%;
`;

const Background = styled.div<{ background?: string }>`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background: ${({ background }) =>
    background
      ? `linear-gradient(${background} 20%, rgba(227, 200, 239, 0)) `
      : 'rgba(0,0,0,0)'};
`;

export function CollateralCard({ collateral }) {
  const { logo, name, sfr, mcr, color, address } = collateral;
  const router = useRouter()

  const handleClick = () => {
    router.push(`/collateralize/${address}`)
  }

  return (
    <Background
      className="w-full space-y-4 py-[24px] rounded-20"
      background={color}
      onClick={handleClick}
    >
      <div className="text-center flex flex-col items-center space-y-3">
        <Radiation>
          <Image
            className="rounded-full select-none"
            src={logo}
            width="96px"
            height="96px"
            layout="fixed"
          />
        </Radiation>
        <div className="text-3xl font-bold mb-2">{name}</div>
      </div>
      <div className="">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className="whitespace-nowrap text-grey">
            Stability Fee: <span className="font-bold text-text">{sfr}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className="whitespace-nowrap text-grey">
            Min Collateral Ratio:{' '}
            <span className="font-bold text-text">{mcr}</span>
          </div>
        </div>
      </div>
    </Background>
  );
}
