/** @jsx React.DOM */

var PurchaseDisplay = React.createClass({
  getInitialState: function () {
    return {purchases: [], selectedPurchases: []};
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
    this.setState({selectedPurchases: this.state.purchases.map(function (x) {
      return x["id"];
    })});
  },
  _download: function () {
    var myAjaxVariable = null;
    $.ajax({
      url: "/admin/dashboard/csv",
      type: "POST",
      async : false,
      data: {
        purchases: this.state.selectedPurchases
      },
      success: function(data) {
        myAjaxVariable = data;
        this._convertSelected();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    window.open( "data:text/csv;charset=utf-8," + escape(myAjaxVariable));
  },
  _convertSelected: function () {
    $.ajax({
      url: "/admin/dashboard/convert",
      type: "POST",
      data: {
        purchases: this.state.selectedPurchases
      },
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  changePurchaseState: function (id, is_selected) {
    selected = this.state.selectedPurchases;
    if (is_selected) {
      selected.push(id);
    } else {
      selected.splice(selected.indexOf(id), 1);
    }
    this.setState({selectedPurchases: selected});
  },
  render: function () {
    var purchases = this.state.purchases.map(function (purchase) {
      var is_selected = this.state.selectedPurchases.indexOf(purchase["id"]) >= 0;
      return (
          <Purchase purchase={purchase} changePurchaseState={this.changePurchaseState}
            selected={is_selected}/>
      );
    }.bind(this));
    return (
      <div className="purchaseDisplay">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Purchased On</th>
            </tr>
          </thead>
          <tbody>
            {purchases}
          </tbody>
        </table>
        <button type="button" id="selectAllButton" className="btn btn-default" onClick={this._selectAll}>
          Select All Purchases</button>
        <button type="button" id="downloadPurchaseButton" className="btn btn-default" onClick={this._download}>
          Download Purchases As CSV</button>
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
  _selectPurchase: function () {
    this.props.changePurchaseState(this.props.purchase["id"], !this.props.selected)
  },
  render: function () {
    var is_selected = this.props.selected ? "info" : "";
    return (
      <tr>
        <td className={is_selected} onClick={this._selectPurchase}>
          {this.state.book.name}
        </td>
        <td className={is_selected} onClick={this._selectPurchase}>
          {this.props.purchase.purchased_on}
        </td>
      </tr>
    );
  }
});
