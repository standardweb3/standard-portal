import { Currency, Token } from '@digitalnative/standard-protocol-sdk';
import React, { useState } from 'react';

import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { Modal } from '../../components-ui/Modal';
import { getExplorerLink } from '../../functions/explorer';
import styled from '@emotion/styled';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useUnsupportedTokens } from '../../hooks/Tokens';
import { XIcon } from '@heroicons/react/outline';

const DetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  //max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  text-align: center;
`;

const AddressText = styled.div`
  font-size: 12px;
`;

export default function UnsupportedCurrencyFooter({
  show,
  currencies,
}: {
  show: boolean;
  currencies: (Currency | undefined)[];
}) {
  const { chainId } = useActiveWeb3React();
  const [showDetails, setShowDetails] = useState(false);

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return currency?.wrapped;
        })
      : [];

  const unsupportedTokens: {
    [address: string]: Token;
  } = useUnsupportedTokens();

  return (
    <DetailsFooter show={show}>
      <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
        <div style={{ padding: '2rem' }}>
          <div>
            <div className="flex items-center">
              <div>Unsupported Assets</div>

              <XIcon
                className="w-4 h-4"
                onClick={() => setShowDetails(false)}
              />
            </div>
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <div
                    className="border border-dark-700"
                    key={token.address?.concat('not-supported')}
                  >
                    <div className="flex item-center">
                      <CurrencyLogo currency={token} size={'24px'} />
                      <div className="font-medium">{token.symbol}</div>
                    </div>
                    {chainId && (
                      <ExternalLink
                        href={getExplorerLink(
                          chainId,
                          token.address,
                          'address',
                        )}
                      >
                        <AddressText>{token.address}</AddressText>
                      </ExternalLink>
                    )}
                  </div>
                )
              );
            })}
            <div className="font-medium">
              Some assets are not available through this interface because they
              may not work well with our smart contract or we are unable to
              allow trading for legal reasons.
            </div>
          </div>
        </div>
      </Modal>
      <Button style={{ padding: '0px' }} onClick={() => setShowDetails(true)}>
        <div>Read more about unsupported assets</div>
      </Button>
    </DetailsFooter>
  );
}
