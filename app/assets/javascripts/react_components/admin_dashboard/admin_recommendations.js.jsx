/** @jsx React.DOM */

var views = {
  RECOMMENDATIONS: 1,
  CREATE_RECOMMENDATION: 2,
  EDIT_RECOMMENDATION: 3
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

var RecommendationTypes = {
  AUTO:0,
  CUSTOM:1
};

var CreateRecommendationPage = React.createClass({
  getInitialState: function () {
    return {
      recommendationType: RecommendationTypes.CUSTOM,
      bookTags: [],
      userTags: [],
      selectedBooks: []
    };
  },
  componentDidMount: function () {
    $('#recommendation-type-toggle').bootstrapSwitch();
    $('#recommendation-type-toggle').on('switchChange.bootstrapSwitch', this._setRecommendationType);
  },
  _setRecommendationType: function (event, state) {
    console.log("recommendation type: " + state);
    if (state) {
      this.setState({recommendationType: 1});
    } else {
      this.setState({recommendationType: 0});      
    }
    $('#recommendation-type-toggle').bootstrapSwitch();
  },
  _setBookTags: function (tags) {
    this.setState({bookTags: tags});
  },
  _setUserTags: function (tags) { 
    this.setState({userTags: tags});
  },
  _selectBook: function (book) {
    var bookList = this.state.selectedBooks;
    if (_.findWhere(bookList, {"id":book.id}) == null) {
      bookList.push(book);
    }
    this.setState({selectedBooks: bookList});
  },
  _unselectBook: function (book) {
    var bookList = _.without(this.state.selectedBooks, book);
    this.setState({selectedBooks: bookList});
  },
  _addRecommendation: function () {
    console.log("selectedBooks state: " + JSON.stringify(this.state.selectedBooks));
    var viewRecommendations = this.props.viewRecommendations;
    var bookIds = this.state.selectedBooks.map (function (book) {
      return book.id;
    });

    console.log("selected bookIds: " + bookIds);
    $.ajax({
      type: "POST",
      url: "/admin/recommendations/add",
      data: {
        recommendation_type: this.state.recommendationType,
        book_ids: bookIds,
        book_tags: JSON.stringify(this.state.bookTags),
        project_tags: JSON.stringify(this.state.userTags)
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
  render: function () {
    if (this.state.recommendationType == RecommendationTypes.AUTO) {
      return (
        <div className="container">
          <div className="row">
            <div className="btn-group btn-group-lg col-md-10" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._addRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-2">
              <input type="checkbox" id="recommendation-type-toggle" onSwitchChange={this._setRecommendationType} defaultChecked={this.state.recommendationType} 
                data-on-text="Custom" data-off-text="Auto" data-on-color="info" data-off-color="success"/>
            </div>
          </div>
          <div className="row top-buffer">
            <div className="col-md-6">
              <div className="panel">
                <h3 className="panel-title"> Book Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationBookTagSearch setBookTags={this._setBookTags}/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="panel">
                <h3 className="panel-title"> Projects Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationUserTagSearch setUserTags={this._setUserTags}/>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return ( 
        <div className="container">
          <div className="row">
            <div className="btn-group btn-group-lg col-md-10" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._addRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-2">
              <input type="checkbox" id="recommendation-type-toggle" onSwitchChange={this._setRecommendationType} defaultChecked={this.state.recommendationType} 
                data-on-text="Custom" data-off-text="Auto" data-on-color="info" data-off-color="success"/>
            </div>
          </div>
          <div className="row top-buffer">
            <div className="col-md-8">
              <div className="panel">
                <h3 className="panel-title"> Book Search </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationBookSearch selectBook={this._selectBook} unselectBook={this._unselectBook} selectedBooks={this.state.selectedBooks}/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel">
                <h3 className="panel-title"> Project Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationUserTagSearch setUserTags={this._setUserTags}/>              
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
});

var RecommendationBookTagSearch = React.createClass({
  componentDidMount: function () {
    this.initTagbar(); 
  },
  getInitialState: function () {
    return {
      books: []
    };
  },
  initTagbar: function () {
    var mainSearch = $('.book-tagbar-input');
    mainSearch.tagsinput({
      tagClass: function(item) {
        switch (item.tagType) {
          case 'countries':     return countryLabel;
          case 'levels':        return levelLabel;
          case 'language':      return languageLabel;
          case 'genre':         return genreLabel;
        }
      },
      itemValue: 'value',
      itemText: 'text',
      typeahead: {
        name: 'recommendations',
        displayKey: 'text',
        source: gon.all_tags
      }
    });
    mainSearch.on('itemAdded', this.tagsUpdated);
    mainSearch.on('itemRemoved', this.tagsUpdated);

  },
  tagsUpdated: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    this.props.setBookTags(tags);
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    console.log("book tags: " + JSON.stringify(tags));

    var self = this;
    $.ajax({
      type: "GET",
      url: "/api/v1/books/search",
      dataType: "json",
      async: false,
      data: {
        tags: JSON.stringify(tags),
        term: "",
        page: 0
      },
      success: function(results) {
        self.setState({ books: results.books});
        console.log("results: " + JSON.stringify(results));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    if (tags.length == 0) {
      this.setState({books: []});
    }

  },
  render: function () {
    var bookList = this.state.books.map (function (book) {
      return (
        <li className="list-group-item" key={book.id}> {book.title}</li>
      );
    });
    return (
      <div>
        <div className="row panel-heading">
          <div id="book-tagbar" className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-tag"/>
            </span>
            <input className="book-tagbar-input input-block-level typeahead form-control" placeholder="Add a Tag" type="text"/>
          </div>
        </div>
        <div className="row panel-body">
          <div className="list-group">
            {bookList}
          </div>
        </div>
      </div>
    );
  }
});

var RecommendationUserTagSearch = React.createClass({
  componentDidMount: function () {
    this.initTagbar(); 
  },
  getInitialState: function () {
    return {
      users: []
    };
  },
  initTagbar: function () {
    var mainSearch = $('.user-tagbar-input');
    mainSearch.tagsinput({
      tagClass: function(item) {
        switch (item.tagType) {
          case 'countries':     return countryLabel;
          case 'levels':        return levelLabel;
          case 'language':      return languageLabel;
        }
      },
      itemValue: 'value',
      itemText: 'text',
      typeahead: {
        name: 'recommendations',
        displayKey: 'text',
        source: gon.project_tags
      }
    });
    mainSearch.on('itemAdded', this.tagsUpdated);
    mainSearch.on('itemRemoved', this.tagsUpdated);

  },
  tagsUpdated: function () {
    var tags = $(".user-tagbar-input").tagsinput("items");
    this.props.setUserTags(tags);
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".user-tagbar-input").tagsinput("items");
    console.log("user tags: " + JSON.stringify(tags));

  },
  render: function () {
    var userList = this.state.users.map (function (user) {
      return (
        <li className="list-group-item"> {user.email} </li>
      );
    });
    return (
      <div>
        <div className="row panel-heading">
          <div id="book-tagbar" className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-tag"/>
            </span>
            <input className="user-tagbar-input input-block-level typeahead form-control" placeholder="Add a Tag" type="text"/>
          </div>
        </div>
        <div className="row panel-body">
          <div className="list-group">
            {userList}
          </div>
        </div>
      </div>
    );
  }
});


var RecommendationBookSearch = React.createClass({
  componentDidMount: function () {
    this.initTagbar(); 
  },
  getInitialState: function () {
    return {
      books: [],
    };
  },
  initTagbar: function () {
    var mainSearch = $('.book-tagbar-input');
    mainSearch.tagsinput({
      tagClass: function(item) {
        switch (item.tagType) {
          case 'countries':     return countryLabel;
          case 'levels':        return levelLabel;
          case 'language':      return languageLabel;
          case 'genre':         return genreLabel;
        }
      },
      itemValue: 'value',
      itemText: 'text',
      typeahead: {
        name: 'recommendations',
        displayKey: 'text',
        source: gon.all_tags
      }
    });
    mainSearch.on('itemAdded', this.tagsUpdated);
    mainSearch.on('itemRemoved', this.tagsUpdated);
  },
  tagsUpdated: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    var searchTerm = $(".book-searchbar-input").val();
    var self = this;

    $.ajax({
      type: "GET",
      url: "/api/v1/books/search",
      dataType: "json",
      async: false,
      data: {
        tags: JSON.stringify(tags),
        term: searchTerm,
        page: 0
      },
      success: function(results) {
        self.setState({ books: results.books});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    if (tags.length == 0 && searchTerm=="") {
      this.setState({books: []});
    }
  },
  render: function () {
    var addBook = this.props.selectBook;
    var removeBook = this.props.unselectBook;
    var selectedBooks = this.props.selectedBooks;
    var bookList = this.state.books.map (function (book) {
      if (_.findWhere(selectedBooks, {"id": book.id}) == null) {
        return (
          <RecommendationBookListItem book={book} addBook={addBook} isSelected={false}/>
        );
      }
    });
    var selectedBookList = this.props.selectedBooks.map (function (book) {
      return (
        <RecommendationBookListItem book={book} removeBook={removeBook} isSelected={true}/>
      );
    })
    return (
      <div>
        <div className="row book-search-fields">
          <div id="book-searchbar" className="input-group">
            <input className="input-block-level form-control book-searchbar-input" onKeyUp={this.search} placeholder="Search for books" type="text" />
            <span className="input-group-btn">
              <button className="btn btn-default" id="search-button" onClick={this.updateSearch} type="button"><span className="glyphicon glyphicon-search"></span></button>
            </span>
          </div>
          <div id="book-tagbar" className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-tag"/>
            </span>
            <input className="book-tagbar-input input-block-level typeahead form-control" placeholder="Add a Tag" type="text"/>
          </div>
        </div>
        <div className="row book-search-rows">
          <div className="book-search-panel-left panel-boundary-right">
            <ul className="book-search-list">
              {bookList}
            </ul>
          </div>
          <div className="book-search-panel-right">
            <ul className="book-search-list">
              {selectedBookList}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

var RecommendationBookListItem = React.createClass({
  addBookToSelected: function () {
    var selectBook = this.props.addBook;
    selectBook(this.props.book);
  },
  removeBookFromSelected: function () {
    var unselectBook = this.props.removeBook;
    unselectBook(this.props.book);
  },
  render: function () {
    if (!this.props.isSelected) {
      return (
        <li key={this.props.book.id}> {this.props.book.title}
          <a onClick={this.addBookToSelected}><span className="glyphicon glyphicon-plus book-search-li-icon"/></a>
        </li>
      );
    } else {
      return (
        <li key={this.props.book.id}> {this.props.book.title}
          <a onClick={this.removeBookFromSelected}><span className="glyphicon glyphicon-minus book-search-li-icon"/></a>
        </li>
      );
    }
  }
});

