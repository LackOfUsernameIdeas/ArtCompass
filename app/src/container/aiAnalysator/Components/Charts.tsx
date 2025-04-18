import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Infobox from "@/components/common/infobox/infobox";

// Интерфейс за свойствата на компонента
interface AverageMetricsTrendProps {
  seriesData: {
    record_date: string;
    average_precision_percentage: string;
    average_recall_percentage: string;
    average_f1_score_percentage: string;
  }[];
  onClick: () => void;
}

// Интерфейс за състоянието на компонента
interface AverageMetricsTrendState {
  options: ApexOptions;
  series: ApexAxisChartSeries;
}

// Компонент за визуализация на метриките
export class AverageMetricsTrend extends Component<
  AverageMetricsTrendProps,
  AverageMetricsTrendState
> {
  constructor(props: AverageMetricsTrendProps) {
    super(props);
    this.state = {
      options: this.getUpdatedOptions(),
      series: this.transformData(props.seriesData)
    };
  }

  componentDidUpdate(prevProps: AverageMetricsTrendProps) {
    if (prevProps.seriesData !== this.props.seriesData) {
      this.setState({ series: this.transformData(this.props.seriesData) });
    }
  }

  // Преобразуване на входните данни към подходящ формат за ApexCharts
  transformData(data: AverageMetricsTrendProps["seriesData"]) {
    return [
      {
        name: "Precision (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: parseFloat(entry.average_precision_percentage)
        }))
      },
      {
        name: "Recall (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: parseFloat(entry.average_recall_percentage)
        }))
      },
      {
        name: "F1 Score (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: parseFloat(entry.average_f1_score_percentage)
        }))
      }
    ];
  }

  // Опции за графиката
  getUpdatedOptions(): ApexOptions {
    return {
      chart: {
        type: "line",
        toolbar: { show: false }
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      markers: {
        size: 4
      },
      colors: ["#FF4560", "#00E396", "#008FFB"],
      xaxis: {
        type: "category",
        labels: { show: true }
      },
      yaxis: {
        labels: { show: true }
      },
      tooltip: {
        theme: "dark",
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const seriesName = w.config.series[seriesIndex].name;
          const value = w.config.series[seriesIndex].data[dataPointIndex].y;
          return `
            <div style="padding: 1rem;">
              <div class="opsilion" style="font-weight: bold;">${seriesName}</div>
              <div class="font-Equilibrist" style="font-family: 'Equilibrist', sans-serif;">${value}%</div>
            </div>
          `;
        }
      },
      legend: {
        position: "top", // Move the legend above the chart
        horizontalAlign: "center", // Center the legend horizontally
        floating: false, // Make the legend float
        fontSize: "12rem", // Set font size for the legend
        labels: {
          useSeriesColors: true // Use the series colors for the legend labels
        }
      }
    };
  }

  render() {
    return (
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Infobox onClick={this.props.onClick} />
        </div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
          width="100%"
        />
      </div>
    );
  }
}
