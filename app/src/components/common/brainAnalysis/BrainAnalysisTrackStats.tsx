import type React from "react";
import type { BrainData } from "@/container/types_common";
import BrainWaveChart from "./charts/BrainWaveChart";
import AttentionMeditationChart from "./charts/AttentionMediationChart";
import BrainActivityCard from "./BrainActivityCard";
import { useEffect, useRef, useState } from "react";

interface BrainAnalysisTrackStatsProps {
  handleRecommendationsSubmit: (brainData: BrainData[]) => void;
  transmissionComplete: boolean;
  chartData: BrainData | null;
  seriesData: BrainData[];
  attentionMeditation: {
    name: string;
    data: { x: string; y: number }[];
  }[];
}

const BrainAnalysisTrackStats: React.FC<BrainAnalysisTrackStatsProps> = ({
  handleRecommendationsSubmit,
  transmissionComplete,
  chartData,
  seriesData,
  attentionMeditation
}) => {
  const termsCardRef = useRef<HTMLButtonElement>(null);
  const [flash, setFlash] = useState(false);
  // Brain wave configuration with colors
  const brainWaveConfig: Array<{
    key: keyof BrainData;
    title: string;
    color: string;
  }> = [
    { key: "delta", title: "Delta", color: "#8884d8" },
    { key: "theta", title: "Theta", color: "#82ca9d" },
    { key: "lowAlpha", title: "Low Alpha", color: "#ffc658" },
    { key: "highAlpha", title: "High Alpha", color: "#ff8042" },
    { key: "lowBeta", title: "Low Beta", color: "#0088FE" },
    { key: "highBeta", title: "High Beta", color: "#00C49F" },
    { key: "lowGamma", title: "Low Gamma", color: "#FFBB28" },
    { key: "highGamma", title: "High Gamma", color: "#FF8042" }
  ];

  const handleSubmitClick = () => {
    if (!transmissionComplete || seriesData.length === 0) return;
    handleRecommendationsSubmit(seriesData);
  };

  const handleScroll = () => {
    if (termsCardRef.current) {
      termsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    }
  };

  useEffect(() => {
    if (transmissionComplete) {
      handleScroll();
    }
  }, [transmissionComplete]);

  return (
    <div className="rounded-lg p-4 transition-all duration-300">
      <div className="relative mx-auto">
        {chartData && (
          <div className="space-y-4">
            <BrainActivityCard data={chartData} />
            <div className="space-y-4">
              <AttentionMeditationChart
                attentionMeditation={attentionMeditation}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {brainWaveConfig.slice(0, 4).map((wave) => (
                  <div key={wave.key}>
                    <BrainWaveChart
                      title={wave.title}
                      brainWaveKey={wave.key}
                      seriesData={seriesData}
                      color={wave.color}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {brainWaveConfig.slice(4).map((wave) => (
                  <div key={wave.key}>
                    <BrainWaveChart
                      title={wave.title}
                      brainWaveKey={wave.key}
                      seriesData={seriesData}
                      color={wave.color}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {transmissionComplete && (
        <div className="flex justify-center mt-6">
          <button
            ref={termsCardRef}
            onClick={handleSubmitClick}
            className={`next glow-next text-white font-bold rounded-lg px-6 py-3 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md ${
              flash ? "flash-bounce" : ""
            }`}
          >
            Генерирайте препоръки!
          </button>
        </div>
      )}
    </div>
  );
};

export default BrainAnalysisTrackStats;
