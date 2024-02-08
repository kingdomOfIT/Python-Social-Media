import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import "react-image-crop/dist/ReactCrop.css";
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';

import Container from '@material-ui/core/Container';

import { fetchFollowingPosts } from '../actions/follow_action.js'
import '../../static/frontend/mystyle.css';
import Post from "../components/posts.js";
import { loadPage } from "../actions/posts_action"
import Sidebar from "../components/sidebar.js";
import AnimatePage from "../components/AnimatePage" 


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
    }

    render() {
        const { classes, loadPosts} = this.props
        const { nextPage } = this.props.following_posts_reducer.follows;
        const { progress} = this.state
        const posts = this.props.following_posts_reducer.follows;
        const userID = this.props.authReducer.user.id;

        return (
            <div class="flex-container">
                <div class="box1">
                    <Sidebar />
                </div>
                <div class="box2">
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
                        <h2>Top Creators</h2>
                        <div class="row">
                            <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile-placeholder.svg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile-placeholder.svg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        </div>
                        <div className="row">
                            <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile-placeholder.svg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile-placeholder.svg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        </div>
                        <div className="row">
                            <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile-placeholder.svg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile-placeholder.svg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        </div>
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
});
  
  export default connect(mapStateToProps, { fetchFollowingPosts, loadPage })(withStyles(useStyles)(withRouter(FollowingPosts)));

//   export default connect(mapStateToProps, { loadPage })(withStyles(useStyles)(withRouter(Home)));
