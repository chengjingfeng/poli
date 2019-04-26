
import React from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showUpdatePassword: false,
      id: null,
      username: '',
      name: '',
      sysRole: '',
      apiKey: '',
      password: '',
      confirmedPassword: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    axios.get('/ws/user/account')
      .then(res => {
        const user = res.data;
        this.setState({
          id: user.id,
          username: user.username,
          name: user.name,
          sysRole: user.sysRole,
          apiKey: user.apiKey
        });
      });
  }

  generateApiKey = () => {
    axios.get('/auth/generate-apikey')
      .then(res => {
        const apiKey = res.data;
        this.setState({
          apiKey: apiKey
        });
      });
  }

  save = () => {
    const {
      showUpdatePassword,
      name,
      password,
      confirmedPassword
    } = this.state;

    const user = {
      name: name
    }

    if (showUpdatePassword) {
      if (password !== confirmedPassword) {
        Toast.showError(`Those passwords didn't match.`);
        return;
      }  

      if (password.length < 8) {
        Toast.showError(`Use 8 or more characters for password.`);
        return;
      }

      user.password = password;
    }

    axios.put('/ws/user/account', user)
      .then(res => {
      });
  }

  toggleUpdatePassword = () => {
    this.setState(prevState => ({
      showUpdatePassword: !prevState.showUpdatePassword
    })); 
  }

  render() {
    const {
      showUpdatePassword,
      username,
      sysRole,
      apiKey
    } = this.state;

    return (
      <div className="full-page-content">
        <div className="form-panel" style={{width: '500px'}}>   
          <label>Username</label>
          <div>{username}</div>

          <label>Name</label>
          <input 
            type="text"   
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} />

          <label>System Role</label>
          <div>{sysRole}</div>

          <label>API Key</label>
          <div>{apiKey}</div>
          <button className="button mt-10" onClick={this.generateApiKey}>Generate new API Key</button>
          <br/>

          <button className="button mt-3" onClick={this.toggleUpdatePassword}>Update password</button>
          {
            showUpdatePassword && (
              <React.Fragment>
                <br/>
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={this.state.password}
                  onChange={this.handleInputChange} />
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmedPassword" 
                  value={this.state.confirmedPassword}
                  onChange={this.handleInputChange} />
              </React.Fragment>
          )}

          <br/>
          <button className="button mt-10" onClick={this.save}>Save</button>
        </div>
      </div>
    )
  }
}

export default Account;