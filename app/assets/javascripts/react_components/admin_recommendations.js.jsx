/** @jsx React.DOM */

/* List view of recommendations, as well as buttons for creating recommendation */
var RecommendationPage = React.createClass({
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
  render: function () {
    return (
      // <CreateRecommendationPage/>
      <div className="container">
        <div className="panel panel-primary">
          <RecommendationList recommendations={this.state.recommendations} 
            selectedRecommendation={this.state.selectedRecommendation} 
            selectRecommendation={this._selectRecommendation} />
        </div>
      </div>
    );
  }
});

var RecommendationList = React.createClass({
  render: function () {
    var selectedRecommendation = this.props.selectedRecommendation;
    var selectRecommendation = this.props.selectRecommendation;
    var recommendationPills = this.props.recommendations.map (function (recommendation) {
      return (
        <Recommendation recommendation={recommendation} 
          clicked={_.isEqual(selectedRecommendation, recommendation.id)} 
          selectRecommendation={selectRecommendation} />
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
  render: function () {
    if (this.props.clicked) {
      return (
        <a href="#" className="list-group-item active" onClick={this.onClick}>
          {this.props.recommendation.id} 
          <span className="btn btn-default pull-right">Edit</span>
        </a>
      );
    }
    return (
      <a href="#" className="list-group-item" onClick={this.onClick}>
        {this.props.recommendation.id}
      </a>

    );
  }
});

var CreateRecommendationPage = React.createClass({
  getInitialState: function () {
    return {books: [], 
      partnerCategories: {},
      selectedPartnerCategories: {}, 
      selectedBooks: []};
  },
  componentDidMount: function () {
    this._fetchBooks({});
    this._fetchPartnerCategories({});
  },
  _fetchPartnerCategories: function (search_data) {
    $.ajax({
      url: "/admin/recommendations/display_partner_categories",
      dataType: 'json',
      data: search_data,
      success: function (data) {
        this.setState({partnerCategories: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString(), xhr);
      }.bind(this)
    });
  },
  _selectPartnerCategories: function (categoriesMap) {
    this.setState({selectedPartnerCategories: categoriesMap});
  },
  _fetchBooks: function (search_data) {
    $.ajax({
      url: "/admin/recommendations/display_books",
      dataType: 'json',
      data: search_data,
      success: function (data) {
        // console.log(data);
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
    if (this.state.selectedBooks.length == 0) {
      console.error("no books selected");
    }
    $.ajax({
      type: "POST",
      url: "/admin/recommendations/add",
      data: {
        book_ids: this.state.selectedBooks
      },
      success: function (message) {
        console.log("Recommendation succesfully created");
        //present message to user
      },
      error: function(xhr, status, err) {
        console.error("/admin/recommendations/add", status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  render: function () {
    return (
      <div className="container">
        <div className="col-md-4 panel">
          <div className="panel-heading">
            <RecommendationBookSearch/>
          </div>
          <div className="panel-body">
            <RecommendationBookList books={this.state.books} selectBook={this._selectBook}
            selectedBooks={this.state.selectedBooks}/>
          </div>
        </div>
        <button className="btn btn-default" onClick={this._addRecommendation}> Create Recommendation </button>
      </div>
    )
  }
});

var RecommendationBookSearch = React.createClass({
  _handleOnSubmit: function (e) {
    e.preventDefault();
  },
  render: function () {
    return (
      <div>
      <form className="navbar-form navbar-left" role="search">
        <div className="searchInput">
          <input type="text" className="form-control" onSubmit={this._handleOnSubmit}
            ref="search" placeholder="Search for books..." />
        </div>
        <div className="searchButton">
          <button type="submit" className="btn btn-default">Search</button>
        </div>
      </form>
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
          {this.props.book["name"]}</a>
      );
    }
    return (
        <a href="#" className="list-group-item" onClick={this.onClick}>
          {this.props.book["name"]}</a>
    );
  }
});
