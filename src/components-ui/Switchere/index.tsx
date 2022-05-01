import Script from 'next/script';
import { useState } from 'react';
import Image from '../Image';
import { Modal } from '../Modal';
import { useSizeSmDown, useSizeXs } from '../Responsive';
import { WavySpinner } from '../Spinner/WavySpinner';

export default function Switchere() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const isViewportXSmall = useSizeXs();
  const isViewportSmallDown = useSizeSmDown();

  const switchHereImage =
    'https://raw.githubusercontent.com/digitalnativeinc/icons/master/logos/switchere.png';

  const onModalDismis = () => setShow(false);
  const initSwithere = async () => {
    setLoading(true);
    await window?.switchereSdk?.init({
      el: '#switchere',
      partnerKey: 'JWY0ML4U23KITM5K',
    //   partnerKey: 'I9W1QL2MWVGP4WBL',
    //   JWY0ML4U23KITM5K
      httpReturnSuccess: 'https://domain.tld/success',
      httpReturnFailed: 'https://domain.tld/failed',
    });
    setLoading(false);
  };

  const onModalShow = () => {
    setShow(true);
    initSwithere();
  };

  const loadScript = () => {
    return (
      <Script
        src="https://sandbox.switchere.com/js/sdk-builder.js"
        strategy="beforeInteractive"
      />
    );
  };


  return (
    <>
      {loadScript()}
      <div
        onClick={onModalShow}
        className="
        cursor-pointer
        bg-blue bg-opacity-10 rounded-xl px-3 py-2
        border-blue border-opacity-75 border
        flex items-center 
        space-x-2
      "
      >
        <div>
          <Image src={switchHereImage} width="18px" height="22px" />
        </div>
        <div className="text-sm text-text">Switchere</div>
      </div>
      <Modal
        minWidth={
          isViewportSmallDown ? (isViewportXSmall ? '90vw' : '70vw') : 'none'
        }
        maxWidth="500px"
        isOpen={show}
        onDismiss={onModalDismis}
        className="!p-0 relative overflow-x-scroll overflow-y-scroll"
      >
        {loading && (
          <div className="flex w-full h-full justify-center items-center absolute">
            <WavySpinner />
          </div>
        )}
        <div className="w-full h-full" id="switchere"></div>
      </Modal>
    </>
  );
}
