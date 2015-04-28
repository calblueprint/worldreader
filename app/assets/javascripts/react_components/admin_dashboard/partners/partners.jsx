/** @jsx React.DOM */

var React = require('react');

var MainDisplay = React.createClass({
  render: function() {
    return (
      <div className="display">
        <InformationDisplay partnerId={this.props.partnerId} />
      </div>
    );
  }
});

var ManagePartnerInfo = React.createClass({
  getInitialState: function () {
    return {partners: [], selectedPartner: null, showAddPartner: false};
  },
  componentDidMount: function () {
    this._fetchPartners({});
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
                selectPartner={this._selectPartner}
                selectedPartner={this.state.selectedPartner} />
            </div>
          </div>
          <div className="col-md-8 height-100">
            <div className="mainScreen height-100">
              {!this.state.showAddPartner ?
                <PartnerDisplay partnerId={this.state.selectedPartner} />
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
    var allPartners = this.props.partners.map (function (partner) {
      return (
        <Partner  partner={partner}
                  selectPartner={selectPartner}
                  partnerId={partner["id"]}
                  selectedPartner={selectedPartner}
                  key={partner["id"]} />
      );
    });
    return (
      <ul className="nav nav-pills nav-stacked" role="tablist">
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
        </a></li>
    );
  }
});

var PartnerDisplay = React.createClass({
  render: function () {
    var selectedPartner = this.props.partnerId;
    if (selectedPartner == null) {
      return (
        <div className="noneSelectedDisplay">
          Select a partner to begin.
        </div>
      )
    } else {
      return (
        <div className="partnerDisplay height-100">
          <div className="mainDisplay">
            <MainDisplay partnerId={this.props.partnerId} className="height-100"/>
          </div>
        </div>
      );
    }
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
      password_confirmation: $('#newUserConfirmPassword').val()
    };
    var booklist = {
      name: $('#booklistName').val(),
      book_list_ids: $('#booklists').val()
    }
    var project = {
      name: $('#projectName').val(),
      origin_id: $('#projectCountry').val(),
      language_ids: $('#projectLanguage').val()
    };
    $.ajax({
      type: "POST",
      url: "/users",
      data: {
        authenticity_token: gon.auth_token,
        user: user,
        booklist: booklist,
        project: project
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
        <option value={countries.id}>{countries.text}</option>
      );
    }.bind(this));
    var languages = gon.languages.map(function(languages) {
      return (
        <option value={languages.id}>{languages.text}</option>
      );
    }.bind(this));
    var booklists = gon.booklists.map(function(booklist) {
      return (
        <option value={booklist.id}>{booklist.text}</option>
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
            <label for="booklistName">Booklist Name</label><br/>
            <input id="booklistName" type="text" className="form-control new-user-input" />
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
            <label for="booklists">Base Booklists</label><br/>
            <select id="booklists" className="selectpicker new-user-input"
              title="Select base booklists" multiple data-size="20"
              data-live-search="true" data-selected-text-format="count>4">
              {booklists}
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

module.exports = ManagePartnerInfo;
