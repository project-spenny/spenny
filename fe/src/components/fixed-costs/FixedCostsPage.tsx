import FixedCostsAddButton from './FixedCostsAddButton';
import FixedCostsList from './FixedCostsList';

export default function FixedCostsPage() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-6 p-4 md:p-6 lg:p-8">
      <FixedCostsAddButton />

      <header>
        <h1 className="text-xl font-semibold">고정비 관리</h1>
      </header>
      <FixedCostsList />
    </div>
  );
}
