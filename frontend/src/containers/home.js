import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import moment from "moment"
import Sidebar from "../components/sidebar.js";
import ShareButton from "../components/saveButton.js";
import HeartButton from "../components/heartButton.js";
import CommentButton from "../components/comments/commentButton.js";
import ResponsiveDialog from "../components/responsiveDialog.js";
import { Link } from "react-router-dom";
import AddModal from '../components/addModal'

import { Container } from "@material-ui/core"
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from '@material-ui/core/Card';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import DeleteIcon  from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import AnimatePage from "../components/AnimatePage" 
import EditIcon from '@material-ui/icons/Edit';
import DeleteModal from '../components/deleteModal'
import EditModal from '../components/editModal'
import CommentModal from '../components/comments/commentModal'
import Likes from './post_likes'
import { loadPage } from "../actions/posts_action"
import UserInfo from './anyUserInfo'
import '../../static/frontend/mystyle.css';

const useStyles = theme  =>  ({
    avatar: {
        margin: 10,
        width : 80,
        height : 80,
    },
    card : {
        marginTop : 10
    },
    cardHeader : {
        cursor : "pointer",
        width : "max-content"
    },
    cardContent : {
        margin: "0 10px",
        padding : "0 16px !important"  
    },
    cardActionLeft : {
        marginLeft : "auto",
    },
    load : {
        margin : "10px auto",
        width : "max-content"
    }
});

class Home extends Component {

