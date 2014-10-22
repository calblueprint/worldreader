/** @jsx React.DOM */
var books = JSON.parse(document.getElementById("test").getAttribute("books"));

var BookTile = React.createClass({
  getInitialState: function() {
    return {clicked: false};
  },
  onClick: function() {
    this.setState({clicked: !this.state.clicked});
  },
  render: function() {
    var text = this.state.clicked ? "clicked" : "did not click";
    return (
      <div className="bookTile">
        <p>{this.props.name}</p>
        <p>You {text} this.</p>
        <button onClick={this.onClick}>click me</button>
      </div>
    );
  }
});

var BookList = React.createClass({
  render: function() {
    var bookTiles = this.props.data.map(function (book) {
      return (
        <BookTile name={book["name"]} desc={book["description"]} />
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