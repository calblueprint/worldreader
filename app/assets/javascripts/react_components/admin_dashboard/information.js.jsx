/** @jsx React.DOM */

var InformationDisplay = React.createClass({
  getInitialState: function () {
    var initPartner = {
      countries: "",
      email: "",
      organization: "",
      levels: "",
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
        <div className="h2 text-center">
          {this.state.partnerInfo.email}
        </div>
        <div className="partner-text-information col-md-5 col-md-offset-1">
          <p><b>Languages </b>{this.state.partnerInfo["languages"]}</p>
          <p><b>Countries </b>{this.state.partnerInfo["countries"]}</p>
        </div>
        <div className="partner-text-information col-6">
          <p><b>Organization </b>{this.state.partnerInfo["organization"]}</p>
          <p><b>Levels </b>{this.state.partnerInfo["levels"]}</p>
        </div>
        <div className="boundary-line col-md-offset-3 col-md-6">
        </div>
        <div className="h2 text-center header-padding col-md-12">
          Groups
        </div>
        <div className="col-md-10 col-md-offset-1">
          <GroupDisplay partnerId={this.props.partnerId} />
        </div>
      </div>
    );
  }
});
