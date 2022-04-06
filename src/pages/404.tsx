import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Button } from '../components-ui/Button';

const FourOFour = styled.div`
  font-size: 128px;
  text-shadow: #734da8 10px 10px;
`;

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-text w-full h-full">
      <FourOFour className="font-black">404</FourOFour>
      <div className="font-bold text-xl mb-4">OOPS! Something’s missing.</div>
      <Button
        type="bordered"
        className="!border-grey !text-grey !py-3 !px-4"
        onClick={() => {
          router.back();
        }}
      >
        Go back
      </Button>
    </div>
  );
}
