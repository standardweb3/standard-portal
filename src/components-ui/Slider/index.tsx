import { classNames } from '../../functions';

export function Slider({ children, isOpen }) {
  return (
    <div
      className={classNames(
        `
        backdrop-blur-2xl
        z-50
        absolute w-full h-full 
        bg-opaque-slider
        transition-all
        !duration-200
        bottom-full
        opacity-0
        `,
        isOpen && '!bottom-0 !opacity-100',
      )}
    >
      {children}
    </div>
  );
}

// const CrumbleWrapper = styled.div<{ rot?: boolean }>`
//   width: 100%;
//   height: 100%;
//   display: inline-flex;
//   justify-content: center;
//   ${css`
//     animation: ${crumble} 0.5s cubic-bezier(0, 0.2, 0.8, 1) normal forwards;
//   `}
// `;
