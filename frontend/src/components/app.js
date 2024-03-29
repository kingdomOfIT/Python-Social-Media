import React , { Component } from "react"
import { Route ,HashRouter ,Switch} from "react-router-dom"
import { connect } from "react-redux"
import WOW from 'wowjs'; 

import Login from "../containers/auth/login"
import Nav from "../containers/nav"
import PrivateRoute from '../containers/auth/PrivateRoute'
import Home from '../containers/home'
import Register  from '../containers/auth/register/Register'
import Alerts from "../containers/alerts"
import UserInfo from "../containers/profile"
import SavedPost from "../containers/saved"
import LikedPost from "../containers/liked"
import FollowingPosts from "../containers/following"

import { getuser } from '../actions/auth_actions'
import { getPosts } from '../actions/posts_action' 

class App extends Component {
    state = {
        loadPosts: true
    }
    componentWillMount() {
        this.props.getuser()
        this.props.getPosts( () => {
            this.setState({ loadPosts : false })
        })
        new WOW.WOW({
            live: false
        }).init();
    }

    render(){
        return (
            <div className="main2">
                <HashRouter >
                    <Nav />
                    <Alerts />
                    <Switch >
                        <PrivateRoute exact path="/" home={true}
                        loadPosts = {this.state.loadPosts} component = {Home}/>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <PrivateRoute exact path="/user-info" component={UserInfo} />
                        <PrivateRoute exact path="/saved" component={SavedPost} />
                        <PrivateRoute exact path="/liked" component={LikedPost} />
                        <PrivateRoute exact path="/following" component={FollowingPosts} />
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}

export default connect(null , { getuser, getPosts })(App)