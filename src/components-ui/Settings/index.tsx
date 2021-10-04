import { ChainId, Percent } from '@digitalnative/standard-protocol-sdk';
import React, { useRef, useState } from 'react';
import {
  useExpertModeManager,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
} from '../../state/user/hooks';
import {
  useModalOpen,
  useToggleSettingsMenu,
} from '../../state/application/hooks';

import {
  CogIcon,
  DotsHorizontalIcon,
  MenuAlt3Icon,
} from '@heroicons/react/outline';
import { ApplicationModal } from '../../state/application/actions';
import Toggle from '../Toggle';
import { useActiveWeb3React } from '../../hooks';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Modal } from '../Modal';
import { ModalHeader } from '../Modal/ModalHeader';
import { Button } from '../Button';
import { Question } from '../Question';
import { TransactionSettings } from '../Exchange/TransactionSettings';
import { Typographies } from '../../utils/Typography';
import { useSizeSmDown, useSizeXs } from '../Responsive';

export default function Settings({
  placeholderSlippage,
}: {
  placeholderSlippage?: Percent;
}) {
  const { chainId } = useActiveWeb3React();

  const node = useRef<HTMLDivElement>(null);
  const open = useModalOpen(ApplicationModal.SETTINGS);
  const toggle = useToggleSettingsMenu();

  const [expertMode, toggleExpertMode] = useExpertModeManager();

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly();

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false);

  useOnClickOutside(node, open ? toggle : undefined);

  const [ttl, setTtl] = useUserTransactionTTL();

  const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay();

  const isViewportXSmall = useSizeXs();
  const isViewportSmallDown = useSizeSmDown();

  return (
    <div className="relative flex" ref={node}>
      <div
        className="flex items-center justify-center w-8 h-8 rounded cursor-pointer"
        onClick={toggle}
        id="open-settings-dialog-button"
      >
        <CogIcon className="w-[26px] h-[26px] text-grey  opacity-30" />
      </div>
      {open && (
        <div
          className={`
            absolute 
            top-14 right-0 z-50 
            -mr-2.5 min-w-20 md:m-w-22 md:-mr-5 
            bg-background-2
            rounded-xl w-80 
            shadow-dark
        `}
        >
          <div className="p-4 space-y-4">
            <div className="font-bold">{`Transaction Settings`}</div>
            <TransactionSettings placeholderSlippage={placeholderSlippage} />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-text text-sm font-semibold">{`Toggle Expert Mode`}</div>
                <Question
                  className={Typographies['txSettings-question']}
                  text={`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`}
                />
              </div>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode();
                        setShowConfirmation(false);
                      }
                    : () => {
                        toggle();
                        setShowConfirmation(true);
                      }
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-text text-sm font-semibold">{`Disable Multihops`}</div>
                <Question
                  className={Typographies['txSettings-question']}
                  text={`Restricts swaps to direct pairs only.`}
                />
              </div>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() =>
                  singleHopOnly
                    ? setSingleHopOnly(false)
                    : setSingleHopOnly(true)
                }
              />
            </div>
            {/* {chainId == ChainId.MAINNET && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {`MEV Shield by Archer DAO`)}
                  </Typography>
                  <QuestionHelper
                    text={i18n._(
                      t`Send transaction privately to avoid front-running and sandwich attacks. Requires a miner tip to incentivize miners`
                    )}
                  />
                </div>
                <Toggle
                  id="toggle-use-archer"
                  isActive={userUseArcher}
                  toggle={() => setUserUseArcher(!userUseArcher)}
                />
              </div>
            )} */}
          </div>
        </div>
      )}

      <Modal
        isOpen={showConfirmation}
        onDismiss={() => setShowConfirmation(false)}
        maxWidth="500px"
        minWidth={
          isViewportSmallDown ? (isViewportXSmall ? '90vw' : '70vw') : 'none'
        }
      >
        <div className="space-y-4">
          <ModalHeader
            title={`Are you sure?`}
            onClose={() => setShowConfirmation(false)}
          />
          <div>
            {`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`}
          </div>
          <div className="text-xs text-danger text-center">
            {`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`}
          </div>
          <Button
            color="danger"
            className="w-full py-4 text-lg"
            onClick={() => {
              // if (window.prompt(`Please type the word "confirm" to enable expert mode.`)) === 'confirm') {
              //   toggleExpertMode()
              //   setShowConfirmation(false)
              // }
              toggleExpertMode();
              setShowConfirmation(false);
            }}
          >
            <div id="confirm-expert-mode">{`Turn On Expert Mode`}</div>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
