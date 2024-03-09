import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import _ from 'lodash';

import 'react-image-crop/dist/ReactCrop.css';

import Container from '@material-ui/core/Container';

import { listUsers } from '../actions/auth_actions';
import { fetchFollowingPosts } from '../actions/follow_action.js';
import { loadPage } from '../actions/posts_action.js';

import '../../static/frontend/mystyle.css';

import AnimatePage from '../components/AnimatePage.js';
import Post from '../components/posts.js';
import RightSidebar from '../components/rightSidebar.js';
import Sidebar from '../components/sidebar.js';


const useStyles = theme  =>  ({
    load : {
        margin : "10px auto",
        width : "max-content"
    }
});


export class FollowingPosts extends Component {
    constructor(props) {
        super(props)
        this.modulRef = React.createRef();
        this.state = {
            progress: false,
            open: false
        }
    }
    componentDidMount() {
        const { location } = this.props;
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id');
        
        if (userId) {
            this.props.fetchFollowingPosts(userId);
        }
        this.props.listUsers(() => {});
    }

    render() {
        const { classes, loadPosts} = this.props
        const { nextPage } = this.props.following_posts_reducer.follows;
        const { progress} = this.state
        const posts = this.props.following_posts_reducer.follows;
        const userID = this.props.authReducer.user.id;
        const sortedUsers = this.props.users
        .filter(user => user.profile !== null)
        .sort((a, b) => b.profile.followersCount - a.profile.followersCount)
        .slice(0, 6);

        return (
            <div className="flex-container">
                <div className="box1">
                    <Sidebar />
                </div>
                <div className="box2">
                <div className={classes.pc}>
                    <AnimatePage />
                    <Container>
                        {posts.length === 0 ? (
                            <div align="center" style={{color:"#5292f6"}}>
                                <p>Looks like you're not following anyone yet! Start exploring and connecting with interesting profiles to fill up your feed.</p>
                                {/* <img className="round" src={"../../static/frontend/papersE.png"} alt="user" /> */}

                            </div>
                        ) : (
                            <Post posts={posts} userID={userID} />
                        )}
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
                <div className="box3">
                    <div className = "container-card">
                    <h2>Top Writers</h2>
                        <RightSidebar
                            sortedUsers={sortedUsers}
                        />
                    </div>                                      
                </div>

            </div>
        )
        };
    loadPageClicked = () => {
        const { loadPage } = this.props

        this.setState({ progress: true })
        loadPage( () => {
            this.setState({progress : false})
        })
    }
}

const mapStateToProps = (state) => ({
    authReducer: state.authReducer,
    following_posts_reducer: state.following_posts_reducer || { posts: [] },
    users: state.usersReducer.users
});
  
export default connect(mapStateToProps, { fetchFollowingPosts, loadPage, listUsers })(withStyles(useStyles)(withRouter(FollowingPosts)));

