"use client"
import styles from "./page.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TableItem = {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

const COLUMNS = [
  { label: 'Date', renderCell: (item: TableItem) => item.date },
  {
    label: 'Open', renderCell: (item: TableItem) => item.open
  },
  {
    label: 'High', renderCell: (item: TableItem) => item.high
  },
  {
    label: 'Low', renderCell: (item: TableItem) => item.low
  },
  { label: 'Close', renderCell: (item: TableItem) => item.close },
  {
    label: 'Volume',
    renderCell: (item: TableItem) => item.volume,
  },
];

export default function Home() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [ticker, setTicker] = useState("IBM");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/stocks/${ticker}/daily`
      );
      const { chartData, tableData } = await response.json();
      chartData.datasets[0].borderColor = 'rgb(255, 99, 132)';
      chartData.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.5)';
      setChartData(chartData);
      setTableData(tableData);
    };
    fetchData();
  }, [ticker]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Stock Price for ${ticker}`,
      },
    },
  };

  const nodes = [
    {
      date: "2021-01-01",
      open: "100",
      close: "110",
      volume: "1000",
    },
    {
      date: "2021-01-02",
      open: "110",
      close: "120",
      volume: "2000",
    },
  ];

  const theme = useTheme(getTheme());

  return (
    <main className={styles.main}>
      <h1>Stock Chart</h1>
      <div>
        <div>
          <select onChange={(e) => setTicker(e.target.value)}>
            <option value="IBM">IBM</option>
            <option value="TSCO">TSCO</option>
            <option value="SHOP">SHOP</option>
          </select>
        </div>
        <Line options={options} data={chartData} height={500} width={800} />
      </div>

      <h1>Stock Table</h1>
      <div>
        <CompactTable columns={COLUMNS} data={{ nodes: tableData }} theme={theme} />
      </div>
    </main>
  );
}
