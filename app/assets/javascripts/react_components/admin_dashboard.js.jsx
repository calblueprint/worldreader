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
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><a href="#" onClick={this.clickInformation}>Information</a></li>
                <li><a href="#" onClick={this.clickGroups}>Groups</a></li>
                <li><a href="#" onClick={this.clickPurchases}>New Purchases</a></li>
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
        <InformationDisplay partnerId={this.props.partnerId}/>
      );
    } else if (this.props.type == 2) {
      return(
        <GroupDisplay partnerId={this.props.partnerId}/>
      );
    } else {
      return (
        <PurchaseDisplay partnerId={this.props.partnerId}/>
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
      <div className="PartnerInfo">
        <div className="Name">
          <h2> {this.state.partnerInfo["first_name"] + " " + this.state.partnerInfo["last_name"]} </h2>
        </div>
        <ul className="Info">
          <li> Email: {this.state.partnerInfo["email"]} </li>
          <li> Country: {this.state.partnerInfo["country"]} </li>
          <li> Organization: {this.state.partnerInfo["organization"]} </li>
          <li> School: {this.state.partnerInfo["school"]} </li>
        </ul>
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
    };
    return {groups: [initGroup], showOrHide: "Hide Books"};
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
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _expand: function () {
    if (this.state.showOrHide == "Show Books") {
      this.setState({showOrHide: "Hide Books"});
    } else {
      this.setState({showOrHide: "Show Books"});
    }
  },
  render: function() {
    var allGroups = this.state.groups.map (function (group) {
      return (
        <div className="GroupContainer">
          <ul className="GroupInfo">
            <h2> Name: {group["name"]} </h2>
            <li> Country: {group["country"]} </li>
            <li> Description: {group["organization"]} </li>
          </ul>
          <input type="submit" value="" onClick={_expand} />
            { {this.state.showOrHide} == "Show Books" ? <GroupBooks groupId={group["id"]} /> : null }
        </div>
      );
    });
    return (
      <div className="Groups">
        {allGroups}
      </div>
    );
  }
});

var GroupBooks = React.createClass({
  render: function () {
    return (
      <h2> Hello </h2>
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
    return (
      <h2> Purchases </h2>
    );  
  }
});
