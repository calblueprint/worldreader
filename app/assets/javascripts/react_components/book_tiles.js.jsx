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
          <h3 className="media-heading">{this.props.book.title}</h3>
          <h5>{_.reduce(
                  this.props.book.authors_name,
                  function(memo, author) {return memo + " " + author},
                  ""
            )}</h5>
          <h5>{this.props.book.publisher_name}</h5>
          {this.props.book["donated?"] ?
            <div className="price">
              <b>Free</b>
            </div>
            :
            <div className="price">
              <b>{this.props.book.price}</b>
            </div>
          }
          <span className="expanded-book-desc">{this.props.book.description}</span>
          <div className="book-tags">
            {levels}
            <span className={"book-tag expanded-book-country " + countryLabel}>{this.props.book.country_name}</span>
            <span className={"book-tag expanded-book-language " + languageLabel}>{this.props.book.language_name}</span>
            <span className={"book-tag expanded-book-genre " + genreLabel}>{this.props.book.genre_name}</span>
            <span className={"book-tag expanded-book-subcategory " + subcategoryLabel}>{this.props.book.subcategory_name}</span>
          </div>
          {cartButton}
        </div>
      </div>
    );
  },
  renderCollapsed: function() {
    return (
      <div key={this.props.book.id + "-collapsed"} className="collapsed-book-tile"
          onClick={this.handleClick}>
        <div className="collapsed-book-img-box pull-left">
          <img className="collapsed-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.title}</h3>
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
    console.log(this.props.groups);
    var cartButton;
    if (this.props.user) {
      cartButton = (
        <CartButton user={this.props.user}
                    onClick={this.props.handleCartEvent}
                    cart={this.props.cart}
                    book={this.props.book} />
      )
    }
    var levels = this.props.book.levels_name.map(function (level) {
      return (
        <span className={"book-tag expanded-book-level " + levelLabel}>{level}</span>
      );
    });
    var groups = this.props.groups.map(function(group) {
      return group.name;
    }).join(", ");
    return (
      <div key={this.props.book.id + "-expanded"} className="icon-book-tile">
        <div className="icon-book-img-box pull-left">
          <img className="icon-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.title}</h3>
          <div className="book-tags">
            {levels}
            <span className={"book-tag expanded-book-country " + countryLabel}>{this.props.book.country_name}</span>
            <span className={"book-tag expanded-book-language " + languageLabel}>{this.props.book.language_name}</span>
            <span className={"book-tag expanded-book-genre " + genreLabel}>{this.props.book.genre_name}</span>
            <span className={"book-tag expanded-book-subcategory " + subcategoryLabel}>{this.props.book.subcategory_name}</span>
          </div>
          {this.props.book["donated?"] ?
            <div className="price">
              <b>Free</b>
            </div>
            :
            <div className="price">
              <b>{this.props.book.price}</b>
            </div>
          }
          <div className="groups">
            <b>Groups: </b>
            {groups}
          </div>
          {cartButton}
        </div>
      </div>
    )
  }
});
