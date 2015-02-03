/** @jsx React.DOM */

var users_views = {
  USERS: 1,
  CREATE_USER: 2,
  EDIT_USER: 3
};

/* Handles transitions between users_views within Users tab */
var ManageUserInfo = React.createClass({
  getInitialState: function () {
    return {currentView: users_views.USERS};
  },
  viewUsers: function () {
    this.setState({currentView: users_views.USERS});
  },
  viewCreateUser: function () {
    this.setState({currentView: users_views.CREATE_USER});
  },
  viewEditUsers: function () {
    this.setState({currentView: users_views.EDIT_USER});
  },
  render: function () {
    if (this.state.currentView == users_views.USERS) {
      return (
        <UsersPage viewCreateUser={this.viewCreateUser} 
          viewEditUser={this.viewEditUser} />
        );
    }
    else if (this.state.currentView == users_views.CREATE_USER) {
      return (
        <CreateUserPage viewUsers={this.viewUsers}/>
        );
    }
    else if (this.state.currentView == users_views.EDIT_USER) {
      return (
        <div/>
        );
    }
  }
});

/* List view of Users, as well as buttons for creating User */
var UsersPage = React.createClass({
  getInitialState: function () {
    return {Users: [], selectedUser: null};
  },
  componentDidMount: function () {
    this._fetchUsers({});
  },
  _fetchUsers: function (search_data) {

  },
  _selectUser: function (UserId) {
    this.setState({selectedUser: UserId});
  },
  _createUser: function () {
    this.props.viewCreateUser();
  },
  _deleteUser: function (UserId) {
    var fetchUsers = this._fetchUsers;
  },
  render: function () {
    return (
      <div className="container">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div className="row">
              <div className="col-md-12">
                <div className="btn btn-default pull-right" onClick={this._createUser}><span className="glyphicon glyphicon-plus"/></div>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <UserList Users={this.state.Users} 
              selectedUser={this.state.selectedUser} 
              selectUser={this._selectUser} 
              deleteUser={this._deleteUser} />
          </div>
        </div>
      </div>
    );
  }
});

var UserList = React.createClass({
  render: function () {
    var selectedUser = this.props.selectedUser;
    var selectUser = this.props.selectUser;
    var deleteUser = this.props.deleteUser;
    var UserPills = this.props.Users.map (function (User) {
      return (
        <User User={User} 
          clicked={_.isEqual(selectedUser, User.id)} 
          selectUser={selectUser} 
          deleteUser={deleteUser} />
      );
    });
    return (
      <div className="list-group">
        {UserPills}
      </div>
    );
  }
});

var User = React.createClass({
  getInitialState: function () {
    return {clicked: this.props.clicked};
  },
  onClick: function () {
    this.props.selectUser(this.props.User.id);
  },
  deleteOnClick: function () {
    this.props.deleteUser(this.props.User.id);
  },
  render: function () {
    if (this.props.clicked) {
      return (
        <a href="#" className="list-group-item row" onClick={this.onClick}>
          <div className="row">
            {"User: " + this.props.User.id}
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
        {"User: " + this.props.User.id}
      </a>

    );
  }
});

var CreateUserPage = React.createClass({
  getInitialState: function () {
    return {

    };
  },
  componentDidMount: function () {
  },
  _addUser: function () {
    var viewUsers = this.props.viewUsers;
    if (this.state.selectedBooks.length == 0) {
      console.error("no books selected");
    }
    $.ajax({
      type: "POST",
      url: "/admin/users/add",
      data: {
        book_ids: this.state.selectedBooks,
        country_ids: this.state.tags.countries,
        language_ids: this.state.tags.languages
      },
      success: function (message) {
        console.log("User succesfully created");
        //present message to user
        viewUsers();
      },
      error: function(xhr, status, err) {
        console.error("/admin/Users/add", status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  createUser: function() {
    debugger;
    $.ajax({
      type: "POST",
      url: "/users",
      data: {
        authenticity_token: gon.auth_token,
        first_name: $('#new_user_first_name').val(),
        last_name: $('#new_user_last_name').val(),
        email: $('#new_user_email').val(),
        password: $('#new_user_password').val(),
        password_confirmation: $('#new_user_password_confirmation').val()
      },
      success: function (message) {
        console.log("User succesfully created");
      },
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString(), xhr);
      }.bind(this)
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  render: function () {
    return (
      <div className="container">
        <div className="row btn-group btn-group-lg" role="group">
          <div className="btn btn-default" onClick={this.props.viewUsers}> 
            <span className="glyphicon glyphicon-chevron-left"></span> Back
          </div>
          <div className="btn btn-default" onClick={this._addUser}> 
            Done 
          </div>
        </div>
        <div className="row">
          <input type="hidden" name="authenticity_token" value={gon.auth_token} />
          <label for="inputFirstName">First Name</label>
          <div class="input-group">
            <input class="inputFirstName" id="new_user_first_name" name="user[first_name]" type="text"></input>
          </div>

          <label for="inputLastName">Last Name</label>
          <div class="input-group">
            <input class="inputLastName" id="new_user_last_name" name="user[last_name]" type="text"></input>
          </div>

          <label for="inputEmail">E-mail address</label>
          <div class="input-group">
            <span class="input-group-addon">@</span>
            <input class="inputEmail" id="new_user_email" name="user[email]" placeholder="Enter email" type="email"></input>
          </div>

          <label for="inputPassword">Password</label>
          <div class="input-group">
            <input class="inputPassword" id="new_user_password" name="user[password]" placeholder="Password" type="password">
            </input>
          </div>

          <label for="confirmPassword">Confirm Password</label>
          <div class="input-group">
            <input class="confirmPassword" id="new_user_password_confirmation" name="user[password_confirmation]" placeholder="Password" type="password">
            </input>
            <span class="input-group-btn">
              <button class="btn btn-default" onClick={this.createUser}>
                Make User
              </button>
            </span>
          </div>
        </div>
      </div>
    )
  }
});