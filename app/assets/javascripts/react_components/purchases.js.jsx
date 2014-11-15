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
  render: function () {
    var purchases = this.state.purchases.map(function (purchase) {
      return (
          <Purchase purchase={purchase} />
      );
    }.bind(this));
    return (
      <div className="purchaseDisplay">
        <table className="table">
          <thead>
            <tr>
              <th>Select</th>
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
    return {book: []};
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
          <input type="checkbox"/>
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
