/** @jsx React.DOM */

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
    var cartButton;
    if (this.props.user) {
      cartButton = (
        <CartButton user={this.props.user}
                    onClick={this.props.handleCartEvent}
                    cart={this.props.cart}
                    book={this.props.book} />
      )
    }
    var countries = this.props.book.countries_name.map(function (country) {
      return (
        <span className={"book-tag expanded-book-country " + countryLabel}>{country}</span>
      );
    });
    var levels = this.props.book.levels_name.map(function (level) {
      return (
        <span className={"book-tag expanded-book-level " + levelLabel}>{level}</span>
      );
    });
    return (
      <div key={this.props.book.id + "-expanded"} className="expanded-book-tile">
        <div className="close book-tile-close" onClick={this.props.handleCloseButton}>&times;</div>
        <div className="expanded-book-img-box pull-left">
          <img className="expanded-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.name}</h3>
          <span className="expanded-book-desc">{this.props.book.description}</span>
          <div className="book-tags">
            {countries}
            {levels}
            <span className={"book-tag expanded-book-language " + languageLabel}>{this.props.book.language_name}</span>
            <span className={"book-tag expanded-book-genre " + genreLabel}>{this.props.book.genre_name}</span>
          </div>
          {cartButton}
        </div>
      </div>
    )
  },
  renderCollapsed: function() {
    return (
      <div key={this.props.book.id + "-collapsed"} className="collapsed-book-tile"
          onClick={this.handleClick}>
        <div className="collapsed-book-img-box pull-left">
          <img className="collapsed-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.name}</h3>
          <span className="collapsed-book-desc">{this.props.book.description}</span>
        </div>
      </div>
    )
  }
});

var SmallBookTile = React.createClass({
  handleClick: function() {
    this.props.handleClick({bookId: this.props.book.id});
  },
  render: function() {
    var cartButton;
    if (this.props.user) {
      cartButton = (
        <CartButton user={this.props.user}
                    onClick={this.props.handleCartEvent}
                    cart={this.props.cart}
                    book={this.props.book} />
      )
    }
    var countries = this.props.book.countries_name.map(function (country) {
      return (
        <span className={"book-tag expanded-book-country " + countryLabel}>{country}</span>
      );
    });
    var levels = this.props.book.levels_name.map(function (level) {
      return (
        <span className={"book-tag expanded-book-level " + levelLabel}>{level}</span>
      );
    });
    return (
      <div key={this.props.book.id + "-expanded"} className="icon-book-tile">
        <div className="icon-book-img-box pull-left">
          <img className="icon-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.name}</h3>
          <div className="book-tags">
            {countries}
            {levels}
            <span className={"book-tag expanded-book-language " + languageLabel}>{this.props.book.language_name}</span>
            <span className={"book-tag expanded-book-genre " + genreLabel}>{this.props.book.genre_name}</span>
          </div>
          {cartButton}
        </div>
      </div>
    )
  }
});
