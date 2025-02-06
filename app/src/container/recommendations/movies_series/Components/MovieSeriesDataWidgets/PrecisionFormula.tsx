import type React from "react";

interface PrecisionFormulaProps {
  relevantCount: number;
  totalCount: number;
  precisionValue: number;
}

const PrecisionFormula: React.FC<PrecisionFormulaProps> = ({
  relevantCount,
  totalCount,
  precisionValue
}) => {
  const precisionPercentage = (precisionValue * 100).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full space-x-4">
        <div className="text-2xl font-serif italic">Precision = </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-serif">{relevantCount}</div>
          <div className="w-full border-t border-gray-400 my-1"></div>
          <div className="text-2xl font-serif">{totalCount}</div>
        </div>
        <div className="text-2xl font-serif">= {precisionValue.toFixed(4)}</div>
      </div>
      <div className="text-lg text-gray-600 text-center">
        <div>където:</div>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <i className="ti ti-checklist text-xl"></i>
          <span>{relevantCount} = Брой релевантни неща</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <i className="ti ti-list text-xl"></i>
          <span>{totalCount} = Брой на препоръки</span>
        </div>
      </div>
      <div className="text-xl font-semibold text-gray-800 text-center">
        Precision = {precisionPercentage}%
      </div>
    </div>
  );
};

export default PrecisionFormula;
