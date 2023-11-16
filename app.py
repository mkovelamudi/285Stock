import os
import requests
import json
from flask import Flask, request, Response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

""" Stocks for investment strategies"""

#The stocks are ordered in the best stock first
#As per the team decision we decided to spread the amount into 3 different parts
# 1st stock gets 50% of amount to be invested
# 2nd stock gets 30% of amount to be invested
# 3rd stock gets 20% of amount to be invested
strategy_ethical_investing = ["AAPL", "TSLA", "ADBE"]
strategy_growth_investing = ["OXLC", "ECC", "AMD"]
strategy_index_investing = ["VOO", "VTI", "ILTB"]
strategy_quality_investing = ["NVDA", "MU", "CSCO"]
strategy_value_investing = ["INTC", "BABA", "GE"]

def get_stock_quote(stock_list):
    """Function that calls stock API for each stock to fetch stock details"""
    get_data = '?token=pk_12347229443d4adebb035a0e1b17a633&filter=symbol,companyName,latestPrice,latestTime,change,changePercent'
    stock_details = []
    for ticker in stock_list:
        request = 'https://cloud.iexapis.com/v1/stock/{}/quote/{}'.format(ticker, get_data)
        resp = requests.get('https://cloud.iexapis.com/v1/stock/{}/quote/{}'.format(ticker, get_data))
        stock_details.append(resp.json())

    return stock_details

@app.route('/')
def hello_world():
    print ("hello world")

@app.route('/getData', methods=['POST'])
@cross_origin(origin='*')
def return_data():
    Strategies = request.json['Strategies']
    Amount = request.json['Amount']
    response = []
    amt1 = Amount*0.5
    amt2 = Amount*0.30
    amt3 = Amount*0.20
    responseAmount = []

    responseAmount.append(amt1)
    responseAmount.append(amt2)
    responseAmount.append(amt3)

    stock_result_pieChart = []

    for x in Strategies:
        if x == "Ethical Investing":
            response.append(get_stock_quote(strategy_ethical_investing))
            print(response)
            stock_result_pieChart.append({"title": strategy_ethical_investing[0], "value": amt1})
            stock_result_pieChart.append({"title": strategy_ethical_investing[1], "value": amt2})
            stock_result_pieChart.append({"title": strategy_ethical_investing[2], "value": amt3})
        elif x == "Quality Investing":
            response.append(get_stock_quote(strategy_quality_investing))
            stock_result_pieChart.append({"title": strategy_quality_investing[0], "value": amt1})
            stock_result_pieChart.append({"title": strategy_quality_investing[1], "value": amt2})
            stock_result_pieChart.append({"title": strategy_quality_investing[2], "value": amt3})
        elif x == "Index Investing":
            response.append(get_stock_quote(strategy_index_investing))
            stock_result_pieChart.append({"title": strategy_index_investing[0], "value": amt1})
            stock_result_pieChart.append({"title": strategy_index_investing[1], "value": amt2})
            stock_result_pieChart.append({"title": strategy_index_investing[2], "value": amt3})
        elif x == "Value Investing":
            response.append(get_stock_quote(strategy_value_investing))
            stock_result_pieChart.append({"title": strategy_value_investing[0], "value": amt1})
            stock_result_pieChart.append({"title": strategy_value_investing[1], "value": amt2})
            stock_result_pieChart.append({"title": strategy_value_investing[2], "value": amt3})
        elif x == "Growth Investing":
            response.append(get_stock_quote(strategy_growth_investing))
            stock_result_pieChart.append({"title": strategy_growth_investing[0], "value": amt1})
            stock_result_pieChart.append({"title": strategy_growth_investing[1], "value": amt2})
            stock_result_pieChart.append({"title": strategy_growth_investing[2], "value": amt3})
        else:
            response.append("Invalid Strategy")

    response_details = {"strategiesResponse": response, "amountResponse": responseAmount, "piechartResponse": stock_result_pieChart}
    response=Response(json.dumps(response_details), mimetype='application/json')
    return response


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port = 8080)