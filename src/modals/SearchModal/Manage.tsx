import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import CurrencyModalView from './CurrencyModalView';
import ManageLists from './ManageLists';
import ManageTokens from './ManageTokens';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';
import { Token } from '@digitalnativeinc/standard-protocol-sdk';
import { TokenList } from '@uniswap/token-lists';
import styled from '@emotion/styled';
import 'react-tabs/style/react-tabs.css';
import { Typographies } from '../../utils/Typography';
import { classNames } from '../../functions';

const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1;
  position: relative;
  overflow-y: hidden;
`;

function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ContentWrapper>
      <ModalHeader
        onClose={onDismiss}
        title={`Manage`}
        onBack={() => setModalView(CurrencyModalView.search)}
      />
      <Tabs
        forceRenderTabPanel
        selectedIndex={tabIndex}
        onSelect={(index: number) => setTabIndex(index)}
        className="flex flex-col flex-grow mt-6"
      >
        <TabList
          className="
        rounded-full
        text-grey
        self-start
        flex items-center
        bg-opaque-inactive"
        >
          <Tab
            className={Typographies.manageTab}
            selectedClassName={Typographies.manageTabActive}
          >
            Lists
          </Tab>
          <Tab
            className={Typographies.manageTab}
            selectedClassName={Typographies.manageTabActive}
          >
            Tokens
          </Tab>
        </TabList>
        <TabPanel style={{ flexGrow: 1 }}>
          <ManageLists
            setModalView={setModalView}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        </TabPanel>
        <TabPanel style={{ flexGrow: 1 }}>
          <ManageTokens
            setModalView={setModalView}
            setImportToken={setImportToken}
          />
        </TabPanel>
      </Tabs>
    </ContentWrapper>
  );
}

export default Manage;
