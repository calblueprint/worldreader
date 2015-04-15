/** @jsx React.DOM */

var TagModalContent = React.createClass({
  getInitialState: function() {
    return {
      selectedTags: []
    };
  },
  selectTag: function (tag) {
    var tags = _.union(this.state.selectedTags, [tag]);
    this.setState({
      selectedTags: tags
    });
  },
  removeTag: function (tag) {
    var tags = _.without(this.state.selectedTags, tag);
    this.setState({
      selectedTags: tags
    });
  },
  render: function() {
    var self = this;
    var levelTags = this.props.level_tags.map (function (tag) {
      var select = function () {
        self.selectTag(tag);
      }
      return (
        <a className="book-tag expanded-book-country label label-primary" onClick={select} key={tag.id}>
          {tag.text}
        </a>
        );
    });
    var countryTags = this.props.country_tags.map (function (tag) {
      var select = function () {
        self.selectTag(tag);
      }
      return (
        <a className="book-tag expanded-book-country label label-success" onClick={select} key={tag.id}>
          {tag.text}
        </a>
        );
    });
    var languageTags = this.props.language_tags.map (function (tag) {
      var select = function () {
        self.selectTag(tag);
      }
      return (
        <a className="book-tag expanded-book-country label label-warning" onClick={select} key={tag.id}>
          {tag.text}
        </a>
        );
    });
    var genreTags = this.props.genre_tags.map (function (tag) {
      var select = function () {
        self.selectTag(tag);
      }
      return (
        <a className="book-tag expanded-book-country label label-info" onClick={select} key={tag.id}>
          {tag.text}
        </a>
        );
    });
    var selectedTags = this.state.selectedTags.map (function (tag) {
      var remove = function () {
        self.removeTag(tag);
      };
      var tagLabel;
      switch(tag.tagType) {
        case 'country':       tagLabel = countryLabel; break;
        case 'levels':        tagLabel = levelLabel; break;
        case 'language':      tagLabel = languageLabel; break;
        case 'genre':         tagLabel = genreLabel; break;
      }
      return (
        <a className={"book-tag expanded-book-country " + tagLabel} onClick={remove}>{tag.text} <span className="modal-tag-delete">x</span></a>
        );
    });
    return (
      <div className="modal fade" id="HelpModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button aria-hidden="true" className="close" data-dismiss="modal" type="button"> ×</button>
              <h4 className="modal-title">
                Tag Help
              </h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <p>
                    Our books are associated with tags, including reading level, country, language, and genre. You can add these tags in this input bar, and the list will automatically update. Below is a list of our tags:
                  </p>
                  <h4>Levels:</h4>
                  {levelTags}
                  <h4>Countries:</h4>
                  {countryTags}
                  <h4>Languages:</h4>
                  {languageTags}
                  <h4>Genres:</h4>
                  {genreTags}
                </div>
                <div className="row">
                  <h4>Selected Tags</h4>
                  {selectedTags}
                </div>
                <div className="row">
                  <div className="btn btn-default modal-search-btn">
                    <a href={"?tags=" + JSON.stringify(this.state.selectedTags)}>
                      Search
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
