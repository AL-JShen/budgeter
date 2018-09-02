import React, { Component } from 'react';

class Transaction extends Component {

  render() {
    return (
      <div>
        A {this.props.transaction.category} purchase on {this.props.transaction.date} cost ${this.props.transaction.price}

        <button className='removeTransaction' onClick={() => this.props.removeItem(this.props.transaction)}>Remove.</button>
      </div>
    );
  }

}

export default Transaction;
