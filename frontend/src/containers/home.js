import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Sidebar from "../components/sidebar.js";
import AddModal from '../components/addModal'

import { Container } from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import AnimatePage from "../components/AnimatePage" 
import Post from '../components/posts.js'
import { loadPage } from "../actions/posts_action"
import '../../static/frontend/mystyle.css';

import { withRouter } from 'react-router-dom';


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

    render() {
        const { classes, loadPosts} = this.props
        const { nextPage } = this.props.posts
        const { progress} = this.state
        const posts = this.props.posts.posts ? this.props.posts.posts : this.props.posts;
        const userID = this.props.authReducer.user.id;
        
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
                        <div class="row">
                            <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile_1.jpg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile_2.jpg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        </div>
                        <div className="row">
                            <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile_3.jpg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile_4.jpg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        </div>
                        <div className="row">
                            <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile_5.jpg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        <div className="card-container">
                            <img className="round" src={"../../static/frontend/profile_6.jpg"} alt="user" />
                            <h3>Amir Kahriman</h3>
                            <h6>@amirkahriman</h6>
                        </div>
                        </div>
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
}

const mapStateToProps = (state) => {
    return { authReducer : state.authReducer }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { loadPage })(withStyles(useStyles)(withRouter(Home)));