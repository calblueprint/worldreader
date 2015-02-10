/** @jsx React.DOM */

var InformationDisplay = React.createClass({
  getInitialState: function () {
    var initPartner = {
      country: "",
      email: "",
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
      <div id="informationDisplay">
        <div className="name">
          <div className="well"> <b>Email:</b> {this.state.partnerInfo["email"]} </div>
        </div>
        <div className="info">
          <div className="well"> <b>Country:</b> {this.state.partnerInfo["country"]} </div>
          <div className="well"> <b>Organization:</b>
            {this.state.partnerInfo["organization"]} </div>
          <div className="well"> <b>School:</b> {this.state.partnerInfo["school"]} </div>
        </div>
      </div>
    );
  }
});