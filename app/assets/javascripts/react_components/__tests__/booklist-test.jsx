jest.dontMock('../book.jsx');

describe('BookList', function() {
  it('BookList ', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var TagModalContent = require('../tag_modal');
    var BookTile = require('../book_tiles');
    var InfiniteScroll = require('../react-infinite-scroll');
    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
    var $ = require('jquery');

    var BookList = require('../book');
    // TODO move gon dependencies to slim files in all react components
    // var bookList = TestUtils.renderIntoDocument(<BookList/>);
    // expect(demoComponent.getDOMNode().textContent).toBe('Demo Component');
  });
});
