import styled from '@emotion/styled';
import { useMemo } from 'react';
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../public/static/charting_library/charting_library';
import { useDatafeed } from '../../features/tvchart/datafeed2';

const TVChartContainerDiv = styled.div`
  height: calc(100vh - 80px);
`;

export default function TV({ allBars, resolution, symbol }) {
  const datafeed = useDatafeed(allBars, resolution, symbol);

  const widgetOptions = useMemo(() => {
    return {
      symbol: symbol,
      datafeed,
      interval: '5' as ResolutionString,
      container: 'tv_chart_container',
      library_path: '/static/charting_library/',
      locale: 'en' as LanguageCode,
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: 'https://saveload.tradingview.com' as ChartingLibraryWidgetOptions['charts_storage_url'],
      charts_storage_api_version: '1.1' as ChartingLibraryWidgetOptions['charts_storage_api_version'],
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
    };
  }, [allBars, resolution, datafeed]);

  const tvWidget = useMemo(() => {
    datafeed.onReady(() => {
      return new widget(widgetOptions);
    });
  }, [widgetOptions, datafeed]);

  return (
    <TVChartContainerDiv
      id={'tv_chart_container'}
      className={'min-h-[1000px]'}
    />
  );
}
