/** @jsx React.DOM */

var EditRecommendationPage = React.createClass({
  getInitialState: function () {
    return {
      recommendation_id: this.props.recommendation_id,
      books: this.props.books, 
      partnerCategories: this.props.partnerCategories,
      selectedPartnerCategories: this.props.selectedPartnerCategories, 
      selectedBooks: this.props.selectedBooks
    };
  },
  componentDidMount: function () {
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
  _selectCategories: function (categories) {
    this.setState({selectedPartnerCategories: categories});
  },
  _submitRecommendation: function () {
    if (this.state.selectedBooks.length == 0) {
      console.error("no books selected");
    }
    $.ajax({
      type: "POST",
      url: "/admin/recommendations/edit",
      data: {
        recommendation_id: this.state.recommendation_id,
        book_ids: this.state.selectedBooks,
        school: this.state.selectedPartnerCategories.school,
        organization: this.state.selectedPartnerCategories.organization,
        country: this.state.selectedPartnerCategories.country
      },
      error: function(xhr, status, err) {
        console.error("/admin/recommendations/add", status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
});