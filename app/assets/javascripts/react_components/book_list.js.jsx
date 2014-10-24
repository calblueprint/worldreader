/** @jsx React.DOM */
var books = JSON.parse(document.getElementById("test").getAttribute("books"));
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// TODO: figure out a way to track the currently expanded tile better
var currentExpanded = null;

var BookTile = React.createClass({
  getInitialState: function() {
    return {clicked: false};
  },
  onClick: function() {
    var clicked = !this.state.clicked;
    this.setState({clicked: clicked});
    if (clicked) {
      if (currentExpanded) {
        currentExpanded.setState({clicked: !currentExpanded.state.clicked});
      }
      currentExpanded = this;
    } else {
      currentExpanded = null;
    }
  },
  render: function() {
    // TODO: better stylings
    if (this.state.clicked) {
      return (
        <div className="expandedTile" onClick={this.onClick}>
          <p>{this.props.name}</p>
          <p>{this.props.desc}</p>
        </div>
      )
    }
    return (
      <div className="collapsedTile" onClick={this.onClick}>
        <p>{this.props.name}</p>
        <p>{this.props.desc.substring(0, 10) + "..."}</p>
      </div>
    );
  }
});

var BookList = React.createClass({
  render: function() {
    var bookTiles = this.props.data.map(function (book) {
      return (
        <BookTile name={book["name"]} desc={book["description"]} bookList={this}/>
      );
    });
    return (
      <div className="bookList">
        {bookTiles}
      </div>
    );
  }
});

React.renderComponent(
  <BookList data={books} />,
  document.getElementById("test")
);