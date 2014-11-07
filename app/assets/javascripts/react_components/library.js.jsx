/** @jsx React.DOM */

var Library = React.createClass({
  render: function() {
    return (
      <div>
        <BookList books={this.props.books} />
        <Cart cart={this.props.cart} />
      </div>
    );
  }
});

React.renderComponent(
  <Library books={gon.books} cart={gon.cart} />,
  document.getElementById("library")
);
