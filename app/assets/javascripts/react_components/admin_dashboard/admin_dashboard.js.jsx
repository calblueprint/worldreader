/** @jsx React.DOM */

var ManagePartnerInfo = React.createClass({
  getInitialState: function () {
    return {partners: [], partnersNewPurchases: [],
      selectedPartner: null, numNewPurchases: {}, showAddPartner: false};
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
    this.setState({selectedPartner: partnerId, showAddPartner: false});
  },
  _addPartner: function() {
    this.setState({selectedPartner: null, showAddPartner: true});
  },
  _addPartnerSuccess: function(newPartner) {
    var partners = this.state.partners;
    partners.push(newPartner);
    this.setState({partners: partners, selectedPartner: newPartner["id"],
      showAddPartner: false});
  },
  render: function () {
    return (
      <div className="admin-dash-container container height-100">
        <div className="row height-100">
          <div className="col-md-4 height-100">
            <div className="row listPartners height-100">
              <div className="topDiv">
                <PartnerSearch addPartner={this._addPartner} />
              </div>
              <PartnerList partners={this.state.partners}
                partnersNewPurchases={this.state.partnersNewPurchases}
                selectPartner={this._selectPartner}
                selectedPartner={this.state.selectedPartner}
                numNewPurchases={this.state.numNewPurchases} />
            </div>
          </div>
          <div className="col-md-8 height-100">
            <div className="mainScreen height-100">
              {!this.state.showAddPartner ? 
                <PartnerDisplay partnerId={this.state.selectedPartner}
                  refreshPurchases={this._refreshNewPurchases} />
               : <AddPartnerDisplay success={this._addPartnerSuccess} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var PartnerSearch = React.createClass({
  search: function (e) {
    e.preventDefault()
  },
  render: function () {
    var addPartner = this.props.addPartner;
    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="input-group" id="book-searchbar">
          <input className="input-block-level form-control" id="book-searchbar-input" onKeyUp={this.search} placeholder="Search for partners" type="text" />
          <span className="input-group-btn">
            <button className="btn btn-default" id="search-button" onClick={this.search} type="button"><span className="glyphicon glyphicon-search"></span></button>
          </span>
        </div>
        <div className="add-button">
          <button type="button" className="btn btn-default" onClick={addPartner}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
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
        <Partner  partner={partner}
                  selectPartner={selectPartner}
                  partnerId={partner["id"]}
                  selectedPartner={selectedPartner}
                  numNewPurchases={numNewPurchases[partner["id"]]}
                  key={partner["id"]} />
      );
    });
    var partnersNewPurchases = this.props.partnersNewPurchases.map (function (partner) {
      return (
        <Partner  partner={partner}
                  selectPartner={selectPartner}
                  partnerId={partner["id"]}
                  selectedPartner={selectedPartner}
                  numNewPurchases={numNewPurchases[partner["id"]]}
                  key={partner["id"]} />
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
  onClick: function () {
    this.props.selectPartner(this.props.partnerId);
  },
  render: function () {
    var clicked = this.props.selectedPartner == this.props.partnerId;
    var is_active = clicked ? "active" : "";
    return (
        <li role="presentation" onClick={this.onClick} className={is_active}><a href="#">
          {this.props.partner["email"]}
          <span className="badge">{this.props.numNewPurchases}</span></a></li>
    );
  }
});

var displays = {
  INFORMATION: 1,
  NEW_PURCHASES: 2,
  OLD_PURCHASES: 3,
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
  clickNewPurchases: function () {
    this.setState({selectedPage: displays.NEW_PURCHASES});
  },
  clickOldPurchases: function () {
    this.setState({selectedPage: displays.OLD_PURCHASES});
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
    var infoClass = "";
    var newPurchasesClass = "";
    var oldPurchasesClass = "";
    switch (this.state.selectedPage) {
      case displays.INFORMATION:
        infoClass += "underline";
        break;
      case displays.NEW_PURCHASES:
        newPurchasesClass += "underline";
        break;
      case displays.OLD_PURCHASES:
        oldPurchasesClass += "underline";
        break;
    }
    return (
      <div className="partnerDisplay height-100">
        <div className="mainDisplay">
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
                  <li id="information" className={infoClass}><a href="#" onClick={this.clickInformation}>Information</a></li>
                  <li id="newPurchases" className={newPurchasesClass}><a href="#" onClick={this.clickNewPurchases}>New Purchases</a></li>
                  <li id="oldPurchases" className={oldPurchasesClass}><a href="#" onClick={this.clickOldPurchases}>Old Purchases</a></li>
                </ul>
              </div>
            </div>
          </nav>
          <MainDisplay type={this.state.selectedPage} partnerId={this.props.partnerId}
            refreshPurchases={this.props.refreshPurchases} className="height-100"/>
        </div>
      </div>
    );
  }
});

var AddPartnerDisplay = React.createClass({
  componentDidMount: function () {
    $('.selectpicker').selectpicker();
  },
  createUser: function() {
    var success = this.props.success;
    var user = {
      email: $('#newUserEmail').val(),
      password: $('#newUserPassword').val(),
      password_confirmation: $('#newUserConfirmPassword').val(),
      projects: $('#newUserProjects').val()
    };
    $.ajax({
      type: "POST",
      url: "/users",
      data: {
        authenticity_token: gon.auth_token,
        user: user
      },
      success: function (data) {
        toastr.success(data.message);
        success(data.user);
      },
      error: function(xhr, status, err) {
        var errors = xhr.responseJSON.errors;
        for (var error of errors) {
          toastr.error(error);
        }
        console.error(this.props.url, status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  render: function () {
    var levels = gon.levels.map(function(level) {
      return (
          <option value={level.id}>{level.name}</option>
      );
    }.bind(this));
    var languages = gon.languages.map(function(language) {
      return (
          <option value={language.id}>{language.name}</option>
      );
    }.bind(this));
    var countries = gon.countries.map(function(country) {
      return (
          <option value={country.id}>{country.name}</option>
      );
    }.bind(this));
    var projects = gon.projects.map(function(project) {
      return (
        <option value={project.id}>{project.name}</option>
      );
    }.bind(this));
    return (
      <div className="add-partner-display height-100">
        <div className="header">
          Add a New Partner
        </div>
        <div className="add-partner-form">
          <input type="hidden" name="authenticity_token" value={gon.auth_token} />
          <label for="newUserEmail">Email</label>
          <div>
            <input id="newUserEmail" type="text" className="form-control new-user-input" />
          </div>
          <label for="newUserPassword">Password</label>
          <div>
            <input id="newUserPassword" type="password" className="form-control new-user-input" />
          </div>
          <label for="newUserConfirmPassword">Confirm Password</label>
          <div>
            <input id="newUserConfirmPassword" type="password" className="form-control new-user-input" />
          </div>
          <label for="newUserProjects">Projects</label>
          <div>
            <select id="newUserProjects" className="selectpicker new-user-input" title="Select Projects" multiple data-width="300px">
              {projects}
            </select>
          </div>
          <div className="newUserButton">
            <button type="button" className="btn btn-default" onClick={this.createUser}>
              Make Partner
            </button>
          </div>
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
    } else if (this.props.type == displays.OLD_PURCHASES) {
      return (
        <div className="display">
          <PurchaseDisplay  partnerId={this.props.partnerId}
                            refreshPurchases={this.props.refreshPurchases}
                            purchaseDisplayOptions={purchaseDisplayOptions.OLD}
                            key={1}/>
        </div>
      );
    } else if (this.props.type == displays.NEW_PURCHASES) {
      return (
        <div className="display">
          <PurchaseDisplay  partnerId={this.props.partnerId}
                            refreshPurchases={this.props.refreshPurchases}
                            purchaseDisplayOptions={purchaseDisplayOptions.NEW}
                            key={2}/>
        </div>
      );
    }
  }
});

var tabs = {
  VIEWINFO: 1,
  RECOMMEND: 2,
  VIEWBOOKS: 3,
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
  },
  clickViewBooks: function () {
    this.setState({currentTab: tabs.VIEWBOOKS});
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
        <ManagePartnerInfo />
      );
    } else if (this.props.type == tabs.RECOMMEND) {
      return (
        <RecommendationViews />
      );
    } else if (this.props.type == tabs.VIEWBOOKS) {
      return (
        <BookStatusView />
      );
    }
  }
});
