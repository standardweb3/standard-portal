import { XIcon } from '@heroicons/react/outline';
import { ResponsiveContainer } from 'recharts';
import { Modal } from '../Modal';
import { Question } from '../Question';
import { useSizeSmDown, useSizeXs } from '../Responsive';

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
  const isViewportXSmall = useSizeXs();
  const isViewportSmallDown = useSizeSmDown();

  return (
    <Modal
      isOpen={open}
      onDismiss={handleClose}
      minWidth={
        isViewportSmallDown ? (isViewportXSmall ? '90vw' : '70vw') : 'none'
      }
    >
      <div className="w-full">
        <div className="chart-card-header">
          <div className="flex space-x-1">
            <div className="flex items-center whitespace-nowrap max-w-max">
              <div>{headerText}</div>
            </div>

            <div className="flex justify-between items-center w-full">
              <div>
                <Question text={infoTooltipMessage} />
              </div>
              <XIcon className="w-4 h-4 cursor-pointer" onClick={handleClose} />
            </div>
          </div>

          <div className="flex flex-wrap text-primary">
            <div>{headerSubText}</div>
            <div>{runwayExtraInfo}</div>
          </div>
        </div>

        <div className="w-full min-w-[225px] mt-4">
          {data && data.length > 0 && (
            <ResponsiveContainer minHeight={195} minWidth={225}>
              {renderChart}
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex w-full text-grey">
          <div>{infoTooltipMessage}</div>
        </div>
      </div>
    </Modal>
  );
}

export default ExpandedChart;
