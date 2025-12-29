const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  return (
    <div>
      <div>{selectedDate.getMonth() + 1}월</div>
      <div>총 지출 0원</div>
    </div>
  );
};

export default ExpenseAnalysis;
