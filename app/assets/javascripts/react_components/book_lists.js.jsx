/** @jsx React.DOM */

/**
 * @prop booklists - the list of booklists
 */
var PublishedBookLists = React.createClass({
  getInitialState: function() {
    return {
      selectedList: null
    };
  },
  _selectBooklist: function(booklist) {
    if (this.state.selectedList == booklist) {
      this.setState({
        selectedList: booklist
      });
    } else {
      this.setState({
        selectedList: booklist
      });
    }
  },
  render: function() {
    var self = this;
    var shouldAddTable = false;
    var booklistItems = [];
    var i = 0;
    while (true) {
      var booklist = this.props.booklists[i];
      booklistItems.push(
        <BookListItem
          key={booklist.id}
          booklist={booklist}
          selected={booklist == self.state.selectedList}
          onClick={this._selectBooklist}
        />
      );
      if (booklist == self.state.selectedList) {
        shouldAddTable = true;
      }
      if (shouldAddTable) {
        shouldAddTable = false;
        booklistItems.push(
          <div className="booklist-table-prospective">
            <BookListTable
              booklist={self.state.selectedList.id}
              editable={false}
            />
          </div>
        );
      }
      if (booklist == _.last(this.props.booklists)) {
        break;
      }
      i++;
    }
    return (
      <div>
        <h2 className="text-center">Popular Book lists</h2>
        <h5 className="text-center">Check out some of Worldreader's most popular book lists!</h5>
        <div className="col-md-offset-1 col-md-10 media-list">
          {booklistItems}
        </div>
      </div>
    );
  }
});

var BookListItem = React.createClass({
  _onClick: function() {
    this.props.onClick(this.props.booklist);
  },
  _renderSelection: function() {
    return this.props.selected ? "booklist-selected" : "";
  },
  render: function() {
    return (
      <div className={"media booklist " + this._renderSelection()} onClick={this._onClick}>
          <img className="media-object booklist-img pull-left"
            src={this.props.booklist.image} />
        <div className="media-body booklist-body">
          <h4 className="media-heading">{this.props.booklist.name}</h4>
          <span>{this.props.booklist.description}</span>
        </div>
      </div>
    );
  }
});
