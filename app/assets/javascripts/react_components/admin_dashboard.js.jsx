/** @jsx React.DOM */

var Dashboard = React.createClass({
  getInitialState: function () {
    return {partners: [], selectedPartner: null};
  },
  componentDidMount: function () {
    this._fetchPartners({});
  },
  _fetchPartners: function (search_data) {
    $.ajax({
      url: "/admin/dashboard/display_partners",
      dataType: 'json',
      data: search_data,
      success: function (data) {
        console.log(data);
        this.setState({partners: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _handleOnSearchSubmit: function (search) {
    this._fetchPartners({search_data: search});
  },
  _selectPartner: function (partnerId) {
    this.setState({selectedPartner: partnerId});
  },
  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="topDiv">
              <PartnerSearch />
            </div>
            <div className="listPartners">
              <PartnerList partners={this.state.partners} selectPartner={this._selectPartner}
                selectedPartner={this.state.selectedPartner} />
            </div>
            <div className="emptyBottomSpace">
            </div>
          </div>
          <div className="col-md-8">
            <div className="mainScreen">
              <PartnerDisplay partnerId={this.state.selectedPartner} />
            </div>  
          </div>
        </div>
      </div>
    );
  }
});

var PartnerSearch = React.createClass({
  _handleOnSubmit: function (e) {
    e.preventDefault()

    searchValue = this.refs.search.getDOMNode().value.trim();
    this.props.onFormSubmit(searchValue);
  },
  render: function () {
    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="searchInput">
          <input type="text" className="form-control" onSubmit={this._handleOnSubmit}
            ref="search" placeholder="Search for partner..." />
        </div>
        <div className="searchButton">
          <button type="submit" className="btn btn-default">Search</button>
        </div>
      </form>
    );
  }
});

var PartnerList = React.createClass({
  render: function () {
    var selectPartner = this.props.selectPartner;
    var selectedPartner = this.props.selectedPartner;
    var currentPartners = this.props.partners.map (function (partner) {
      return (
        <Partner firstName={partner["first_name"]} lastName={partner["last_name"]}
          selectPartner={selectPartner} partnerId={partner["id"]}
          selectedPartner={selectedPartner} />
      );
    });
    return (
      <ul className="nav nav-pills nav-stacked" role="tablist">
        {currentPartners}
      </ul>
    );
  }
});

var Partner = React.createClass({
  getInitialState: function () {
    return {clicked: false};
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.selectedPartner != this.props.partnerId) {
      this.setState({clicked: false});
    }
  },
  onClick: function () {
    this.props.selectPartner(this.props.partnerId);
    this.setState({clicked: true});
  },
  render: function () {
    if (this.state.clicked) {
      return (
        <li role="presentation" onClick={this.onClick} className="active"><a href="#">{this.props.firstName + " " + this.props.lastName}</a></li>
      );
    }
    return (
        <li role="presentation" onClick={this.onClick}><a href="#">{this.props.firstName + " " + this.props.lastName}</a></li>
    );
  }
});

var PartnerDisplay = React.createClass({
  getInitialState: function () {
    return {selectedPage: 1};
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({selectedPage: 1});
  },
  clickInformation: function () {
    this.setState({selectedPage: 1});
  },
  clickGroups: function () {
    this.setState({selectedPage: 2});
  },
  clickPurchases: function () {
    this.setState({selectedPage: 3});
  },
  render: function () {
    var selectedPartner = this.props.partnerId;
    if (selectedPartner == null) {
      return (
        <div className="noneSelectedDisplay">
          Select a partner to begin.
        </div>
      )
    }
    return (
      <div className="partnerDisplay">
        <nav className="navbar navbar-default" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav" id="admin-dashboard-nav">
                <li id="information"><a href="#" onClick={this.clickInformation}>Information</a></li>
                <li id="groups"><a href="#" onClick={this.clickGroups}>Groups</a></li>
                <li id="newPurchases"><a href="#" onClick={this.clickPurchases}>New Purchases</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="mainDisplay">
          <MainDisplay type={this.state.selectedPage} partnerId={this.props.partnerId} />
        </div>
      </div>
    );
  }
});

var MainDisplay = React.createClass({
  render: function() {
    if (this.props.type == 1) {
      return (
        <div className="display">
          <InformationDisplay partnerId={this.props.partnerId}/>
        </div>
      );
    } else if (this.props.type == 2) {
      return(
        <div className="display">
          <GroupDisplay partnerId={this.props.partnerId}/>
        </div>
      );
    } else {
      return (
        <div className="display">
          <PurchaseDisplay partnerId={this.props.partnerId}/>
        </div>
      );
    }
  }
});

var InformationDisplay = React.createClass({
  getInitialState: function () {
    var initPartner = {
      country: "",
      email: "",
      first_name: "",
      last_name: "",
      organization: "",
      school: "",
    };
    return {partnerInfo: initPartner};
  },
  componentWillReceiveProps: function (nextProps) {
    this._fetchPartner({id: nextProps.partnerId});
  },
  componentDidMount: function () {
    this._fetchPartner({id: this.props.partnerId});
  },
  _fetchPartner: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/partner_information",
      dataType: 'json',
      data: id,
      success: function (data) {
        console.log(data);
        this.setState({partnerInfo: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <div id="informationDisplay">
        <div className="name">
          <div className="well"> {this.state.partnerInfo["first_name"] + " " + this.state.partnerInfo["last_name"]} </div>
        </div>
        <div className="info">
          <div className="well"> <b>Email:</b> {this.state.partnerInfo["email"]} </div>
          <div className="well"> <b>Country:</b> {this.state.partnerInfo["country"]} </div>
          <div className="well"> <b>Organization:</b> {this.state.partnerInfo["organization"]} </div>
          <div className="well"> <b>School:</b> {this.state.partnerInfo["school"]} </div>
        </div>
      </div>
    );
  }
});

var GroupDisplay = React.createClass({
  getInitialState: function () {
    var initGroup = {
      name: "",
      country: "",
      description: "",
      id: "",
    };
    return {groups: [initGroup]};
  },
  componentDidMount: function () {
    this._fetchGroups({id: this.props.partnerId});
  },
  _fetchGroups: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/display_groups",
      dataType: 'json',
      data: id,
      success: function (data) {
        console.log(data);
        this.setState({groups: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.log("error");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var allGroups = this.state.groups.map (function (group) {
      return (
        <Group group={group} />
      );
    });
    return (
      <div>
        {allGroups}
      </div>
    );
  }
});

var Group = React.createClass({
  getInitialState: function () {
    return {expand: "Show Books"};
  },
  _expand: function () {
    if (this.state.expand == "Show Books") {
      this.setState({expand: "Hide Books"});
    } else {
      this.setState({expand: "Show Books"});
    }
  },
  render: function () {
    return (
      <div className="well">
        <div className="groupInfo">
          <h2> {this.props.group["name"]} </h2>
          <div> Country: {this.props.group["country"]} </div>
          <div> Description: {this.props.group["organization"]} </div>
        </div>
        <div className="groupExpand">
          <input type="submit" value={this.state.expand} onClick={this._expand} />
        </div>
        { this.state.expand == "Hide Books" ? <GroupBooks groupId={this.props.group["id"]} /> : null }
      </div>
    );
  }
});

var GroupBooks = React.createClass({
  getInitialState: function () {
    return {books: []};
  },
  componentDidMount: function () {
    this._fetchBooks({id: this.props.groupId});
  },
  _fetchBooks: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/display_books",
      dataType: 'json',
      data: id,
      success: function (data) {
        console.log(data);
        this.setState({books: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.log("error");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    console.log(this.state.books);
    return (
      <div>
        <GroupBookList books={this.state.books} />
      </div>
    );
  }
});

var GroupBookList = React.createClass({
  render: function() {
    var books = this.props.books.map(function (book) {
      return (
        <div className="book">
          {book.name}
        </div>
      );
    }.bind(this));
    return (
      <div className="groupBooks">
        {books}
      </div>
    );
  }
});

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
