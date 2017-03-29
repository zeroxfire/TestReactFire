//Initial Firebase
var config = {
  apiKey: "AIzaSyBwQsSSXjXrLRII2WHW_i9XE7ZPJ776k-4",
  authDomain: "reactfire-7d495.firebaseapp.com",
  databaseURL: "https://reactfire-7d495.firebaseio.com",
  storageBucket: "reactfire-7d495.appspot.com",
  messagingSenderId: "735537374642"
};
firebase.initializeApp(config);

//Initial Facebook Login
var provider = new firebase.auth.FacebookAuthProvider();

//Converter for render JSX
var converter = new Showdown.converter();

var LoginFrame = React.createClass({
  render: function() {
    return  <div>
              <p>Hi, {this.props.user!=null ? this.props.user.displayName : 'Annonymous'}!</p>
              <button onClick={this.props.loginWithFacebook}>Login with Facebook</button><button onClick={this.props.logOut}>Log Out</button>
            </div>;
    }
});


var WaitQueueList = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <tr key={ index }>
          <td>{ item.text } {getDateString(item.time)}</td>
          <td>
            <button className="btn btn-default" onClick={ _this.props.triggerStatusItem1.bind(null, item['.key']) }>A</button>
          </td>
          <td>
            <button className="btn btn-default" onClick={ _this.props.triggerStatusItem2.bind(null, item['.key']) }>B</button>
          </td>
          <td>
            <button className="btn btn-default" onClick={ _this.props.triggerStatusItem3.bind(null, item['.key']) }>C</button>
          </td>
        </tr>
      );
    };
    return  <div className={'col-sm-12'}>
            <table className={'table table-striped table-hover'}>
              <thead>
                <th>Name</th>
                <th colSpan={3}></th>
              </thead>
              <tbody>
              { this.props.items.map(createItem) }
              </tbody>
            </table>
            </div>;
  }
});

var WaitQueueApp = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      items: [],
      text: '',
      status: 0,
      time: ''
    };
  },

  componentWillMount: function() {
    var firebaseRef = firebase.database().ref('waitQueueApp/items');
    this.bindAsArray(firebaseRef.limitToLast(25), 'items');
    this.setState({user: null});
  },

  onChange: function(e) {
    this.setState({text: e.target.value, user: e.target.user});
  },

  triggerStatusItem1: function(key) {
    var firebaseRef = firebase.database().ref('waitQueueApp/items');
    firebaseRef.child(key).update({status: 1});
  },

  triggerStatusItem2: function(key) {
    var firebaseRef = firebase.database().ref('waitQueueApp/items');
    firebaseRef.child(key).update({status: 2});
  },

  triggerStatusItem3: function(key) {
    var firebaseRef = firebase.database().ref('waitQueueApp/items');
    firebaseRef.child(key).update({status: 3});
  },

  loginWithFacebook: function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      this.setState({user: result.user});
    }.bind(this));
  },

  logOut: function() {
    firebase.auth().signOut().then(function() {
      this.setState({user: null});
    }.bind(this));
  },

  handleSubmit: function(e) {
    var currentDate = new Date().toLocaleString();
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRefs['items'].push({
        text: this.state.text,
        status: 0,
        time: currentDate
      });
      this.setState({
        text: ''
      });
    }
  },

  render: function() {
    return (
      <div>
        <LoginFrame user={this.state.user} loginWithFacebook={this.loginWithFacebook} logOut={this.logOut}/>
        <WaitQueueList items={ this.state.items } triggerStatusItem1={ this.triggerStatusItem1 } triggerStatusItem2={this.triggerStatusItem2} triggerStatusItem3={this.triggerStatusItem3} />
        <form onSubmit={ this.handleSubmit }>
          <input onChange={ this.onChange } value={ this.state.text } />
          <button>{ 'เพิ่ม #' + (this.state.items.length + 1) }</button>
        </form>
      </div>
    );
  }
});

ReactDOM.render(<WaitQueueApp />, document.getElementById('waitQueueApp'));

var getDateString = function(dateView){
  var dateInput = new Date(dateView);
  return dateInput.getDate() + '/' + (dateInput.getMonth()+1) + '/' + dateInput.getFullYear() + ' ' + (dateInput.getHours()<10 ? '0' : '') + dateInput.getHours() + ':' + (dateInput.getMinutes()<10 ? '0' : '') + dateInput.getMinutes();
};
