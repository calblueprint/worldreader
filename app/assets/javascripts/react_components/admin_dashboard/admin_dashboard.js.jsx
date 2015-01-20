/** @jsx React.DOM */

var ManagePartnerInfo = React.createClass({
  getInitialState: function () {
    return {partners: [], partnersNewPurchases: [],
      selectedPartner: null, numNewPurchases: {}};
  },
  componentDidMount: function () {
    this._fetchPartners({});
  },
  _refreshNewPurchases: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id + "/get_number_purchases",
      dataType: "text",
      success: function (response) {
        var updatedNumNewPurchases = this.state.numNewPurchases;
        if (response > 0) {
          updatedNumNewPurchases[id] = response;
          this.setState({numNewPurchases: updatedNumNewPurchases});
        } else {
          updatedNumNewPurchases[id] = "";
          this.setState({numNewPurchases: updatedNumNewPurchases});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _fetchPartners: function () {
    $.ajax({
      url: "/admin/dashboard/display_all_partners",
      dataType: 'json',
      success: function (data) {
        console.log(data);
        this.setState({partners: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    $.ajax({
      url: "/admin/dashboard/display_partners_new_purchases",
      dataType: 'json',
      success: function (data) {
        console.log(data);
        var newIds = _.pluck(data, "id");
        for (var i = 0; i < newIds.length; i++) {
          this._refreshNewPurchases(newIds[i]);
        }
        this.setState({partnersNewPurchases: data});
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
              <PartnerList partners={this.state.partners}
                partnersNewPurchases={this.state.partnersNewPurchases}
                selectPartner={this._selectPartner}
                selectedPartner={this.state.selectedPartner} 
                numNewPurchases={this.state.numNewPurchases} />
            </div>
            <div className="emptyBottomSpace">
            </div>
          </div>
          <div className="col-md-8">
            <div className="mainScreen">
              <PartnerDisplay partnerId={this.state.selectedPartner}
                refreshPurchases={this._refreshNewPurchases} />
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
    var numNewPurchases = this.props.numNewPurchases;
    var allPartners = this.props.partners.map (function (partner) {
      return (
        <Partner partner={partner} selectPartner={selectPartner} partnerId={partner["id"]}
          selectedPartner={selectedPartner}
          numNewPurchases={numNewPurchases[partner["id"]]} />
      );
    });
    var partnersNewPurchases = this.props.partnersNewPurchases.map (function (partner) {
      return (
        <Partner partner={partner} selectPartner={selectPartner} partnerId={partner["id"]}
          selectedPartner={selectedPartner}
          numNewPurchases={numNewPurchases[partner["id"]]} />
      );
    });
    return (
      <ul className="nav nav-pills nav-stacked" role="tablist">
        {partnersNewPurchases}
        {allPartners}
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
    var is_active = this.state.clicked ? "active" : "";
    return (
        <li role="presentation" onClick={this.onClick} className={is_active}><a href="#">
          {this.props.partner["first_name"] + " " + this.props.partner["last_name"]}
          <span className="badge">{this.props.numNewPurchases}</span></a></li>
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
          <MainDisplay type={this.state.selectedPage} partnerId={this.props.partnerId}
            refreshPurchases={this.props.refreshPurchases} />
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
          <InformationDisplay partnerId={this.props.partnerId} />
        </div>
      );
    } else if (this.props.type == displays.GROUPS) {
      return (
        <div className="display">
          <GroupDisplay partnerId={this.props.partnerId} />
        </div>
      );
    } else if (this.props.type == displays.PURCHASES) {
      return (
        <div className="display">
          <PurchaseDisplay partnerId={this.props.partnerId}
            refreshPurchases={this.props.refreshPurchases} />
        </div>
      );
    }
  }
});

var tabs = {
  VIEWINFO: 1,
  RECOMMEND: 2,
  VIEWBOOKS: 3,
  CREATEUSERS: 4
};

var DashboardTabs = React.createClass({
  getInitialState: function () {
    return {currentTab: tabs.VIEWINFO};
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({currentTab: tabs.VIEWINFO});
  },
  clickViewInfo: function () {
    this.setState({currentTab: tabs.VIEWINFO});
  },
  clickRecommend: function () {
    this.setState({currentTab: tabs.RECOMMEND});
    console.log("recommendations tab clicked");
  },
  clickViewBooks: function () {
    this.setState({currentTab: tabs.VIEWBOOKS});
  }, 
  clickCreateUsers: function () {
    this.setState({currentTab: tabs.CREATEUSERS});
  },
  render: function () {
    return (
      <div className="tabBar">
        <nav className="navbar navbar-default transparent" role="navigation">
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
              <ul className="nav nav-pills centered nav-pills admin-nav-tabs">
                <li className="active"><a data-toggle="tab" href="#" onClick={this.clickViewInfo}>Partners</a></li>
                <li><a data-toggle="tab" href="#" onClick={this.clickRecommend}>Recommendations</a></li>
                <li><a data-toggle="tab" href="#" onClick={this.clickViewBooks}>Books</a></li>
                <li><a data-toggle="tab" href="#" onClick={this.clickCreateUsers}>Users</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="tabDisplay">
          <DashboardTabDisplay type={this.state.currentTab}/>
        </div>
      </div>
    );
  }
});

var DashboardTabDisplay = React.createClass({
  render: function() {
    if (this.props.type == tabs.VIEWINFO) {
      return (
        <ManagePartnerInfo/>
      );
    } else if (this.props.type == tabs.RECOMMEND) {
      return (
        // <RecommendationsPage/>
        <RecommendationViews/>
      );
    } else if (this.props.type == tabs.VIEWBOOKS) {
      return (
        <div>
          View Books
        </div>
      );
    } else if (this.props.type == tabs.CREATEUSERS) {
      return (
        <div>
          Create Users
        </div>
      )
    }
  }
});
