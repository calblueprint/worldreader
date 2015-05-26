/** @jsx React.DOM */

var BookTile = React.createClass({
  handleClick: function() {
    this.props.handleClick({bookId: this.props.book.id});
  },
  _renderImage: function() {
    return this.props.book.image == null ? "/assets/null_image.png" : this.props.book.image
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
  addBook: function() {
    this.props.addBook(this.props.book);
  },
  renderExpanded: function() {
    var addButton;
    if (this.props.user) {
      addButton = (
        <button className="btn add-book-button" onClick={this.addBook}>
          Add to Booklist
        </button>
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
          <img className="expanded-book-img" src={this._renderImage()} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.title}</h3>
          <h5>{_.reduce(
                  this.props.book.authors,
                  function(memo, author) { return memo + " " + author.name},
                  ""
            )}</h5>
          <h5>{this.props.book.publisher_name}</h5>
          <span className="expanded-book-desc">{this.props.book.description}</span>
          <div className="book-tags">
            {levels}
            <span className={"book-tag expanded-book-country " + countryLabel}>{this.props.book.country_name}</span>
            <span className={"book-tag expanded-book-language " + languageLabel}>{this.props.book.language_name}</span>
            <span className={"book-tag expanded-book-genre " + genreLabel}>{this.props.book.genre_name}</span>
            <span className={"book-tag expanded-book-subcategory " + subcategoryLabel}>{this.props.book.subcategory_name}</span>
          </div>
          {addButton}
        </div>
      </div>
    );
  },
  renderCollapsed: function() {
    return (
      <div key={this.props.book.id + "-collapsed"} className="collapsed-book-tile"
          onClick={this.handleClick}>
        <div className="collapsed-book-img-box pull-left">
          <img className="collapsed-book-img" src={this._renderImage()} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.book.title}</h3>
          <span className="collapsed-book-desc">{this.props.book.description}</span>
        </div>
      </div>
    )
  }
});
