/** @jsx React.DOM */

var PurchaseDisplay = React.createClass({
  getInitialState: function () {
    return {purchases: []};
  },
  componentDidMount: function () {
    this._fetchPurchases({id: this.props.partnerId});
  },
  _fetchPurchases: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/display_purchases",
      dataType: 'json',
      data: id,
      success: function (data) {
        console.log(data);
        this.setState({purchases: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _selectAll: function () {
    checked = document.getElementsByName("source")[0].checked;
    checkboxes = document.getElementsByName("purchaseCheckbox");
    for(var i=0, n=checkboxes.length; i<n; i++) {
      checkboxes[i].checked = checked;
    }
  },
  selectPurchase: function () {
    
  },
  render: function () {
    var purchases = this.state.purchases.map(function (purchase) {
      return (
          <Purchase purchase={purchase} selectPurchase={this.selectPurchase} />
      );
    }.bind(this));
    return (
      <div className="purchaseDisplay">
        <table className="table">
          <thead>
            <tr>
              <th><input type="checkbox" name="source"
                onClick={this._selectAll} /> Select All</th>
              <th>Book Name</th>
              <th>Purchased On</th>
            </tr>
          </thead>
          <tbody>
            {purchases}
          </tbody>
        </table>
      </div>
    );  
  }
});

var Purchase = React.createClass( {
  getInitialState: function () {
    return {book: [], selected: false};
  },
  componentDidMount: function () {
    this._fetchBook({bookId: this.props.purchase.book_id});
  },
  _fetchBook: function (bookId) {
    $.ajax({
      url: "/admin/dashboard/" + bookId["bookId"] + "/display_book",
      dataType: 'json',
      data: bookId,
      success: function (data) {
        console.log(data);
        this.setState({book: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <tr>
        <td>
          <input type="checkbox" name="purchaseCheckbox"/>
        </td>
        <td>
          {this.state.book.name}
        </td>
        <td>
          {this.props.purchase.purchased_on}
        </td>
      </tr>
    );
  }
});
