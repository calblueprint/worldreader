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
  viewEditRecommendation: function (recommendation) {
    this.setState({currentView: views.EDIT_RECOMMENDATION,
                   recommendation: recommendation});
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
        <EditRecommendationPage viewRecommendations={this.viewRecommendations}
          recommendation={this.state.recommendation}/>
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
    if (recommendationId == this.state.selectedRecommendation) {
      this.setState({selectedRecommendation: null});
    } else {
      this.setState({selectedRecommendation: recommendationId});
    }
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
    var self = this;
    var recommendationPills = this.state.recommendations.map (function (recommendation) {
      return (
        <Recommendation recommendation={recommendation}
          clicked={_.isEqual(self.state.selectedRecommendation, recommendation.id)}
          selectedRecommendation={self.state.selectedRecommendation}
          selectRecommendation={self._selectRecommendation}
          deleteRecommendation={self._deleteRecommendation}
          editRecommendation={self.props.viewEditRecommendation} />
      );
    })
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
            <div className="list-group">
              {recommendationPills}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var Recommendation = React.createClass({
  getInitialState: function () {
    return {
      clicked: this.props.clicked, 
      projectTags: {}, 
      bookTags: {},
      books: []
    };
  },
  componentDidMount: function () {
    var r = this.props.recommendation;
    if (r.recommendation_type == RecommendationTypes.AUTO) {
      this.fetchBookTags();
    } else {
      this.fetchBooks();
    }
    this.fetchProjectTags();
  },
  fetchProjectTags: function () {
    var id = this.props.recommendation.id;
    $.ajax({
      url: "/admin/recommendations/" + id + "/display_proj_tags",
      dataType: 'json',
      success: function (data) {
        this.setState({projectTags: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  fetchBookTags: function () {
    var id = this.props.recommendation.id;
    $.ajax({
      url: "/admin/recommendations/" + id + "/display_book_tags",
      dataType: 'json',
      success: function (data) {
        this.setState({bookTags: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  fetchBooks: function () {
    var id = this.props.recommendation.id;
    $.ajax({
      url: "/admin/recommendations/" + id + "/display_books",
      dataType: 'json',
      success: function (data) {
        this.setState({books: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onClick: function () {
    this.props.selectRecommendation(this.props.recommendation.id);
  },
  deleteOnClick: function () {
    this.props.deleteRecommendation(this.props.recommendation.id);
  },
  editRecommendation: function () {
    this.props.editRecommendation(this.props.recommendation);
  },
  render: function () {
    var recommendation = this.props.recommendation;
    var type = recommendation.recommendation_type;
    var name;
    if (recommendation.name == "") {
      name = "Recommendation: " + recommendation.id;
    } else {
      name = recommendation.name;
    }

    if (this.props.clicked) {
      var projTags = this.state.projectTags;
      var projCountries = projTags.countries.map (function (country) {
        return (<li className={countryLabel+" tag-style"}>{country.name}</li>);
      });
      var projLanguages = projTags.languages.map (function (language) {
        return (<li className={languageLabel+" tag-style"}>{language.name}</li>);
      });
      if (type == RecommendationTypes.AUTO) {
        var bookTags = this.state.bookTags;
        var bookCountries = bookTags.countries.map (function (country) {
          return (<li className={countryLabel+" tag-style"}>{country.name}</li>);
        });
        var bookLanguages = bookTags.languages.map (function (language) {
          return (<li className={languageLabel+" tag-style"}>{language.name}</li>);
        });
        return (
          <a href="#" className="list-group-item" onClick={this.onClick}>
            <div className="row">
              {name}
              <div className="btn-group pull-right">
                <button type="button" className="btn btn-default"
                  onClick={this.editRecommendation}>
                  Edit
                </button>
                <button type="button" className="btn btn-default" 
                  onClick={this.deleteOnClick}>
                  <div className="glyphicon glyphicon-remove"/>
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                Type: AUTO
              </div>
              <div className="col-md-3">Book Tags
                <ul className="recommendation-display-list">
                  {bookCountries}
                  {bookLanguages}
                </ul>
              </div>
              <div className="col-md-3">Project Tags
                <ul className="recommendation-display-list">
                  {projCountries}
                  {projLanguages}
                </ul>
              </div>
            </div>
          </a>
        );
      } else {
        var books = this.state.books.map (function (book) {
          return (<li>{book.title}</li>);
        });
        return (
          <a href="#" className="list-group-item" onClick={this.onClick}>
            <div className="row">
              {name}
              <div className="btn-group pull-right">
                <button type="button" className="btn btn-default"
                  onClick={this.editRecommendation}>
                  Edit
                </button>
                <button type="button" className="btn btn-default" 
                  onClick={this.deleteOnClick}>
                  <div className="glyphicon glyphicon-remove"/>
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                Type: CUSTOM
              </div>
              <div className="col-md-3">Books
                <ul>
                  {books}
                </ul>
              </div>
              <div className="col-md-3">Project Tags
                <ul className="recommendation-display-list">
                  {projCountries}
                  {projLanguages}
                </ul>
              </div>
            </div>
          </a>
        );
      }
    }
    return (
      <a href="#" className="list-group-item" onClick={this.onClick}>
        {name}
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
      recommendationType: RecommendationTypes.AUTO,
      bookTags: [],
      projectTags: [],
      selectedBooks: []
    };
  },
  componentDidMount: function () {
    $('#recommendation-type-toggle').bootstrapSwitch();
    $('#recommendation-type-toggle').on('switchChange.bootstrapSwitch', this._setRecommendationType);
    $('.bootstrap-switch').css("float", "right");
  },
  _setRecommendationType: function (event, state) {
    if (state) {
      this.setState({recommendationType: RecommendationTypes.CUSTOM});
    } else {
      this.setState({recommendationType: RecommendationTypes.AUTO});      
    }
    $('#recommendation-type-toggle').bootstrapSwitch();
  },
  _setBookTags: function (tags) {
    this.setState({bookTags: tags});
  },
  _setProjectTags: function (tags) { 
    this.setState({projectTags: tags});
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
    var viewRecommendations = this.props.viewRecommendations;
    var bookIds = _.pluck(this.state.selectedBooks, "id");

    var hasErrors = false;
    if (this.state.projectTags.length == 0) {
      toastr.error("No project tags selected");
      hasErrors = true;
    }
    if (this.state.recommendationType == RecommendationTypes.CUSTOM) {
      if (bookIds.length == 0) {
        toastr.error("No books selected");
        hasErrors = true;
      }
    } else {
      if (this.state.bookTags.length == 0) {
        toastr.error("No book tags selected");
        hasErrors = true;
      }
    }
    if (hasErrors) return;

    $.ajax({
      type: "POST",
      url: "/admin/recommendations/add",
      data: {
        name: $('.name-field').val(),
        recommendation_type: this.state.recommendationType,
        book_ids: bookIds,
        book_tags: JSON.stringify(this.state.bookTags),
        project_tags: JSON.stringify(this.state.projectTags)
      },
      success: function (message) {
        toastr.success("Success! Created Recommendation");
        viewRecommendations();
      },
      error: function(xhr, status, err) {
        console.error("/admin/recommendations/add", status, err.toString(), xhr);
        toastr.error("Error creating recommendation");
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
            <div className="btn-group btn-group-lg col-md-4" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._addRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group input-group-lg name-input-group">
                <input type="text" className="form-control name-field" placeholder="Enter a Name"/>
              </div>
            </div>
            <div className="col-md-4">
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
                <RecommendationProjectTagSearch setProjectTags={this._setProjectTags}/>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return ( 
        <div className="container">
          <div className="row">
            <div className="btn-group btn-group-lg col-md-4" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._addRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group input-group-lg name-input-group">
                <input type="text" className="form-control name-field" placeholder="Enter a Name"/>
              </div>
            </div>
            <div className="col-md-4">
              <input type="checkbox" id="recommendation-type-toggle" onSwitchChange={this._setRecommendationType} defaultChecked={this.state.recommendationType} 
                data-on-text="Custom" data-off-text="Auto" data-on-color="info" data-off-color="success"/>
            </div>
          </div>
          <div className="row top-buffer">
            <div className="col-md-8">
              <div className="panel">
                <h3 className="panel-title"> Book Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationBookSearch selectBook={this._selectBook} unselectBook={this._unselectBook} selectedBooks={this.state.selectedBooks}/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel">
                <h3 className="panel-title"> Project Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationProjectTagSearch setProjectTags={this._setProjectTags}/>              
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
});

var EditRecommendationPage = React.createClass({
  getInitialState: function () {
    var rec = this.props.recommendation;
    var id = rec.id;
    $.ajax({
      url: "/admin/recommendations/" + id + "/display_proj_tags",
      dataType: 'json',
      success: function (data) {
        this.setState({projectTags: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    return {
      recommendationType: rec.recommendation_type,
      bookTags: [],
      projectTags: [],
      selectedBooks: []
    };
  },
  componentDidMount: function () {
    $('#recommendation-type-toggle').bootstrapSwitch();
    $('#recommendation-type-toggle').on('switchChange.bootstrapSwitch', this._setRecommendationType);
    $('.bootstrap-switch').css("float", "right");

    var rec = this.props.recommendation;
    $('.name-field').val(rec.name);

    var self = this;
    $.ajax({
      url: "/admin/recommendations/" + rec.id + "/display_proj_tags",
      dataType: 'json',
      success: function (data) {
        var projTags = [];
        data.countries.map (function (country) {
          var tag = _.findWhere(gon.project_tags, {id: country.id, tagType:"countries"});
          projTags.push(tag);
        });
        data.languages.map (function (lang) {
          var tag = _.findWhere(gon.project_tags, {id: lang.id, tagType:"language"});
          projTags.push(tag);
        });
        self.setState({projectTags: projTags});
        projTags.map (function (tag) {
          $('.project-tagbar-input').tagsinput('add', tag);
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    if (rec.recommendation_type == RecommendationTypes.AUTO) {
      $.ajax({
        url: "/admin/recommendations/" + rec.id + "/display_book_tags",
        dataType: 'json',
        success: function (data) {
          var bookTags = [];
          data.countries.map (function (country) {
            var tag = _.findWhere(gon.all_tags, {id: country.id, tagType:"countries"});
            bookTags.push(tag);
          });
          data.languages.map (function (lang) {
            var tag = _.findWhere(gon.all_tags, {id: lang.id, tagType:"language"});
            bookTags.push(tag);
          });
          self.setState({bookTags: bookTags});
          bookTags.map ( function (tag) {
            $('.book-tagbar-input').tagsinput('add', tag);
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      $.ajax({
        url: "/admin/recommendations/" + rec.id + "/display_books",
        dataType: 'json',
        success: function (data) {
          self.setState({selectedBooks: data});
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  _setRecommendationType: function (event, state) {
    if (state) {
      this.setState({recommendationType: RecommendationTypes.CUSTOM});
    } else {
      this.setState({recommendationType: RecommendationTypes.AUTO});      
    }
    $('#recommendation-type-toggle').bootstrapSwitch();
  },
  _setBookTags: function (tags) {
    this.setState({bookTags: tags});
  },
  _setProjectTags: function (tags) { 
    this.setState({projectTags: tags});
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
  _submitRecommendation: function () {
    var viewRecommendations = this.props.viewRecommendations;
    var bookIds = _.pluck(this.state.selectedBooks, "id");

    var hasErrors = false;
    if (this.state.projectTags.length == 0) {
      toastr.error("No project tags selected");
      hasErrors = true;
    }
    if (this.state.recommendationType == RecommendationTypes.CUSTOM) {
      if (bookIds.length == 0) {
        toastr.error("No books selected");
        hasErrors = true;
      }
    } else {
      if (this.state.bookTags.length == 0) {
        toastr.error("No book tags selected");
        hasErrors = true;
      }
    }
    if (hasErrors) return;

    var rec = this.props.recommendation;
    $.ajax({
      type: "POST",
      url: "/admin/recommendations/" + rec.id + "/edit",
      data: {
        name: $('.name-field').val(),
        recommendation_type: this.state.recommendationType,
        book_ids: bookIds,
        book_tags: JSON.stringify(this.state.bookTags),
        project_tags: JSON.stringify(this.state.projectTags)
      },
      success: function (message) {
        toastr.success("Recommendation successfully edited!");
        viewRecommendations();
      },
      error: function(xhr, status, err) {
        console.error("/admin/recommendations/add", status, err.toString(), xhr);
        toastr.error("Error editing recommendation");
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
            <div className="btn-group btn-group-lg col-md-4" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._submitRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group input-group-lg name-input-group">
                <input type="text" className="form-control name-field" placeholder="Enter a Name"/>
              </div>
            </div>
            <div className="col-md-4">
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
                <RecommendationProjectTagSearch setProjectTags={this._setProjectTags}/>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return ( 
        <div className="container">
          <div className="row">
            <div className="btn-group btn-group-lg col-md-4" role="group">
              <div className="btn btn-default" onClick={this.props.viewRecommendations}> 
                <span className="glyphicon glyphicon-chevron-left"></span> Back
              </div>
              <div className="btn btn-default" onClick={this._submitRecommendation}> 
                Done 
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group input-group-lg name-input-group">
                <input type="text" className="form-control name-field" placeholder="Enter a Name"/>
              </div>
            </div>
            <div className="col-md-4">
              <input type="checkbox" id="recommendation-type-toggle" onSwitchChange={this._setRecommendationType} defaultChecked={this.state.recommendationType} 
                data-on-text="Custom" data-off-text="Auto" data-on-color="info" data-off-color="success"/>
            </div>
          </div>
          <div className="row top-buffer">
            <div className="col-md-8">
              <div className="panel">
                <h3 className="panel-title"> Book Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationBookSearch selectBook={this._selectBook} unselectBook={this._unselectBook} selectedBooks={this.state.selectedBooks}/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel">
                <h3 className="panel-title"> Project Tags </h3>
                <div className="panel-boundary-bottom"/>
                <RecommendationProjectTagSearch setProjectTags={this._setProjectTags}/>              
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
      books: [],
      pageNumber: 0,
      isLastPage: true
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
    this.setState({books: [], pageNumber: 0});
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.setState({books: [], pageNumber: 0});
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    var self = this;
    var state = this._pendingState == null || this.state ? this.state : this._pendingState;
    $.ajax({
      type: "GET",
      url: "/api/v1/books/search",
      dataType: "json",
      async: false,
      data: {
        tags: JSON.stringify(tags),
        term: "",
        page: state.pageNumber
      },
      success: function(results) {
        self.setState({books: self.state.books.concat(results.books),
                       isLastPage: results.books.length == 0});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    if (tags.length == 0) {
      this.setState({books: [], pageNumber: 0, isLastPage: true});
    }
  },
  loadMore: function (pageToLoad) {
    this.setState({pageNumber: this.state.pageNumber + 1});
    this.updateSearch();
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
          <div className="list-group list-padding">
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={!this.state.isLastPage}
              threshold={250}
              loader={<div className="loader">Loading...</div>}>
                {bookList}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    );
  }
});

var RecommendationProjectTagSearch = React.createClass({
  componentDidMount: function () {
    this.initTagbar(); 
  },
  getInitialState: function () {
    return {
      projects: []
    };
  },
  initTagbar: function () {
    var mainSearch = $('.project-tagbar-input');
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
    var tags = $(".project-tagbar-input").tagsinput("items");
    this.props.setProjectTags(tags);
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".project-tagbar-input").tagsinput("items");
    var self = this;
    $.ajax({
      type: "GET",
      url: "/api/v1/projects/search",
      dataType: "json",
      async: false,
      data: {
        tags: JSON.stringify(tags),
        term: "",
      },
      success: function(results) {
        self.setState({ projects: results.projects});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    if (tags.length == 0) {
      this.setState({projects: []});
    }
  },
  render: function () {
    var projectList = this.state.projects.map (function (project) {
      return (
        <li className="list-group-item"> {project.name} </li>
      );
    });
    return (
      <div>
        <div className="row panel-heading">
          <div id="book-tagbar" className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-tag"/>
            </span>
            <input className="project-tagbar-input input-block-level typeahead form-control" placeholder="Add a Tag" type="text"/>
          </div>
        </div>
        <div className="row panel-body">
          <div className="list-group list-padding">
            {projectList}
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
      pageNumber: 0,
      isLastPage: true
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
    // var tags = $(".book-tagbar-input").tagsinput("items");
    this.setState({books: [], pageNumber: 0});
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.setState({books: [], pageNumber: 0});
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    var searchTerm = $(".book-searchbar-input").val();
    var self = this;
    var state = this._pendingState == null || this._pendingState == this.state ?
      this.state : this._pendingState;

    $.ajax({
      type: "GET",
      url: "/api/v1/books/search",
      dataType: "json",
      async: false,
      data: {
        tags: JSON.stringify(tags),
        term: searchTerm,
        page: state.pageNumber
      },
      success: function(results) {
        self.setState({ books: state.books.concat(results.books),
                        isLastPage: results.books.length == 0});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    if (tags.length == 0 && searchTerm=="") {
      this.setState({books: []});
    }
  },
  loadMore: function(pageToLoad) {
    this.setState({pageNumber: this.state.pageNumber + 1});
    this.updateSearch();
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
          <div className="book-search-panel-left">
            <ul className="book-search-list">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={!this.state.isLastPage}
                threshold={250}
                load={<div className="loader">Loading...</div>}>
                  {bookList}
              </InfiniteScroll>
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

