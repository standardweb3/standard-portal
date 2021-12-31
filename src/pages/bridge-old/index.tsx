import { Page } from '../../components-ui/Page';
import Head from 'next/head';
import { PageHeader } from '../../components-ui/PageHeader';
import { ExternalLink } from '../../components-ui/ExternalLink';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { PageContent } from '../../components-ui/PageContent';
import { Button } from '../../components-ui/Button';
import { Alert } from '../../components-ui/Alert';
import { DefinedStyles } from '../../utils/DefinedStyles';

export default function Bridge() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const images = [
    '/img/bridge/bridge0.png',
    '/img/bridge/bridge1.png',
    '/img/bridge/bridge2.png',
    '/img/bridge/bridge3.png',
    '/img/bridge/bridge4.png',
    '/img/bridge/bridge5.png',
    '/img/bridge/bridge6.png',
  ];

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  return (
    <>
      <Head>
        <title>Bridge | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Bridge your assets to SHIDEN network using anyswap"
        />
      </Head>
      <Page id="bridge-page" className={DefinedStyles.page}>
        {isViewerOpen && (
          <ImageViewer
            backgroundStyle={{ zIndex: 10 }}
            src={images}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        )}
        <PageHeader title="Bridge" />

        <PageContent>
          <div className="space-y-8 pb-[60px] w-full max-w-[1000px]">
            <Alert
              className={DefinedStyles.pageAlertFull}
              message={
                <div>
                  STND can be bridged between Ethereum and Shiden Network using{' '}
                  <ExternalLink
                    href="https://app.multichain.org/#/router"
                    className="!whitespace-normal"
                  >
                    Anyswap Router.
                  </ExternalLink>
                  <br />
                  Other ERC-20 assets can be bridged using{' '}
                  <ExternalLink
                    href="https://app.multichain.org/#/bridge"
                    className="!whitespace-normal"
                  >
                    Anyswap Bridge.
                  </ExternalLink>
                  <br />
                  <br />
                  For more details, please read the guide below on how to
                  transfer STND from Ethereum to Shiden Network
                </div>
              }
              type="warning"
            />
            <div className="flex space-x-4">
              <ExternalLink
                href="https://app.multichain.org/#/router"
                className="!whitespace-normal"
              >
                <Button>
                  <div className="flex items-center font-bold text-lg">
                    <div className="mr-2">Router</div>
                    <Image
                      src="/img/bridge/anyswap.svg"
                      width="100px"
                      height="50px"
                    />
                  </div>
                </Button>
              </ExternalLink>
              <ExternalLink
                href="https://app.multichain.org/#/bridge"
                className="!whitespace-normal"
              >
                <Button>
                  <div className="flex items-center font-bold text-lg">
                    <div className="mr-2">Bridge</div>
                    <Image
                      src="/img/bridge/anyswap.svg"
                      width="100px"
                      height="50px"
                    />
                  </div>
                </Button>
              </ExternalLink>
            </div>

            <div
              className="
              p-0 md:p-8 
              rounded-20  
              md:bg-opaque"
            >
              <div className="space-y-4">
                <div className="">
                  <ExternalLink
                    href="https://medium.com/@stakenode/standard-protocol-experience-the-dex-7f5134eb28e6"
                    className="font-bold text-2xl break-normal !whitespace-normal"
                  >
                    Crossing STND between Ethereum and Shiden Network
                  </ExternalLink>
                  <div className="text-xs">by Jimmy Tudesky</div>
                </div>
                <div>
                  To cross-chain #STND from ethereum erc20 to Shiden #STND, You
                  need to use the router provided by Anyswap and have STND
                  tokens on the Metamask wallet.
                </div>
                <div>
                  Go to the Anyswap router page —
                  <ExternalLink href="https://app.multichain.org/#/router">
                    https://app.multichain.org/#/router
                  </ExternalLink>{' '}
                  and connect the Metamask wallet on the ethereum network.
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => openImageViewer(0)}
                >
                  <Image
                    src={images[0]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div>
                  Click on the token selection drop-down menu on the ethereum
                  network section, and select STND from the list, or simply type
                  STND in the search name section.
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => openImageViewer(1)}
                >
                  <Image
                    src={images[1]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div>
                  Enter the #STND amount You want to send via the router.
                </div>
                <div className="font-bold italic">
                  *If You are using the router for the first time, You will have
                  to hit the “Approve” button first and confirm the transaction
                  in Metamask. Please keep in mind that each transaction needs
                  some eth for fees. *Please read carefully all Infos at the
                  bottom about minimum and maximum transfer amounts and tx fees.
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => openImageViewer(2)}
                >
                  <Image
                    src={images[2]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div>
                  After You approve the #STND token spend in Metamask You are
                  able to do Swap with the router. Click “swap” and confirm tx
                  in Metamask.
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => openImageViewer(3)}
                >
                  <Image
                    src={images[3]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div>
                  After the transaction is completed — (You can check with
                  Metamask or explorer — <br />
                  <span className="font-bold">
                    *Please keep in mind that the estimated Time of cross-chain
                    Arrival is around 10–30 min.)
                  </span>
                </div>
                <div
                  className="max-w-[400px] cursor-pointer"
                  onClick={() => openImageViewer(4)}
                >
                  <Image
                    src={images[4]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div>
                  Your STND will be available on Shiden Network Metamask wallet
                  account. Just switch networks from ethereum to Shiden. Now You
                  are ready to use <span className="font-bold">#STND</span> on
                  Standard DEX on Shiden Network.
                </div>

                <div className="font-bold italic">
                  To cross other assets like #USDC, #USDT, #WBTC, etc. which You
                  will eventually use on Standard DEX for liquidity provision
                  and LP farming, You need to use Anyswap bridge —
                  https://app.multichain.org/#/bridge
                </div>
                <div>
                  To use the Anyswap bridge, connect with Metamask on the
                  ethereum network. Select token You want to bridge on the
                  ethereum side, select Shiden Network in the lower section as
                  destination network and confirm the transaction with Metamask.
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => openImageViewer(5)}
                >
                  <Image
                    src={images[5]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div>
                  After confirmation in Metamask, You can track Your bridge
                  progress with the provided link in the pop-up.
                </div>
                <div
                  className="max-w-[400px] cursor-pointer"
                  onClick={() => openImageViewer(6)}
                >
                  <Image
                    src={images[6]}
                    width={6}
                    height={3}
                    layout="responsive"
                  />
                </div>
                <div className="font-bold italic">
                  After the transaction is confirmed on Anyswap bridge, change
                  the network in Metamask to Shiden and Your assets are ready to
                  use on Standard DEX
                </div>
                <Button>
                  <div className="flex items-center font-bold text-lg">
                    <div className="mr-2">Go to</div>
                    <Image
                      src="/img/bridge/anyswap.svg"
                      width="100px"
                      height="50px"
                    />
                  </div>
                </Button>
              </div>
            </div>

            <div
              className="
              p-0 md:p-8 
              rounded-20  
              md:bg-opaque"
            >
              <div className="space-y-4">
                <div className="">
                  <ExternalLink
                    href="https://medium.com/@stakenode/standard-protocol-experience-the-dex-7f5134eb28e6"
                    className="font-bold text-2xl !whitespace-normal"
                  >
                    Transferring Shiden #SDN token from polkadot.js or CEX to
                    Metamask account{' '}
                  </ExternalLink>
                  <div className="text-xs">by Jimmy Tudesky</div>
                </div>
                <div>
                  To use the <span className="font-bold">#SDN</span> token on
                  Standard Protocol DEX, to provide liquidity and enter farming,
                  You need to have <span className="font-bold">#SDN</span>{' '}
                  tokens on Metamask on Shiden Network.
                </div>
                <div>
                  To get #SDN tokens to Metamask simply follow those tutorials
                  below. One is to send tokens directly from CEX, another is in
                  regards to the polkadot.js interface.
                </div>
                <div>
                  👉 Kucoin:{' '}
                  <ExternalLink
                    href="https://stakenode.medium.com/?p=de1bba4e92a2"
                    className="!whitespace-normal"
                  >
                    https://stakenode.medium.com/?p=de1bba4e92a2
                  </ExternalLink>
                </div>
                <div>
                  👉 Polkadot.js:{' '}
                  <ExternalLink
                    href="https://stakenode.medium.com/?p=819da3798f45"
                    className="!whitespace-normal"
                  >
                    https://stakenode.medium.com/?p=819da3798f45
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );

  // useEffect(() => {
  //   let tokens: Currency[] = Object.keys((anyswapInfo && anyswapInfo[chainFrom.id]) || {})
  //     .filter((r) => anyswapInfo[chainFrom.id][r].destChainID == chainTo.id.toString())
  //     .map((r) => {
  //       const info: AvailableChainsInfo = anyswapInfo[chainFrom.id][r]
  //       if (r.toLowerCase() == WNATIVE[chainFrom.id].address.toLowerCase()) {
  //         if (chainFrom.id == ChainId.MOONRIVER) {
  //           return Moonriver.onChain(chainFrom.id)
  //         }
  //         if (chainFrom.id == ChainId.BSC) {
  //           return Binance.onChain(chainFrom.id)
  //         }
  //         if (chainFrom.id == ChainId.MAINNET) {
  //           return Ether.onChain(chainFrom.id)
  //         }
  //       }
  //       return new Token(chainFrom.id, getAddress(r), info.token.Decimals, info.token.Symbol, info.name)
  //     })

  //   setTokenList(tokens)
  //   setCurrency0(null)
  //   setCurrencyAmount('')
  // }, [chainFrom, anyswapInfo, chainTo.id])
}
