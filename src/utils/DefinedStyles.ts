export const DefinedStyles = {
  modalHeader: 'text-2xl font-bold capitalize',
  copierCopied: 'italic',
  swapError: 'text-danger font-semibold text-sm text-center',
  swapButton: 'font-bold !py-5 !px-4 !text-lg w-full',
  swapButtonError: 'font-bold !py-5 !px-4 !text-lg w-full !text-text',
  fullButton: 'font-bold !py-4 !px-4 !text-xl w-full',
  button: 'font-bold !py-4 !px-4 !text-xl',
  liquidityButton: 'font-bold text-base !px-3 !py-3',
  horizontalDivider: 'border-r border-grey',
  divider: 'border-t border-divider mt-2 mb-2',
  'txSettings-text': 'text-white !text-opacity-50',
  'txSettings-auto': '!text-white text-md',
  'txSettings-question': 'text-white !text-opacity-50',
  tradePriceSwitcher: 'text-white !text-opacity-50',
  'page-outer-content': `
  w-full md:max-w-[600px] p-8`,
  pageAlertFull: 'w-full mb-6',
  pageAlertMaxed: 'w-full md:max-w-[600px] mb-6',
  page: 'pt-[10%] pb-[60px] md:pt-0 max-w-[1500px]',
  pageContent: `
    w-full
    md:max-w-[600px]
    md:bg-background
    rounded-20 p-0 sm:p-5
    text-text
  `,
  manageTab: ` 
    flex items-center justify-center 
    px-4 py-2
    rounded-full
    cursor-pointer
   `,
  manageTabActive: `
    bg-opaque
    border
    border-opaque-border
    text-text
    font-bold
  `,
  importList: `
    border 
    rounded-20 
    flex items-center p-4
    duration-200
    cursor-pointer
  `,
  scrollPrimary: `
    scrollbar-thin scrollbar-thumb-primary 
    scrollbar-thumb-rounded-20 
    scrollbar-track-scrollbar-track 
    scrollbar-track-rounded-20`,
  importRow: `
  flex items-center 
  space-x-3
  bg-opaque-secondary 
  rounded-20
  pl-1 pr-3 sm:pl-4 sm:pr-4 py-3`,
  importRowTransparent: `
  flex items-center space-x-3
  bg-transparent 
  pl-1 pr-3 sm:pl-3 sm:pr-3 py-3`,
  step:
    'rounded-full bg-opaque-secondary w-8 h-8 flex items-center justify-center',
  vaultPanel: 'rounded-20 p-4 bg-dark-2 text-text',
  collateralizePanel: `bg-opaque
    rounded-20 p-4 
    w-full 
    backdrop-blur-[200px] 
    bg-background
    md:px-8
    md:py-12`,
  collateralizePanelContent: 'w-full flex flex-col space-y-4',
};
