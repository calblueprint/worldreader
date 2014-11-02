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
    this._fetchPartners({search: search});
  },
  _selectPartner: function (partnerId) {
    this.setState({selectedPartner: partnerId});
  },
  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="searchBar">
              <PartnerSearch />
            </div>
            <div className="listPartners">
              <PartnerList partners={this.state.partners} selectPartner={this._selectPartner}
                selectedPartner={this.state.selectedPartner} />
            </div>
          </div>
          <div className="col-md-8">
            <div className="viewPurchases">
              <PartnerDisplay partner={this.state.selectedPartner} />
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
      <form class="navbar-form navbar-left" role="search">
        <div class="form-group">
          <input type="text" class="form-control" onSubmit={this._handleOnSubmit}
            ref="search" placeholder="Search for partner..." />
          <button type="submit" class="btn btn-default">Search</button>
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
      <div className="list-group">
        {currentPartners}
      </div>
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
        <a href="#" onClick={this.onClick} className="list-group-item active">{this.props.firstName + " " + this.props.lastName} </a>
      );
    }
    return (
        <a href="#" onClick={this.onClick} className="list-group-item">{this.props.firstName + " " + this.props.lastName} </a>
    );
  }
});

var PartnerDisplay = React.createClass({
  clickInformation: function () {
    this.setState({selected: 1});
  },
  clickGroups: function () {
    this.setState({selected: 2});
  },
  clickPurchases: function () {
    this.setState({selected: 3});
  },
  render: function () {
    var selectedPartner = this.props.partner;
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
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><a href="#" onClick={this.clickInformation}>Information</a></li>
                <li><a href="#" onClick={this.clickGroups}>Groups</a></li>
                <li><a href="#" onClick={this.clickPurchases}>New Purchases</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
});

var InformationDisplay = React.createClass({
  render: function () {

  }
});

var GroupDisplay = React.createClass({
  render: function() {

  }
});

var PurchaseDisplay = React.createClass({
  render: function() {

  }
});
