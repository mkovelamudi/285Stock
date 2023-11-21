import React from "react";
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FF8042",
  "#21618C",
  "#F4D03F",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
];

const RADIAN = Math.PI / 180;

export class StockPieChart extends React.Component {
  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {/* {`${this.props.data[index].title} (${(percent * 100).toFixed(0)}%)`} */}
        {this.props.data[index].title + ":"}
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  state = {
    data: [],
    labels: [],
    loading: true,
  };

  async componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    if (typeof this.props.data == "undefined"|| this.props.data.length == 0) return; // Don't fetch if URL is not available
    this.setState({ loading: true });
    try {
      this.setState({data: this.props.data})
      this.setState({labels: this.renderCustomizedLabel})
      this.setState({loading: false})
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ loading: false });
    }
  }

  render() {
    const { final, resp, loading } = this.state;

      if (loading) {
        return <div>Loading...</div>;
      }
    // console.log("before returning")
    // console.log(this.state.labels)
    return (
      <PieChart
        onMouseEnter={this.onPieEnter}
        width={700}
        height={600}
        style={{ marginTop: "-100px" }}
      >
        <Pie
          data={this.state.data}
          cx={450}
          cy={350}
          labelLine={false}
          label={this.state.labels}
          outerRadius={180}
          fill=""
        >
          {this.props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
}
