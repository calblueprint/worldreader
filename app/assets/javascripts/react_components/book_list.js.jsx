/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var CartButton = React.createClass({
  render: function() {
    if (this.props.book in this.props.cart) {
      return (
        <button onClick={this.props.onClick}>
          Add to Cart
        </button>
      )
    } else {
      return (
        <button onClick={this.props.onClick}>
          Remove from Cart
        </button>
      )
    }
  }
});

var BookTile = React.createClass({
  handleClick: function() {
    this.props.handleClick({bookId: this.props.book.id});
  },
  render: function() {
    var content;
    if (this.props.isExpanded) {
      content = this.renderExpanded();
    } else {
      content = this.renderCollapsed();
    }
    return (
      <ReactCSSTransitionGroup transitionName={this.props.isExpanded ? "expand" : "collapse"} >
        {content}
      </ReactCSSTransitionGroup>
    )
  },
  renderExpanded: function() {
    return (
      <div key={this.props.book.id + "-expanded"} className="expanded-book-tile"
          onClick={this.handleClick}>
        <div className="expanded-book-img-box pull-left">
          <img className="expanded-book-img" src={this.props.book.image} />
        </div>,
        <div className="media-body">
          <h4 className="media-heading">{this.props.book.name}</h4>
          <span className="expanded-book-desc">{this.props.book.description}</span>
        </div>
        <CartButton onClick={this.props.handleCartEvent} cart={this.props.cart} book={this.props.book} />
      </div>
    )
  },
  renderCollapsed: function() {
    return (
      <div key={this.props.book.id + "-collapsed"} className="collapsed-book-tile"
          onClick={this.handleClick}>
        <div className="collapsed-book-img-box pull-left">
          <img className="collapsed-book-img" src={this.props.book.image} />
        </div>,
        <div className="media-body">
          <h4 className="media-heading">{this.props.book.name}</h4>
          <span className="collapsed-book-desc">{this.props.book.description}</span>
        </div>
      </div>
    )
  }
});

var BookList = React.createClass({
  getInitialState: function() {
    return {expandedBookId: null};
  },
  handleBookExpand: function(event) {
    var expandedBookId = event.bookId;
    if (this.state.expandedBookId === expandedBookId) {
      expandedBookId = null;
    }
    this.setState({expandedBookId: expandedBookId});
  },
  render: function() {
    var bookTiles = this.props.books.map(function (book) {
      return (
        <BookTile
          key={book.id}
          book={book}
          cart={this.props.cart}
          handleClick={this.handleBookExpand}
          handleCartEvent={this.props.handleCartEvent}
          isExpanded={this.state.expandedBookId === book.id} />
      );
    }.bind(this));
    return (
      <div className="media-list">
        {bookTiles}
      </div>
    );
  }
});
