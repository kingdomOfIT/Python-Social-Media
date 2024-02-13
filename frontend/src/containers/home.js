import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Sidebar from "../components/sidebar.js";
import AddModal from '../components/addModal'

import { Container } from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { listUsers } from '../actions/auth_actions';

import AnimatePage from "../components/AnimatePage" 
import Post from '../components/posts.js'
import { loadPage } from "../actions/posts_action"
import '../../static/frontend/mystyle.css';

import { withRouter} from 'react-router-dom';


const useStyles = theme  =>  ({
    load : {
        margin : "10px auto",
        width : "max-content"
    }
});

class Home extends Component {

    state = {
        progress : false,
        open : false
    }

    handleModal = () => {
        this.setState({open : false })
    }
    onOpenModal = () => {
        this.setState({open : true})
    }

    async componentDidMount() {
        this.props.listUsers(() => {});
    }

    render() {
        const { classes, loadPosts} = this.props
        const { nextPage } = this.props.posts
        const { progress} = this.state
        const posts = this.props.posts.posts ? this.props.posts.posts : this.props.posts;
        const userID = this.props.authReducer.user.id;
        const sortedUsers = this.props.users
        .filter(user => user.profile !== null)
        .sort((a, b) => b.profile.followers_count - a.profile.followers_count)
        .slice(0, 6);
        // this.renderList(sortedUsers);
        
        if (loadPosts){
            return <div style={{ textAlign: "center", marginTop: "50px" }} > <CircularProgress /></div>
        }
        return (
            <div class="flex-container">
                <div class="box1">
                    <Sidebar />
                </div>
                <div class="box2">
                    <div class="create-post">
                    <div class="profile-container">
                        <div class="profile-picture">
                            <img src={this.props.authReducer.user.profile.image_path}
                            alt="Profile Picture"></img>
                        </div>
                        <input type="text" class="text-field" placeholder="Your amazing story starts here..." onClick={this.onOpenModal}></input>
                        <AddModal open={this.state.open} onClose={this.handleModal} />
                    </div>
                    </div>
                <div className={classes.pc}>
                    <AnimatePage />
                    <Container>
                        <Post
                            posts={posts}
                            userID={userID}
                        />
                        <div className={classes.load}>
                            { nextPage &&
                            <Button variant="outlined" size="medium" color="primary"
                            onClick={this.loadPageClicked} style = {{ marginRight : "5px"}}>
                                Load More
                            </Button> }
                            { progress && <CircularProgress /> }
                        </div>
                    </Container>
                </div>
                </div>
                <div class="box3">
                    <div className = "container-card">
                    <h2>Top Writers</h2>
                        {this.renderList(sortedUsers)} 
                    </div>                                      
                </div>

            </div>
        )
    }

    loadPageClicked = () => {
        const { loadPage } = this.props

        this.setState({ progress: true })
        loadPage( () => {
            this.setState({progress : false})
        })
    }
    renderList = (sortedUsers) => {
        const pairs = [];
        for (let i = 0; i < sortedUsers.length; i += 2) {
            if (i + 1 < sortedUsers.length) {
                pairs.push([sortedUsers[i], sortedUsers[i + 1]]);
            } else {
                pairs.push([sortedUsers[i]]);
            }
        }
    
        return pairs.map((pair, index) => (
            <div key={index} className="row">
                {pair.map((user, innerIndex) => {
                    const username = user.username;
                    const first_name = user.first_name;
                    const last_name = user.last_name;
                    const profileImage = user.profile ? user.profile.image_path : "https://picsum.photos/200";
                    return (
                        <div key={innerIndex} className="card-container">
                            <img className="round" src={profileImage} alt="user" />
                            <h3>{first_name} {last_name}</h3>
                            <h6>@{username}</h6>
                        </div>
                    );
                })}
            </div>
        ));
    }
    
}

const mapStateToProps = (state) => {
    return { 
        authReducer : state.authReducer,
        users: state.usersReducer.users
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { loadPage, listUsers })(withStyles(useStyles)(withRouter(Home)));