// External Libraries
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";

// Material-UI Components
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

// Internal Components
import CommentButton from "./comments/commentButton.js";
import CommentModal from './comments/commentModal';
import Likes from './likePost.js';
import ResponsiveDialog from "./responsiveDialog.js";
import Saves from './savePost.js';

// CSS
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
    commentModalOpen: false,
    modalPostTitle: '',
    modalPostId: '',
    modalPostContent: '',
    progress: false,
    selectedUser: null,
});

const {modalPostId,commentModalOpen} = state;

const classes = useStyles();
const history = useHistory();
const location = useLocation();
const currentPath = location.pathname

const onOpenComments = (postId) => {
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
        commentModalOpen : false
    }));
}


const getUserInfo = (userId) => {

    history.push(`/user-info?user_id=${userId}`);
}

return posts.map((post) => {
    const createdAt = moment(post.createdAt).format('DD/MM/YYYY, HH:mm');
    const ownerImagePath = post.owner.profile ? post.owner.profile.image_url : "https://picsum.photos/200";
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
        <Card key={post.id} className={classes.card} raised style={{ backgroundColor:"#1c1c1c", color:"white", marginTop:"10px", borderRadius:"20px"}}>
            <Grid container direction="column">
                <Grid item>
                    <CardHeader
                    className={classes.header}
                    disableTypography
                    avatar={<Avatar aria-label="Profile Photo" src={ownerImagePath} style={{cursor: "pointer"}} onClick={() => getUserInfo(post.owner.id)}/>}
                    style={{ padding: '16px 16px 10px 16px'}}
                    title={
                    <div>
                        <Typography
                            className="ownerName"
                            variant="subtitle1"
                            display="inline"
                        >
                        {post.owner.first_name} {post.owner.last_name} 
                        </Typography>
                        <Typography variant="subtitle1" style={{color:"#eafb36", fontSize:"14px"}}>
                            <p><PostTime postDate={createdAt} /></p>
                        </Typography>
                    </div>
                    }
                    action={
                        <ResponsiveDialog post={post} userId={userID}/>
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
                        <Saves
                            post = {post}
                            userId = {userID}
                        />
                        </Grid>
                    </Grid>
                    </CardActions>
                </Grid>
            </Grid>
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
