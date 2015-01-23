/** @jsx React.DOM */

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
    console.log(this.state.partnerInfo)
    return (
      <div id="informationDisplay">
        <div className="h2 text-center">
          {this.state.partnerInfo["first_name"] + " " + this.state.partnerInfo["last_name"]}
        </div>
        <div className="partner-text-information col-md-5 col-md-offset-1">
          <p><b>email </b>{this.state.partnerInfo["email"]}</p>
          <p><b>country </b>{this.state.partnerInfo["country"]}</p>
          <p><b>organization </b>{this.state.partnerInfo["organization"]}</p>
          <p><b>school </b>{this.state.partnerInfo["school"]}</p>
        </div>
        <div className="partner-map col-5">
        </div>
      </div>
    );
  }
});
