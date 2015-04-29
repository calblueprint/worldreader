jest.dontMock('../tag_modal.jsx');

describe('Tag Modal', function() {
  it('displays tag information and allows tag selection', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var TagModalContent = require('../tag_modal');
    var $ = require('jquery');
    var _ = require('underscore');

    // Render Tag Modal
    var tagModal = TestUtils.renderIntoDocument(<TagModalContent level_tags={[]}
        country_tags={[]} language_tags={[]} genre_tags={[]}/>);

    // Get modal-header from DOM and check text
    var modalHeader = TestUtils.findRenderedDOMComponentWithClass(tagModal, "modal-title");
    expect(modalHeader.getDOMNode().textContent).toEqual('Tag Help');

    // Check initial state of tagModal
    expect(tagModal.state).toEqual({selectedTags: []});
  });
});
