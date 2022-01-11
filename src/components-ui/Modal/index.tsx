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
  minWidth?: string;
  maxWidth?: string;
};

type StyledDialogContentProps = {
  minHeight?: string | false;
  maxHeight?: string;
  minWidth?: string;
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
    background-color: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
`;
const AnimatedDialogContent = animated(DialogContent);
const StyledDialogContent = styled(
  ({
    minWidth,
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
    overflow-y: auto;
    overflow-x: hidden;
    display: inline-block;

    ${({ minWidth }) =>
      minWidth &&
      css`
        min-width: ${minWidth};
      `}

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
        height: 1px;
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
  minWidth,
  maxWidth,
}: ModalProps) {
  const modalTranstion = useTransition(isOpen, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return modalTranstion(
    (styles, item) =>
      item && (
        <StyledDialogOverlay
          // key={item.key}
          style={styles}
          onDismiss={onDismiss}
          initialFocusRef={initialFocusRef}
        >
          <StyledDialogContent
            aria-label="dialog content"
            minHeight={minHeight}
            maxHeight={maxHeight}
            minWidth={minWidth}
            maxWidth={maxWidth}
            mobile={isMobile}
            className="rounded-20"
          >
            <div
              className={classNames(
                `text-text
                 h-full
                 rounded-xl
                 px-4 py-6
                 sm:px-8 sm:py-8
                 bg-background`,
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
