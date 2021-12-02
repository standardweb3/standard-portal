import * as React from 'react';
import DataFeed from '../../features/tvchart/datafeed';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  IChartingLibraryWidget,
  ResolutionString,
} from '../../../public/static/charting_library';
import styled from '@emotion/styled';

const TVChartContainerDiv = styled.div`
  height: calc(100vh - 80px);
`;

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  // BEWARE: no trailing slash is expected in feed URL
  // datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  container: ChartingLibraryWidgetOptions['container'];
}

export interface ChartContainerState {}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export class TVChartContainer extends React.PureComponent<
  Partial<ChartContainerProps>,
  ChartContainerState
> {
  public static defaultProps: ChartContainerProps = {
    symbol:
      '336/0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef/0x722377a047e89ca735f09eb7cccab780943c4cb4/WSDN/STND',
    interval: '5' as ResolutionString,
    container: 'tv_chart_container',
    // datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/static/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  private tvWidget: IChartingLibraryWidget | null = null;

  public componentDidMount(): void {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this.props.symbol as string,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: DataFeed,
      interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
      container: this.props
        .container as ChartingLibraryWidgetOptions['container'],
      library_path: this.props.libraryPath as string,

      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
    };

    DataFeed.onReady(() => {
      const tvWidget = new widget(widgetOptions);
      this.tvWidget = tvWidget;

      tvWidget.onChartReady(() => {
        console.log('Chart has loaded');
        //   tvWidget.headerReady().then(() => {
        //     const button = tvWidget.createButton();
        //     button.setAttribute('title', 'Click to show a notification popup');
        //     button.classList.add('apply-common-tooltip');
        //     button.addEventListener('click', () =>
        //       tvWidget.showNoticeDialog({
        //         title: 'Notification',
        //         body: 'TradingView Charting Library API works correctly',
        //         callback: () => {
        //           console.log('Noticed!');
        //         },
        //       }),
        //     );
        //     button.innerHTML = 'Check API';
        //   });
        // });
      });
    });
  }

  public componentWillUnmount(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  public render(): JSX.Element {
    return (
      <TVChartContainerDiv
        id={'tv_chart_container'}
        className={'min-h-[1000px]'}
      />
    );
  }
}
