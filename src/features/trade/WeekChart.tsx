import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useSizeMdDown, useSizeXs } from '../../components-ui/Responsive';

export default function WeekChart({ value }) {
  const isViewportXs = useSizeXs();
  const isViewportMdDown = useSizeMdDown();
  return (
    <Sparklines
      data={value.data?.map((d) => d.priceUSD) ?? []}
      limit={7}
      svgWidth={isViewportMdDown ? (isViewportXs ? 70 : 130) : 160}
      svgHeight={30}
    >
      <SparklinesLine
        style={{
          strokeWidth: 3,
          stroke: 'currentColor',
          fill: 'none',
        }}
      />
    </Sparklines>
  );
}
