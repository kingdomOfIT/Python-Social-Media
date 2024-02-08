import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import moment from "moment"
import CommentButton from "./comments/commentButton.js";
import ResponsiveDialog from "./responsiveDialog.js";

import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core'

import DeleteModal from './deleteModal.js'
import EditModal from './editModal'
import CommentModal from './comments/commentModal'
import Likes from '../containers/post_likes'
import Save from '../containers/save_post.js'
import '../../static/frontend/mystyle.css';

const Post = ({
  posts,
  userID
}) => {

const useStyles = theme  =>  ({
    avatar: {
        margin: 10,
        width : 80,
        height : 80,
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

const [state, setState] = useState({
    modalOpen: false,
    editModalOpen: false,
    commentModalOpen: false,
    modalPostTitle: '',
    modalPostId: '',
    modalPostContent: '',
    progress: false,
    userInfoOpen: false,
    selectedUser: null,
});

const { modalOpen, editModalOpen, modalPostTitle, progress, selectedUser,
    modalPostId, modalPostContent, commentModalOpen, userInfoOpen} = state;

const classes = useStyles();
const history = useHistory();

const onOpenComments = (postId) => {
    console.log("Okinut")
    setState(prevState => ({
        ...prevState,
        commentModalOpen: true,
        modalPostId: postId
    }));
}

const handleModalClose = () => {
    setState(prevState => ({
        ...prevState,
        modalOpen: false,
        editModalOpen: false,
        commentModalOpen : false
    }));
}

const onDeletePost = (postTitle ,postId) => {
    setState(prevState => ({
        ...prevState,
        modalOpen: true,
        modalPostTitle: postTitle,
        modalPostId: postId
    }));
}

const onEditePost = (postContent, postTitle, postId) => {
    setState(prevState => ({
        ...prevState,
        editModalOpen: true,
        modalPostTitle: postTitle,
        modalPostId: postId,
        modalPostContent: postContent
    }));
}

const getUserInfo = (userId) => {

    history.push(`/user-info?user_id=${userId}`);
}

console.log("Ovo mapiram: ", posts)
return posts.map((post) => {
    const p_date = moment(post.p_date).format('DD/MM/YYYY, HH:mm');
    const ownerImagePath = post.owner.profile ? post.owner.profile.image_path : "https://picsum.photos/200";
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
        <Card className={classes.card} raised style={{ backgroundColor:"#19002f", color:"white", marginTop:"10px"}}>
            <Grid container direction="column">
                <Grid item>
                    <CardHeader
                    className={classes.header}
                    disableTypography
                    avatar={<Avatar aria-label="Profile Photo" src={ownerImagePath} onClick={() => getUserInfo(post.owner.id)}/>}
                    style={{ padding: '16px 16px 10px 16px' }}
                    title={
                        <div>
                        <Typography
                            className="ownerName"
                            variant="h6"
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
                        <ResponsiveDialog post={post} userId={userID}/>
                        </IconButton>
                    }
                    />
                </Grid>
                <Grid item>
                    <CardContent className= "postTitle" style={{ paddingBottom: '5px' }}>
                    <Typography
                        variant="h5"
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
                    <Grid container justifyContent="space-around" wrap="nowrap">
                        <Likes
                        post = {post}
                        userId = {userID}
                        />
                        <Grid item>
                        <CommentButton 
                            post = {post}
                            className={classes.icons} 
                            onClick={() => onOpenComments(post.id)}
                        />
                        </Grid>
                        <Grid item>
                        <Save
                            post = {post}
                            userId = {userID}
                        />
                        </Grid>
                    </Grid>
                    </CardActions>
                </Grid>
            </Grid>
            <DeleteModal
                open={modalOpen}
                handleClose={handleModalClose}
                postTitle={modalPostTitle} 
                postId={modalPostId}
            />

            <EditModal
                open={editModalOpen}
                handleClose={handleModalClose}
                postTitle={modalPostTitle}
                postContent = {modalPostContent}
                postId={modalPostId}
            />

            <CommentModal
                open={commentModalOpen}
                handleClose={handleModalClose}
                postId={modalPostId}
            />
        </Card>
        
    )
})

}

export default Post;
