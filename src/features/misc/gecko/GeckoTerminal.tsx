import { useRouter } from 'next/router';
import { ExternalLink } from '../../../components-ui/ExternalLink';
import Image from '../../../components-ui/Image';
import { useActiveWeb3React } from '../../../hooks';
import { getGeckoUrl } from './getGeckoUrl';

export function GeckoTerminal() {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
  const geckoUrl = getGeckoUrl(chainId);

  const geckoImage =
    'https://raw.githubusercontent.com/digitalnativeinc/icons/master/logos/gecko.png';
  return geckoUrl ? (
    <ExternalLink href={geckoUrl} className="!ml-3">
      <Image src={geckoImage} width="22px" height="22px" />
    </ExternalLink>
  ) : null;
}
