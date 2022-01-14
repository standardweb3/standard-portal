import { ResponsiveContainer } from 'recharts';
import { Modal } from '../Modal';
import { Question } from '../Question';
import { useSizeXs } from '../Responsive';

function ExpandedChart({
  open,
  handleClose,
  renderChart,
  data,
  infoTooltipMessage,
  headerText,
  headerSubText,
  runwayExtraInfo,
}) {
  const verySmallScreen = useSizeXs();

  return (
    <Modal isOpen={open} onDismiss={handleClose}>
      <div className="ohm-card ohm-popover">
        <div className="chart-card-header">
          <div className="flex">
            <div className="flex items-center whitespace-nowrap max-w-max">
              <div>{headerText}</div>
            </div>

            <div className="flex justify-between items-center w-full">
              <div>
                <Question text={infoTooltipMessage} />
              </div>
              <div onClick={handleClose}>Close</div>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div>{headerSubText}</div>
            {runwayExtraInfo}
            <div>Today</div>
          </div>
        </div>

        <div className="w-full min-w-[300px]">
          {data && data.length > 0 && (
            <ResponsiveContainer minHeight={260} minWidth={300}>
              {renderChart}
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex w-full">
          <div>{infoTooltipMessage}</div>
        </div>
      </div>
    </Modal>
  );
}

export default ExpandedChart;
