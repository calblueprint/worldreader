/** @jsx React.DOM */

var Dashboard = React.createClass({
  getInitialState: function () {
    return {didFetchData: false, partners: []};
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
        console.log(data)
        this.setState({didFetchData: true, partners: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _handleOnSearchSubmit: function (search) {
    this._fetchPartners({search: search});
  },
  render: function () {
    var currentPartners = this.state.partners.map (function (partner) {
      return (
        <Partner first_name={partner["first_name"]} last_name={partner["last_name"]} />
      );
    });
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="searchBar">
              <PartnerSearch />
            </div>
            <div className="list-group">
              {currentPartners}
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
          <input type="text" class="form-control" onSubmit={this._handleOnSubmit} ref="search" placeholder="Search for partner..."/>
          <button type="submit" class="btn btn-default">Search</button>
        </div>
      </form>
    );
  }
});

var Partner = React.createClass({
  getInitialState: function () {
    return {clicked: false};
  },
  onClick: function () {
    this.setState({clicked: true});
  },
  render: function () {
    return (
        <a href="#" className="list-group-item">{this.props.first_name + " " + this.props.last_name}</a>
    );
  }
});
