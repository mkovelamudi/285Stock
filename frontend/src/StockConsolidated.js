import React, { Component, PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Divider, Spin, Row, Col, Card } from 'antd';
import axios from 'axios';

  // export default function StockConsolidated(data) {
  //     return (
  //         <BarChart
  //           width={700}
  //           height={300}
  //           data={data}
  //           margin={{
  //             top: 5,
  //             right: 30,
  //             left: 20,
  //             bottom: 5,
  //           }}
  //         >
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis dataKey="name" />
  //           <YAxis />
  //           <Tooltip />
  //           <Legend />
  //           <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
  //           <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
  //           <Bar dataKey="dv" fill="#82ca9g" activeBar={<Rectangle fill="black" stroke="red" />} />
  //         </BarChart>
  //     );
  //   }

  class StockConsolidated extends Component {
    state = {
      data: [],
      response_data: [],
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
      // const { symbols_data } = this.props.data;
      this.setState({ loading: true });
      try {
        const symbols_data = this.props.data
        // console.log('Inside StockConsolidated')
        // console.log(symbols_data)
        // if(symbols_data)
        let postBody = {}
        postBody.Symbols = symbols_data
        const response = await axios.post(`http://127.0.0.1:5000/getIndividualData`, postBody);
        // console.log('response')
        // console.log(JSON.stringify(response))
        this.setState({ response_data: response.data.SymbolsData, loading: false});
        // console.log(this.state.response_data)

        const temp = []
        for(let i=0; i< this.state.response_data[0].length; i++){
          const record ={}
          record.name = this.state.response_data[0][i]['priceDate']
          const symbol1 = this.state.response_data[0][i]['symbol']
          const price1 = this.state.response_data[0][i]['close']
          record[symbol1] = price1
          const symbol2 = this.state.response_data[1][i]['symbol']
          const price2 = this.state.response_data[1][i]['close']
          record[symbol2] = price2
          const symbol3 = this.state.response_data[2][i]['symbol']
          const price3 = this.state.response_data[2][i]['close']
          record[symbol3] = price3

          // console.log("record")
          // console.log(record)
          temp.push(record)
          // console.log(temp)
        }
        console.log("temp")
        console.log(temp)
        this.setState({ data: temp, loading: false});
        console.log(this.state.data)
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

      return (
        <BarChart
          width={700}
          height={300}
          data={this.state.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey= {this.state.response_data[0][1]['symbol']} fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey={this.state.response_data[1][1]['symbol']} fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          <Bar dataKey={this.state.response_data[2][1]['symbol']} fill="#82ca9g" activeBar={<Rectangle fill="black" stroke="red" />} />
        </BarChart>
        );
  }
}

export default StockConsolidated
  
  