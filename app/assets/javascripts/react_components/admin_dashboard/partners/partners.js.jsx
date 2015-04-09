/** @jsx React.DOM */

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
      book_list_ids: $('#booklists').val()
    };
    var project = {
      name: $('#projectName').val(),
      origin_id: $('#projectCountry').val(),
      language_ids: $('#projectLanguage').val()
    }
    $.ajax({
      type: "POST",
      url: "/users",
      data: {
        authenticity_token: gon.auth_token,
        user: user,
        project: project,
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
    var countries = gon.countries.map(function(countries) {
      return (
        <option value={countries.id}>{countries.name}</option>
      );
    }.bind(this));
    var languages = gon.languages.map(function(languages) {
      return (
        <option value={languages.id}>{languages.name}</option>
      );
    }.bind(this));
    var booklists = gon.booklists.map(function(booklist) {
      return (
        <option value={booklist.id}>{booklist.name}</option>
      );
    }.bind(this));
    return (
      <div className="add-partner-display height-100">
        <div className="header">Add a new partner</div>
        <div className="add-partner-form col-md-6" >
          <input type="hidden" name="authenticity_token" value={gon.auth_token} />
          <div className="add-partner-form-div">
            <label for="newUserEmail">Email</label><br/>
            <input id="newUserEmail" type="text" className="form-control new-user-input" />
          </div>
          <div className="add-partner-form-div">
            <label for="newUserPassword">Password</label><br/>
            <input id="newUserPassword" type="password" className="form-control new-user-input" />
          </div>
          <div className="add-partner-form-div">
            <label for="newUserConfirmPassword">Confirm Password</label><br/>
            <input id="newUserConfirmPassword" type="password" className="form-control new-user-input" />
          </div>
          <div className="add-partner-form-div">
            <label for="booklists">Recommended Booklists</label><br/>
            <select id="booklists" className="selectpicker new-user-input"
              title="Select recommended booklists" multiple data-size="20"
              data-live-search="true" data-selected-text-format="count>4">
              {booklists}
            </select>
          </div>
        </div>
        <div className="add-partner-form col-md-6">
          <div className="add-partner-form-div">
            <label for="projectName">Project Name</label><br/>
            <input id="projectName" type="text" className="form-control new-user-input" />
          </div>
          <div className="add-partner-form-div">
            <label for="projectLanguage">Project Languages</label><br/>
            <select id="projectLanguage" className="selectpicker new-user-input"
              title="Select languages" multiple data-size="20"
              data-live-search="true" data-selected-text-format="count>4">
              {languages}
            </select>
          </div>
          <div className="add-partner-form-div">
            <label for="projectCountry">Project Country</label><br/>
            <select id="projectCountry" className="selectpicker new-user-input"
              title="Select country" data-size="20"
              data-live-search="true" data-selected-text-format="count>4">
              {countries}
            </select>
          </div>
          <div className="add-partner-form-div">
            <label>&nbsp;</label><br/>
            <button type="button" className="btn btn-primary" onClick={this.createUser}>
              Create Partner and Project
            </button>
          </div>
        </div>
      </div>
    );
  }
});
