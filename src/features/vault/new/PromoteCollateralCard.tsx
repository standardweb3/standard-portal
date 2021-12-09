import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Image from '../../../components-ui/Image';

const Radiation = styled.div<{ color?: string }>`
  filter: drop-shadow(0px 4px 10px rgba(195, 159, 159, 0.4));
  border-radius: 50%;
`;

const Background = styled.div<{ background?: string }>`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background: ${({ background }) =>
    background
      ? `linear-gradient(90deg, ${background} 20%, rgba(227, 200, 239, 0)) `
      : 'rgba(0,0,0,0)'};
`;

export function PromoteCollateralCard({ collateral }) {
  const { logo, name, sfr, mcr, color, address } = collateral;
  const router = useRouter();

  const onClickCard = () => {
    router.push(`/collateralize/${address}`);
  };
  return (
    <Background
      onClick={onClickCard}
      background={color}
      className="
        select-none
        cursor-pointer
        inline-flex justify-center items-center w-full 
        space-x-2 py-[48px] px-[24px] md:px-[48px] rounded-20 backdrop-blur-collateral
    "
    >
      <div className="flex space-x-4">
        <Radiation>
          <Image
            className="rounded-full select-none"
            src={logo}
            width="96px"
            height="96px"
            layout="fixed"
          />
        </Radiation>
        <div className="px-4">
          <div className="text-4xl font-bold mb-2">{name}</div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="text-grey whitespace-nowrap">
              Stability Fee: <span className="font-bold text-text">{sfr}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="text-grey whitespace-nowrap">
              Min Collateral Ratio:{' '}
              <span className="font-bold text-text">{mcr}</span>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
