import '@reach/dialog/styles.css';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import { animated, useTransition } from 'react-spring';

import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { isMobile } from 'react-device-detect';
import { ReactNode } from 'react';
import { classNames } from '../../functions';

export type ModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  initialFocusRef?: React.RefObject<any>;
  children?: ReactNode;
  className?: string;
  minHeight?: string | false;
  maxHeight?: string;
  maxWidth?: string;
};

type StyledDialogContentProps = {
  minHeight?: string | false;
  maxHeight?: string;
  maxWidth?: string;
  mobile: boolean;
  [key: string]: any;
};

const AnimatedDialogOverlay = animated(DialogOverlay);
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  backdrop-filter: blur(5px);
  &[data-reach-dialog-overlay] {
    z-index: 10;
    padding: 0;
    background-color: rgba(14, 5, 37, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
`;
const AnimatedDialogContent = animated(DialogContent);
const StyledDialogContent = styled(
  ({
    maxWidth,
    maxHeight,
    minHeight,
    mobile,
    ...rest
  }: StyledDialogContentProps) => <AnimatedDialogContent {...rest} />,
)`
  &[data-reach-dialog-content] {
    background-color: transparent;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    margin: 4rem 0.5rem;
    padding: 0;
    width: 100vw;
    overflow-y: auto;
    overflow-x: hidden;

    ${({ maxWidth }) =>
      maxWidth &&
      css`
        max-width: ${maxWidth};
      `}

    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight};
      `}

    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight};
      `}
  }
`;

export function Modal({
  children,
  className,
  initialFocusRef,
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight,
  maxWidth,
}: ModalProps) {
  const modalTranstion = useTransition(isOpen, {
    config: { duration: 150 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return modalTranstion(
    (styles, item) =>
      item && (
        <StyledDialogOverlay
          key={item.key}
          style={styles}
          onDismiss={onDismiss}
          initialFocusRef={initialFocusRef}
        >
          <StyledDialogContent
            aria-label="dialog content"
            minHeight={minHeight}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            mobile={isMobile}
          >
            <div
              className={classNames(
                'text-text',
                'rounded-xl p-8',
                // 'backdrop-filter backdrop-blur',
                'bg-modal-background',
                className ?? '',
              )}
            >
              {children}
            </div>
          </StyledDialogContent>
        </StyledDialogOverlay>
      ),
  );
}
