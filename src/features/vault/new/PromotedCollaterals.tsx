import { DraggableWheelableCarousel } from '../../../components-ui/Carousel/DraggableWheelableCarousel';
import { PromoteCollateralCard } from './PromoteCollateralCard';

export function PromotedCollaterals({ collaterals }) {
  const mapFn = (c) => {
    return <PromoteCollateralCard collateral={c} key={c.address} />;
  };
  return collaterals ? (
    <DraggableWheelableCarousel items={collaterals} mapFn={mapFn} />
  ) : null;
}
