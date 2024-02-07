import React, { Component, useState, useEffect } from 'react'
import moment from "moment"
import { connect } from 'react-redux'
import _ from "lodash"
import { withStyles } from '@material-ui/styles';
import "react-image-crop/dist/ReactCrop.css";
import { withRouter } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { fetchFollowingPosts } from '../actions/follow_action.js'
import '../../static/frontend/mystyle.css';
import EditModal from '../components/editModal'
import CommentModal from '../components/comments/commentModal'

import CommentButton from "../components/comments/commentButton.js";
import ResponsiveDialog from "../components/responsiveDialog.js";

import Card from '@material-ui/core/Card';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Likes from './post_likes'
import { savePost } from '../actions/index.js';
const styles = {
    card: {
        backgroundColor: '#19002f',
        color: 'white',
    },
};


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
            const followingPosts = this.props.fetchFollowingPosts(userId);
            console.log("Following posts: ", followingPosts);
        }
    }

    render() {
        const {
            editModalOpen, 
            modalPostTitle,
            modalPostId, 
            modalPostContent, 
            commentModalOpen, 
        } = this.state

        // Sort posts by posting date in descending order
        // userPostsReducer = userPostsReducer.sort((a, b) => {
        //     return new Date(b.p_date) - new Date(a.p_date);
        // });

        return (
            <Container style={{ paddingTop: '80px', align:"center"}}>
                <div align="center">
                    <h1>Following Posts</h1>
                </div>
                <div className="posts">
                        {this.renderPosts()}
                </div>

                {/* <CommentModal
                    open={commentModalOpen}
                    handleClose={this.handleModalClose}
                    postId={modalPostId}
                /> */}
                </Container>
          );
        };

    renderPosts(){
        const { classes } = this.props
        const { following_posts_reducer } = this.props;
        // console.log("AuthRed User: ", this.props.authReducer.user)

        console.log("Post: ", following_posts_reducer.follows)
        // console.log("SAVED POST: ", user_saved_posts_reducer.savedPosts)

        return following_posts_reducer.follows.map(post => {
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
                <Card className={classes.card} raised style={{ backgroundColor:"#19002f", color:"white", marginBottom: "10px"}}>
                    <Grid container direction="column">
                        <Grid item>
                            <CardHeader
                            className={classes.header}
                            disableTypography
                            avatar={<Avatar aria-label="Profile Photo" src={post.owner.profile.image_path} onClick={() => this.getUserInfo(post.owner.id)}/>}
                            style={{ padding: '16px 16px 10px 16px' }}
                            title={
                                <div>
                                <Typography
                                    className="ownerName"
                                    variant="title"
                                    display="inline"
                                >
                                {post.owner.first_name} {post.owner.last_name}
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
                                <ResponsiveDialog post={post} userId={this.props.authReducer.user.id}/>
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
                            > {post.title}
                            </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item>
                            <CardContent className={classes.content} style={{ paddingBottom: '5px' }}>
                            <Typography
                                variant="body2"
                                gutterBottom
                                className={classes.paragraph}
                            > {post.content}  
                            </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item>
                            <CardActions className={classes.actions}>
                            <Grid container justify="space-around" wrap="nowrap">
                                <Likes
                                post = {post}
                                userId = {this.props.authReducer.user.id}
                                />
                                <Grid item>
                                <CommentButton 
                                    post = {post}
                                    className={classes.icons} 
                                    onClick={() => this.onOpenComments(post.id)}
                                />
                                </Grid>
                            </Grid>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
            )
        })
    }

    onOpenComments = (postId) => {
        this.setState({
            commentModalOpen: true, modalPostId: postId
        })
    }

    handleModalClose = () => {
        this.setState({ modalOpen: false, editModalOpen: false, commentModalOpen : false })
    }
}

const mapStateToProps = (state) => ({
    authReducer: state.authReducer,
    following_posts_reducer: state.following_posts_reducer || { posts: [] },
});
  
  export default withStyles(styles)(withRouter(connect(mapStateToProps, { fetchFollowingPosts })(FollowingPosts)));
