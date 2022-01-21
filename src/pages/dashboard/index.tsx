import Chart from '../../components-ui/Chart';
import {
  CollectedStabilityFeeGraph,
  CurrentCollateralizedGraph,
  HistoricSuppliesGraph,
  PaidBackGraph,
  SuppliesGraph,
} from '../../features/vault/Graph';
import { VaultManagerInfo } from '../../features/vault/VaultManagerInfo';
import { useVaultManagerHistories } from '../../services/graph/hooks/vault';

export default function Dashboard() {
  const data = useVaultManagerHistories();

  return (
    <div className="p-8 text-text">
      <VaultManagerInfo />
      <div
        className="
        grid grid-cols-1 gap-4 sm:grid-cols-2 w-full"
      >
        <div className="col-span-1 bg-background rounded-20">
          <SuppliesGraph data={data} />
        </div>

        <div className="col-span-1 bg-background rounded-20">
          <HistoricSuppliesGraph data={data} />
        </div>
        <div className="col-span-1 bg-background rounded-20">
          <CurrentCollateralizedGraph data={data} />
        </div>
        <div className="col-span-1 bg-background rounded-20">
          <PaidBackGraph data={data} />
        </div>

        <div className="col-span-1 bg-background rounded-20">
          <CollectedStabilityFeeGraph data={data} />
        </div>
      </div>
    </div>
  );
}
