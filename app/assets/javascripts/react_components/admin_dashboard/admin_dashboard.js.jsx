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
  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="topDiv">
              <PartnerSearch addPartner={this._addPartner} />
            </div>
            <div className="listPartners">
              <PartnerList partners={this.state.partners}
                partnersNewPurchases={this.state.partnersNewPurchases}
                selectPartner={this._selectPartner}
                selectedPartner={this.state.selectedPartner}
                numNewPurchases={this.state.numNewPurchases} />
            </div>
          </div>
          <div className="col-md-8">
            <div className="mainScreen">
              {!this.state.showAddPartner ? 
                <PartnerDisplay partnerId={this.state.selectedPartner}
                  refreshPurchases={this._refreshNewPurchases} />
               : <AddPartnerDisplay />
              }
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
    var addPartner = this.props.addPartner;
    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="searchInput">
          <input type="text" className="form-control" onSubmit={this._handleOnSubmit}
            ref="search" placeholder="Search for a partner..." />
        </div>
        <div className="searchButton">
          <button type="submit" className="btn btn-default">Search</button>
        </div>
        <div className="addButton">
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
          {this.props.partner["email"]}
          <span className="badge">{this.props.numNewPurchases}</span></a></li>
    );
  }
});

var displays = {
  INFORMATION: 1,
  NEW_PURCHASES: 2,
  OLD_PURCHASES: 3
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
                <li id="information" className={infoClass}><a href="#" onClick={this.clickInformation}>Information</a></li>
                <li id="newPurchases" className={newPurchasesClass}><a href="#" onClick={this.clickNewPurchases}>New Purchases</a></li>
                <li id="oldPurchases" className={oldPurchasesClass}><a href="#" onClick={this.clickOldPurchases}>Old Purchases</a></li>
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

var AddPartnerDisplay= React.createClass({
  componentDidMount: function () {
    $('.selectpicker').selectpicker();
  },
  createUser: function() {
    var user = {
      first_name: $('#newUserFirstName').val(),
      last_name: $('#newUserLastName').val(),
      email: $('#newUserEmail').val(),
      password: $('#newUserPassword').val(),
      password_confirmation: $('#newUserConfirmPassword').val(),
      organization: $('#newUserOrganization').val(),
      levels: $('#newUserLevels').val(),
      languages: $('#newUserLanguages').val(),
      countries: $('#newUserCountries').val()
    };
    $.ajax({
      type: "POST",
      url: "/users",
      data: {
        authenticity_token: gon.auth_token,
        user: user
      },
      success: function (message) {
        toastr.success("User created!");
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
    return (
      <div className="addPartnerDisplay">
        <div className="header">
          Add a New Partner
        </div>
        <div className="addPartnerForm">
          <input type="hidden" name="authenticity_token" value={gon.auth_token} />
          <label for="newUserFirstName">First Name</label>
          <div>
            <input id="newUserFirstName" type="text" className="form-control newUserInput" />
          </div>
          <label for="newUserLastName">Last Name</label>
          <div>
            <input id="newUserLastName" type="text" className="form-control newUserInput" />
          </div>
          <label for="newUserEmail">Email</label>
          <div>
            <input id="newUserEmail" type="text" className="form-control newUserInput" />
          </div>
          <label for="newUserPassword">Password</label>
          <div>
            <input id="newUserPassword" type="password" className="form-control newUserInput" />
          </div>
          <label for="newUserConfirmPassword">Confirm Password</label>
          <div>
            <input id="newUserConfirmPassword" type="password" className="form-control newUserInput" />
          </div>
          <label for="newUserOrganization">Organization Name</label>
          <div>
            <input id="newUserOrganization" className="form-control newUserInput" />
          </div>
          <label for="newUserLevels">Grade Levels</label>
          <div>
            <select id="newUserLevels" className="selectpicker newUserInput" title="Select Grade Levels" multiple data-width="300px">
              {levels}
            </select>
          </div>
          <label for="newUserLanguages">Languages</label>
          <div>
            <select id="newUserLanguages" className="selectpicker newUserInput" title="Select Languages" multiple data-width="300px" data-live-search="true" data-size="5" data-selected-text-format="count>4">
              {languages}
            </select>
          </div>
          <label for="newUserCountries">Countries</label>
          <div>
            <select id="newUserCountries" className="selectpicker newUserInput" title="Select Countries" multiple data-width="300px" data-live-search="true" data-size="5" data-selected-text-format="count>4">
              {countries}
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
        <ManageUserInfo/>
      )
    }
  }
});
