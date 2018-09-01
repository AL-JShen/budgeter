import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const axios = require('axios');
const moment = require('moment');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      response: [],
      startDate: moment(),
    };
    this.recordTrans = this.recordTrans.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleDate = this.handleDate.bind(this);
  }

  getHistory() {
    const promise = axios.get('http://localhost:3000/history');
    promise.then((response) => {
      this.setState({
        response: response.data
      });
    });
  }

  clearHistory() {
    const promise = axios.post('http://localhost:3000/clear-history', '');
  }

  recordTrans() {

    const trans = {
      category: document.getElementById('inputCategory').value,
      price: document.getElementById('inputPrice').value,
      date: this.state.startDate.format('MMMM D YYYY')
    };

    if (trans.category && trans.price) {
      const promise = axios.post('http://localhost:3000/new-trans', trans);
      promise.then((response) => {
        this.getHistory();
      });

      document.getElementById('inputCategory').value = '';
      document.getElementById('inputPrice').value = '';
      document.getElementById('inputDate').value = '';
      this.setState({
        startDate: moment(),
      })
    };
  }

  removeItem(id) {
    const promise = axios.post('http://localhost:3000/remove-item', id);
    promise.then((response) => {
      this.getHistory();
    });
  }

  handleDate(date) {
    this.setState({
      startDate: date
    });
  }

  componentWillMount() {
    this.getHistory();
  }

  render() {
    return (
      <div className="App">

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>

        <div className='clearTransactions'>
            <button onClick={this.clearHistory}>
                Clear history.
            </button>
        </div>

          <form className='submitTrans' onSubmit={this.recordTrans}>
            <input id='inputCategory' type='string' placeholder='category'/>
            <input id='inputPrice' type='string' placeholder='price'/>
            <DatePicker selected={this.state.startDate} onChange={this.handleDate} dateFormat="MMMM D YYYY"/>
            <button type='submit'>
                Record transaction.
            </button>
          </form>

        <div className='showTransactions'>
          {this.state.response.reverse().map((transaction, index) => {
            return (
              <div key={index}>
                A {transaction.category} purchase on {transaction.date} cost ${transaction.price}
                <button className='removeTransaction' onClick={() => this.removeItem(transaction)}>Remove transaction.</button>
              </div>
            )
          })}
        </div>

        {this.state.date}

      </div>

    );
  }
}

export default App;
