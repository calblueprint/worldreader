/** @jsx React.DOM */

var views = {
  RECOMMENDATIONS: 1,
  CREATE_RECOMMENDATION: 2,
  EDIT_RECOMMENDATION: 3,
};

/* Handles transitions between views within Recommendations tab */
var RecommendationViews = React.createClass({
  getInitialState: function () {
    return {currentView: views.RECOMMENDATIONS};
  },
  viewRecommendations: function () {
    this.setState({currentView: views.RECOMMENDATIONS});
  },
  viewCreateRecommendation: function () {
    this.setState({currentView: views.CREATE_RECOMMENDATION});
  },
  viewEditRecommendation: function () {
    this.setState({currentView: views.EDIT_RECOMMENDATION});
  },
  render: function () {
    if (this.state.currentView == views.RECOMMENDATIONS) {
      return (
        <RecommendationsPage viewCreateRecommendation={this.viewCreateRecommendation} 
          viewEditRecommendation={this.viewEditRecommendation} />
        );
    }
    else if (this.state.currentView == views.CREATE_RECOMMENDATION) {
      return (
        <CreateRecommendationPage viewRecommendations={this.viewRecommendations}/>
        );
    }
    else if (this.state.currentView == views.EDIT_RECOMMENDATION) {
      return (
        <div/>
        );
    }
  }
});

