/** @jsx React.DOM */

var tabs = {
  VIEWINFO: 1,
  BASE_LISTS: 2,
  RECOMMEND: 3,
  VIEWBOOKS: 4,
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
  clickBaselists: function () {
    this.setState({currentTab: tabs.BASE_LISTS});
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
                <li><a data-toggle="tab" href="#" onClick={this.clickBaselists}>Base Booklists</a></li>
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
    } else if (this.props.type == tabs.BASE_LISTS) {
      return (
        <BaseListView />
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
