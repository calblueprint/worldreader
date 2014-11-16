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

  },
  render: function () {
    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="searchInput">
          <input type="text" className="form-control" onSubmit={this._handleOnSubmit}
            ref="search" placeholder="Search for a partner..." />
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
        <Partner partner={partner} selectPartner={selectPartner} partnerId={partner["id"]}
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
        <li role="presentation" onClick={this.onClick} className="active"><a href="#">
          {this.props.partner["first_name"] + " " + this.props.partner["last_name"]}</a></li>
      );
    }
    return (
        <li role="presentation" onClick={this.onClick}><a href="#">
          {this.props.partner["first_name"] + " " + this.props.partner["last_name"]}</a></li>
    );
  }
});

var displays = {
  INFORMATION: 1,
  GROUPS: 2,
  PURCHASES: 3,

};

var PartnerDisplay = React.createClass({
  getInitialState: function () {
    return {selectedPage: displays.INFORMATION};
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({selectedPage: displays.INFORMATION});
  },
  clickInformation: function () {
    this.setState({selectedPage: displays.INFORMATION});
  },
  clickGroups: function () {
    this.setState({selectedPage: displays.GROUPS});
  },
  clickPurchases: function () {
    this.setState({selectedPage: displays.PURCHASES});
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
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1">
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
    if (this.props.type == displays.INFORMATION) {
      return (
        <div className="display">
          <InformationDisplay partnerId={this.props.partnerId}/>
        </div>
      );
    } else if (this.props.type == displays.GROUPS) {
      return (
        <div className="display">
          <GroupDisplay partnerId={this.props.partnerId}/>
        </div>
      );
    } else if (this.props.type == displays.PURCHASES) {
      return (
        <div className="display">
          <PurchaseDisplay partnerId={this.props.partnerId}/>
        </div>
      );
    }
  }
});