/* List view of recommendations, as well as buttons for creating recommendation */
var RecommendationsPage = React.createClass({
  getInitialState: function () {
    return {recommendations: [], selectedRecommendation: null};
  },
  componentDidMount: function () {
    this._fetchRecommendations({});
  },
  _fetchRecommendations: function (search_data) {
    $.ajax({
      url: "/admin/recommendations/display_recommendations",
      dataType: 'json',
      data: search_data,
      success: function (data) {
        this.setState({recommendations: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _selectRecommendation: function (recommendationId) {
    this.setState({selectedRecommendation: recommendationId});
  },
  _createRecommendation: function () {
    this.props.viewCreateRecommendation();
  },
  _deleteRecommendation: function (recommendationId) {
    var fetchRecommendations = this._fetchRecommendations;
    $.ajax({
      type: "POST",
      url: "/admin/recommendations/delete",
      data: {
        recommendation_id: recommendationId
      },
      success: function (message) {
        console.log("Recommendation succesfully deleted");
        fetchRecommendations({});
      },
      error: function(xhr, status, err) {
        console.error("/admin/recommendations/delete", status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  render: function () {
    return (
      <div className="container">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div className="row">
              <div className="col-md-12">
                <div className="btn btn-default pull-right" onClick={this._createRecommendation}><span className="glyphicon glyphicon-plus"/></div>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <RecommendationList recommendations={this.state.recommendations} 
              selectedRecommendation={this.state.selectedRecommendation} 
              selectRecommendation={this._selectRecommendation} 
              deleteRecommendation={this._deleteRecommendation} />
          </div>
        </div>
      </div>
    );
  }
});

var RecommendationList = React.createClass({
  render: function () {
    var selectedRecommendation = this.props.selectedRecommendation;
    var selectRecommendation = this.props.selectRecommendation;
    var deleteRecommendation = this.props.deleteRecommendation;
    var recommendationPills = this.props.recommendations.map (function (recommendation) {
      return (
        <Recommendation recommendation={recommendation} 
          clicked={_.isEqual(selectedRecommendation, recommendation.id)} 
          selectRecommendation={selectRecommendation} 
          deleteRecommendation={deleteRecommendation} />
      );
    });
    return (
      <div className="list-group">
        {recommendationPills}
      </div>
    );
  }
});

var Recommendation = React.createClass({
  getInitialState: function () {
    return {clicked: this.props.clicked};
  },
  onClick: function () {
    this.props.selectRecommendation(this.props.recommendation.id);
  },
  deleteOnClick: function () {
    this.props.deleteRecommendation(this.props.recommendation.id);
  },
  render: function () {
    if (this.props.clicked) {
      return (
        <a href="#" className="list-group-item row" onClick={this.onClick}>
          <div className="row">
            {"Recommendation: " + this.props.recommendation.id}
            <div className="btn-group pull-right">
              <button type="button" className="btn btn-default">Edit</button>
              <button type="button" className="btn btn-default" 
                onClick={this.deleteOnClick}>
                <div className="glyphicon glyphicon-remove"/>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">books
            </div>
            <div className="col-md-5">tags
            </div>
          </div>
        </a>
      );
    }
    return (
      <a href="#" className="list-group-item" onClick={this.onClick}>
        {"Recommendation: " + this.props.recommendation.id}
      </a>

    );
  }
});

var recommendationTypes = {
  AUTO:0,
  CUSTOM:1
};

var CreateRecommendationPage = React.createClass({
  getInitialState: function () {
    return {
      books: [], 
      selectedBooks: [],
      recommendation_type: recommendationTypes.AUTO,
      tags: {countries:[2,3,4], languages:[1,2]}
    };
  },
  componentDidMount: function () {
    this._fetchBooks({});
    $('#recommendation-type-toggle').bootstrapSwitch();
    $('#recommendation-type-toggle').on('switchChange.bootstrapSwitch', this._setRecommendationType);
  },
  _fetchBooks: function (search_data) {
    $.ajax({
      url: "/admin/recommendations/display_books",
      dataType: 'json',
      data: search_data,
      success: function (data) {
        this.setState({books: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _handleOnBookSearchSubmit: function (search) {
    this._fetchBooks({search_data: search});
  },
  _selectBook: function (bookId) {
    var bookList = this.state.selectedBooks;
    if (_.contains(bookList, bookId)) {
      bookList = _.without(bookList, bookId);
    }
    else {
      bookList.push(bookId);
    }
    this.setState({selectedBooks: bookList});
  },
  _addRecommendation: function () {
    var viewRecommendations = this.props.viewRecommendations;
    if (this.state.selectedBooks.length == 0) {
      console.error("no books selected");
    }
    $.ajax({
      type: "POST",
      url: "/admin/recommendations/add",
      data: {
        book_ids: this.state.selectedBooks,
        recommendation_type: this.state.recommendation_type,
        country_ids: this.state.tags.countries,
        language_ids: this.state.tags.languages
      },
      success: function (message) {
        console.log("Recommendation succesfully created");
        //present message to user
        viewRecommendations();
      },
      error: function(xhr, status, err) {
        console.error("/admin/recommendations/add", status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  _setRecommendationType: function (event, state) {
    console.log("recommendation type: " + state);
    this.setState({recommendation_type: state});
    $('#recommendation-type-toggle').bootstrapSwitch();

  },
  render: function () {
    if (this.state.recommendation_type == recommendationTypes.AUTO) {
      return (
        <div className="container">
          <div className="row">
            <div className="btn-group btn-group-lg col-md-8" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._addRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-4">
              <input type="checkbox" id="recommendation-type-toggle" onSwitchChange={this._setRecommendationType} defaultChecked={this.state.recommendation_type} 
                data-on-text="Custom" data-off-text="Auto" data-on-color="info" data-off-color="success"/>
            </div>
          </div>
          <div className="row top-buffer">
            <div className="col-md-5 panel">
              <div className="row panel-heading"><RecommendationBookTagSearch/></div>
              <div className="row panel-body"><RecommendationBookList books={this.state.books} 
                selectBook={this._selectBook}
                selectedBooks={this.state.selectedBooks} /></div>
            </div>
            <div className="col-md-5 panel side-buffer">
              <div className="row panel-heading"><RecommendationUserTagSearch/></div>
              <div className="row panel-body"><RecommendationSelectedTags tags={this.state.tags}/></div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="btn-group btn-group-lg col-md-8" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._addRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-4">
              <input type="checkbox" id="recommendation-type-toggle" onSwitchChange={this._setRecommendationType} defaultChecked={this.state.recommendation_type} 
                data-on-text="Custom" data-off-text="Auto" data-on-color="info" data-off-color="success"/>
            </div>
          </div>
          <div className="row top-buffer">
            <div className="col-md-5 panel">
              <div className="row panel-heading"><RecommendationBookSearch/></div>
              <div className="row panel-body"><RecommendationBookList books={this.state.books} 
                selectBook={this._selectBook}
                selectedBooks={this.state.selectedBooks} /></div>
            </div>
            <div className="col-md-5 panel side-buffer">
              <div className="row panel-heading"><RecommendationUserTagSearch/></div>
              <div className="row panel-body"><RecommendationSelectedTags tags={this.state.tags}/></div>
            </div>
          </div>
        </div>
      );
    }
  }
});

var RecommendationBookSearch = React.createClass({
  _handleOnSubmit: function (e) {
    e.preventDefault();
  },
  render: function () {
    return (
      <div className="input-group">
        <input type="text" className="form-control" onSubmit={this._handleOnSubmit}
          placeholder="Search for books..." />
        <span className="input-group-btn">
          <button className="btn btn-default" type="submit">
            <span className="glyphicon glyphicon-search"/>
          </button>
        </span>
      </div>
    );
  }
});

var RecommendationBookTagSearch = React.createClass({
  componentDidMount: function () {
    this.initTagbar(); 
  },
  initTagbar: function () {
    var mainSearch = $('.book-tagbar-input');
    mainSearch.tagsinput();
    // mainSearch.tagsinput({
    //   tagClass: function(item) {
    //     switch (item.tagType) {
    //       case 'countries':     return countryLabel;
    //       case 'levels':        return levelLabel;
    //       case 'language':      return languageLabel;
    //       case 'genre':         return genreLabel;
    //       case 'recommended':   return recommendedLabel;
    //     }
    //   },
    //   itemValue: 'value',
    //   itemText: 'text',
    //   typeahead: {
    //     name: 'cities',
    //     displayKey: 'text',
    //     source: gon.all_tags
    //   }
    // });
    mainSearch.on('itemAdded', this.tagsUpdated);
    mainSearch.on('itemRemoved', this.tagsUpdated);
    // $('#tag-and-searchbar').affix({
    //     offset: {
    //       top: $('#index-image').height()
    //     }
    // });
  },
  tagsUpdated: function () {
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    console.log("tags: " + tags);

  },
  render: function () {    
    return (
      <div id="book-tagbar" className="input-group">
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-tag"/>
        </span>
        <input className="book-tagbar-input input-block-level typeahead form-control" 
        placeholder="Add tag" type="text"/>
        <span className="input-group-btn">
          <button className="search-button btn btn-default" type="submit">
            <span className="glyphicon glyphicon-search"/>
          </button>
        </span>
      </div>
      );
  }
});

var RecommendationBookList = React.createClass({
  render: function () {
    var selectBook = this.props.selectBook;
    var selectedBooks = this.props.selectedBooks;
    var currentBooks = this.props.books.map (function (book) {
      return (
        <RecommendationBook book={book} selectBook={selectBook} bookId={book["id"]} 
          selectedBooks={selectedBooks} key={book.id} clicked={_.contains(selectedBooks, book.id)}/>
      );
    });
    return (
      <div className="list-group">
        {currentBooks}
      </div>
    );
  }
});

var RecommendationBook = React.createClass({
  getInitialState: function () {
    return {clicked: this.props.clicked};
  },
  onClick: function () {
    this.props.selectBook(this.props.bookId);
  },
  render: function () {
    if (this.props.clicked) {
      return (
        <a href="#" className="list-group-item active" onClick={this.onClick} >
          {this.props.book.name}</a>
      );
    }
    return (
        <a href="#" className="list-group-item" onClick={this.onClick}>
          {this.props.book.name}</a>
    );
  }
});

var RecommendationUserTagSearch = React.createClass({
  render: function () {    
    return (
      <div id="recommendation-tagbar" className="input-group">
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-tag"/>
        </span>
        <input id="recommendation-tagbar-input" className="input-block-level typeahead form-control" 
        placeholder="Add tag" type="text"/>
      </div>
      );
  }
});

var RecommendationSelectedTags = React.createClass({
  render: function () {
    var countryTags = this.props.tags.countries.map (function (tag) {
      return (<div className="list-group-item">{tag}</div>);
    });
    var languageTags = this.props.tags.languages.map (function (tag) {
      return (<div className="list-group-item">{tag}</div>);
    });
    return (
      <div>
        <h3>Countries</h3>
        <div className="list-group">
          {countryTags}
        </div>
        <h3>Languages</h3>
        <div className="list-group">
          {languageTags}
        </div>
      </div>
      );
  }
})
