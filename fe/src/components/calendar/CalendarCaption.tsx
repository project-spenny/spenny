'use client'

import { MonthCaptionProps } from "react-day-picker";
import { Card, CardTitle,CardContent } from "../ui/card";

interface CalendarCaptionProps extends MonthCaptionProps{
      income : number;
      expense: number;
}
const CalendarCaption = ({income, expense}: CalendarCaptionProps) => {
    return (
      <div className="flex w-full gap-2 p-2 sm:flex-row sm:gap-4">
        <Card className="w-full items-center gap-2">
          <CardTitle className="text-xs sm:text-base">이번 달 수입</CardTitle>
          <CardContent className="text-xs text-blue-600 sm:text-base">
            {income.toLocaleString()}원
          </CardContent>
        </Card>
        <Card className="w-full items-center gap-2">
          <CardTitle className="text-xs sm:text-base">이번 달 지출</CardTitle>
          <CardContent className="text-xs text-red-600 sm:text-base">
            {expense.toLocaleString()}원
          </CardContent>
        </Card>
      </div>
    );
  };