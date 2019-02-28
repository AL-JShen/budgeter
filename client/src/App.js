import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Transaction from './components/transaction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const axios = require('axios');
const moment = require('moment');

const server = 'localhost:3000';

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
    const promise = axios.get(`${server}/history`);
    promise.then((response) => {
      this.setState({
        response: response.data
      });
    });
  }

  clearHistory() {
    //eslint-disable-next-line
    if (confirm('Are you sure you want to clear all transactions?')) {
      const promise = axios.post(`${server}/clear-history`, '');
    };
  }

  recordTrans() {

    const trans = {
      category: document.getElementById('inputCategory').value,
      price: document.getElementById('inputPrice').value,
      date: new Date(this.state.startDate.toDate().toDateString())
    };

    if (trans.category && trans.price) {
      const promise = axios.post(`${server}/new-trans`, trans);
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
    const promise = axios.post(`${server}/remove-item`, id);
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

   sortByDate(data) {
     data.sort((a, b) => {
       return a.date - b.date;
     })
     return data;
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
              <div className='transaction' key={index}>
                <Transaction transaction={transaction} removeItem={this.removeItem}/>
              </div>
            )
          })}
        </div>


      </div>

    );
  }
}

export default App;