    state = {
        modalOpen : false,
        editModalOpen : false,
        commentModalOpen : false,
        modalPostTitle : '',
        modalPostId : '',
        modalPostContent : '',
        progress : false,
        userInfoOpen : false,
        selectedUser : null,
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
        const { modalOpen, editModalOpen, modalPostTitle, progress, selectedUser,
            modalPostId, modalPostContent, commentModalOpen, userInfoOpen}
        = this.state
        const creatorsData = [
            { id: 1, avatar: 'avatar1.jpg', name: 'John', surname: 'Doe', username: 'john_doe' },
            { id: 2, avatar: 'avatar2.jpg', name: 'Jane', surname: 'Smith', username: 'jane_smith' },
            { id: 3, avatar: 'avatar3.jpg', name: 'Alex', surname: 'Johnson', username: 'alex_j' },
            { id: 4, avatar: 'avatar4.jpg', name: 'Emily', surname: 'Williams', username: 'emily_w' },
            { id: 5, avatar: 'avatar5.jpg', name: 'Michael', surname: 'Brown', username: 'michael_b' },
            { id: 6, avatar: 'avatar6.jpg', name: 'Samantha', surname: 'Davis', username: 'samantha_d' },
          ];

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
                        <Card className={classes.card} raised style={{ backgroundColor:"#19002f", color:"white"}}>
                            <Grid container direction="column">
                            <Grid item>
                            <CardHeader
                                className={classes.header}
                                disableTypography
                                avatar={<Avatar aria-label="Profile Photo" />}
                                style={{ 
                                    padding: '16px 16px 16px 16px', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center' 
                                }}
                                title={
                                    <div>
                                    <TextField
                                        id="standard-basic"
                                        placeholder='Your amazing story is starting just here...'
                                        variant="standard"
                                        className='create-post-text'
                                        InputProps={{
                                            style: {
                                            color: 'white',
                                            backgroundColor: 'transparent',
                                            borderColor: 'white',
                                            border: '1px solid white',
                                            borderRadius: '15px',
                                            width: '100%',
                                            marginBottom: '15px',
                                            paddingLeft: '10px'
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: {
                                            color: 'white',
                                            fontSize: '20px'
                                            },
                                        }}
                                        onClick={this.onOpenModal}
                                    />
                                    <AddModal open={this.state.open} onClose={this.handleModal} />
                                    </div>
                                    
                                }
                            />
                            </Grid>
                            </Grid>
                        </Card>
                    </div>
                <div className={classes.pc}>
                    <UserInfo open={userInfoOpen} close={this.closeUserInfo} user={selectedUser}/>
                    <DeleteModal
                    open={modalOpen}
                    handleClose={this.handleModalClose}
                    postTitle={modalPostTitle} 
                    postId={modalPostId}
                    />

                    <EditModal
                    open={editModalOpen}
                    handleClose={this.handleModalClose}
                    postTitle={modalPostTitle}
                    postContent = {modalPostContent}
                    postId={modalPostId}
                    />

                    <CommentModal
                        open={commentModalOpen}
                        handleClose={this.handleModalClose}
                        postId={modalPostId}
                    />

                    {this.props.posts.posts && <AnimatePage />}
                    <Container maxWidth="lg">
                        {this.renderPosts()}
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
    }

    renderPosts(){
        const { classes } = this.props

        // that's because postsReducer has an object
        // and userpostsReducer has an array 
        const posts = this.props.posts.posts ? this.props.posts.posts : this.props.posts
        return posts.map((post) => {
            const u_date = moment(post.u_date).format("DD/MM/YYYY, HH:mm")
            const p_date = moment(post.p_date).format('DD/MM/YYYY, HH:mm');
            const PostTime = ({ postDate }) => {
                const [timeAgo, setTimeAgo] = useState('');
              
                useEffect(() => {
                  const calculateTimeAgo = () => {
                    const currentDate = moment();
                    const postCreationDate = moment(postDate, 'DD/MM/YYYY, HH:mm');
                    const duration = moment.duration(currentDate.diff(postCreationDate));
                    
                    if (duration.asDays() > 5) {
                      // If created more than 5 days ago, display full date
                      setTimeAgo(postCreationDate.format('DD/MM/YYYY'));
                    } else if (duration.asHours() >= 24) {
                      // If created more than 24 hours ago, display days ago
                      setTimeAgo(`${Math.floor(duration.asDays())} days ago`);
                    } else if (duration.asMinutes() >= 60) {
                      // If created more than 60 minutes ago, display hours ago
                      setTimeAgo(`${Math.floor(duration.asHours())} hours ago`);
                    } else if (duration.asMinutes() < 1) {
                        
                        setTimeAgo(`Just Now`);
                    } else {
                      // If created less than an hour ago, display minutes ago
                      setTimeAgo(`${Math.floor(duration.asMinutes())} minutes ago`);
                    } 
                  };
              
                  calculateTimeAgo();
                }, [postDate]);
              
                return <span>{timeAgo}</span>;
              };
            return (
                <Card className={classes.card} raised style={{ backgroundColor:"#19002f", color:"white"}}>
                    <Grid container direction="column">
                        <Grid item>
                            <CardHeader
                            className={classes.header}
                            disableTypography
                            avatar={<Avatar aria-label="Profile Photo" src={post.owner.profile.image_path} />}
                            style={{ padding: '16px 16px 10px 16px' }}
                            title={
                                <div>
                                <Typography
                                    className="ownerName"
                                    variant="title"
                                    display="inline"
                                >
                                    Amir Kahriman
                                </Typography>
                                <Typography variant="subtitle1" style={{color:"#808080", fontSize:"16px"}}>
                                    <p><PostTime postDate={p_date} /></p>
                                </Typography>
                            </div>
                            }
                            action={
                                <IconButton
                                aria-label="settings"
                                disableRipple
                                disableTouchRipple
                                style={{ color: 'white' }}
                                >
                                <ResponsiveDialog />
                                </IconButton>
                            }
                            />
                        </Grid>
                        <Grid item>
                            <CardContent className= "postTitle" style={{ paddingBottom: '5px' }}>
                            <Typography
                                variant="title1"
                                gutterBottom
                                className={classes.title}
                            > This is some long title
                            </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item>
                            <CardContent className={classes.content} style={{ paddingBottom: '5px' }}>
                            <Typography
                                variant="body2"
                                gutterBottom
                                className={classes.paragraph}
                            > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.  
                            </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item>
                            <CardActions className={classes.actions}>
                            <Grid container justify="space-around" wrap="nowrap">
                                <Grid item>
                                <HeartButton className={classes.icons} />
                                </Grid>
                                <Grid item>
                                <CommentButton className={classes.icons} />
                                </Grid>
                                <Grid item>
                                <ShareButton className={classes.icons} />
                                </Grid>
                            </Grid>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
            )
        })
    }

    renderOwnerBtn(post){
        if ( this.props.authReducer.user.id == post.owner.id){
            return (
                <div>
                    <Fab style= {{ marginRight : 5 }}
                    color="primary" size="small" aria-label="edit"
                    onClick={(e) => this.onEditePost(post.content ,post.title, post.id)}
                    >
                        <EditIcon />
                    </Fab>
                    <Fab onClick={(e) => this.onDeletePost(post.title ,post.id)} color="secondary" size="small" aria-label="delete">
                        <DeleteIcon />
                    </Fab>
                </div>
            )
        } else {
            return <div></div>
        }

    }

    handleModalClose = () => {
        this.setState({ modalOpen: false, editModalOpen: false, commentModalOpen : false })
    }

    onDeletePost = (postTitle ,postId) => {
        this.setState({
            modalOpen: true, modalPostTitle: postTitle, modalPostId: postId
        })
    }

    onEditePost = (postContent, postTitle, postId) => {
        this.setState({
            editModalOpen: true, modalPostTitle: postTitle, modalPostId: postId, modalPostContent: postContent
        })
    }

    onOpenComments = (postId) => {
        this.setState({
            commentModalOpen: true, modalPostId: postId
        })
    }

    loadPageClicked = () => {
        const { loadPage } = this.props

        this.setState({ progress: true })
        loadPage( () => {
            this.setState({progress : false})
        })
    }

    closeUserInfo = () => {
        this.setState({ userInfoOpen : false })
    }

    getUserInfo = (post) => {
        this.setState({ selectedUser: post.owner } , () => {
            // after the slectedUser state Chaged then
            // Mount the user info component
            this.setState({ userInfoOpen: true,})
        })
    }
}

const mapStateToProps = (state) => {
    return { authReducer : state.authReducer }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { loadPage})(withStyles(useStyles)(Home))