/** @jsx React.DOM */

var React = require('react');

var purchaseDisplayOptions= {
  OLD: 1,
  NEW: 2,
  ALL: 3,
};

var PurchaseDisplay = React.createClass({
  getInitialState: function () {
    return {purchases: [], selectedPurchases: []};
  },
  componentDidMount: function () {
    this._fetchPurchases({id: this.props.partnerId});
  },
  _fetchPurchases: function (id) {
    var isApproved;
    switch(this.props.purchaseDisplayOptions) {
      case purchaseDisplayOptions.OLD:
        isApproved = "true";
        break;
      case purchaseDisplayOptions.NEW:
        isApproved = "null";
        break;
      default:
        // have not implemented all option
        break;
    }
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/display_purchases",
      dataType: 'json',
      data: {
        id: id["id"],
        is_approved: isApproved
      },
      success: function (data) {
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
  _deselectAll: function () {
    this.setState({selectedPurchases: []});
  },
  _download: function () {
    $.ajax({
      url: "/admin/dashboard/csv",
      type: "POST",
      data: {
        purchases: this.state.selectedPurchases
      },
      success: function(data) {
        window.open( "data:text/csv;charset=utf-8," + escape(data));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _disapprove: function () {
    $.ajax({
      url: "/admin/dashboard/disapprove",
      type: "POST",
      data: {
        purchases: this.state.selectedPurchases
      },
      success: function(data) {
        this.props.refreshPurchases(this.props.partnerId);
        this._refreshPurchases();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _convertSelected: function () {
    $.ajax({
      url: "/admin/dashboard/convert",
      type: "POST",
      data: {
        purchases: this.state.selectedPurchases
      },
      success: function(data) {
        this.props.refreshPurchases(this.props.partnerId);
        this._refreshPurchases();
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
  _refreshPurchases: function () {
    var newPurchases = this.state.purchases;
    for (p in this.state.selectedPurchases) {
      var index = newPurchases.indexOf(p);
      newPurchases.splice(index, 1);
    }
    this.setState({purchases: newPurchases});
  },
  _toggleFlag: function(purchase, isFlagged) {
    $.ajax({
      url: "/admin/dashboard/" + purchase["id"] + "/toggle_flag",
      dataType: "json",
      type: "POST",
      data: {
        id: purchase["id"],
        is_flagged: isFlagged,
        flagged_id: gon.current_user.id
      },
      success: function(data) {
        var newPurchases = this.state.purchases;
        purchase["flagged"] = isFlagged;
        purchase["flagged_user_email"] = gon.current_user.email;
        newPurchases.splice(newPurchases.indexOf(purchase), 0, purchase);
        this.setState({purchases: newPurchases});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    var purchases = this.state.purchases.map(function (purchase) {
      var is_selected = this.state.selectedPurchases.indexOf(purchase["id"]) >= 0;
      return (
          <Purchase purchase={purchase}
                    changePurchaseState={this.changePurchaseState}
                    toggleFlag={this._toggleFlag}
                    selected={is_selected}
                    flagged={purchase["flagged"]}
                    key={purchase["id"]}
                    type={this.props.purchaseDisplayOptions} />
      );
    }.bind(this));
    var approvedOnHeader = "";
    var approveButtonText = "";
    if (this.props.purchaseDisplayOptions == purchaseDisplayOptions.OLD) {
      approvedOnHeader = "<th>Approved On</th>"
    }
    var isVip = gon.current_user.role == "vip";
    return (
      <div className="purchaseDisplay">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Purchased On</th>
              <th>ASIN</th>
            </tr>
          </thead>
          <tbody>
            {purchases}
          </tbody>
        </table>
        {isVip ?
          <div>
            <a id="selectAllButton" onClick={this._selectAll}>
              Select All</a>
            <a id="deselectAllButton" onClick={this._deselectAll}>
             Deselect All</a>
            <button type="button" id="downloadPurchaseButton" className="btn btn-default action" onClick={this._convertSelected}>
              Approve Purchases
            </button>
            <button type="button" id="disapproveButton" className="btn btn-default action" onClick={this._disapprove}>
              Disapprove Purchases
            </button>
            <button type="button" id="downloadButton" className="btn btn-default action" onClick={this._download}>
              Download
            </button>
          </div>
        : null }
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
    $('[data-toggle="tooltip"]').tooltip();
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps.flagged != this.props.flagged) {
      $('[data-placement="top"]').tooltip("destroy");
      $('[data-toggle="tooltip"]').tooltip();
    }
  },
  _fetchBook: function (bookId) {
    $.ajax({
      url: "/admin/dashboard/" + bookId["bookId"] + "/display_book",
      dataType: 'json',
      data: bookId,
      success: function (data) {
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
  _toggleFlag: function() {
    this.props.toggleFlag(this.props.purchase, !this.props.flagged);
  },
  render: function () {
    var toggleFunc = this.props.type == 2 ? this._toggleFlag : null;
    var purchaseClass = this.props.selected ? "info" : "";
    var isFlagged = this.props.flagged ? " flagged" : "";
    var flaggedUser = this.props.purchase.flagged_user_email;
    purchaseClass += isFlagged;
    return (
      <tr>
        <td className={purchaseClass} onClick={this._selectPurchase}>
          {this.state.book.title}
        </td>
        <td className={purchaseClass} onClick={this._selectPurchase}>
          {this.props.purchase.purchased_on}
        </td>
        <td className={purchaseClass} onClick={this._selectPurchase}>
          {this.state.book.asin}
        </td>
        <td className={purchaseClass} onClick={toggleFunc} data-placement="top"
            data-toggle={isFlagged ? "tooltip" : ""}
            data-original-title={"Flagged by: " + flaggedUser}>
          <img className={"flag"+isFlagged} src="/assets/flag.png" />
        </td>
      </tr>
    );
  }
});

module.exports = PurchaseDisplay;
