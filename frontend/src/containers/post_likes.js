import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Typography from "@material-ui/core/Typography";
import { makeLike, deleteLike } from '../actions/index';

const useStyles = makeStyles(theme => ({
    icon: {
        cursor: "pointer"
    }
}));

function Likes({ post, userId, makeLike, deleteLike }) {
    const classes = useStyles();

    // State to track if the post is liked by the current user
    const [liked, setLiked] = useState(false);

    // Effect to update the liked state when the component mounts or post changes
    useEffect(() => {
        const like = post.likes.find((like) => userId === like.owner);
        if (like) {
            setLiked(like.like);
        } else {
            setLiked(false);
        }
    }, [post, userId]);

    // Function to handle like/unlike action
    const handleLike = () => {
        if (!liked) {
            // If not liked, make a new like
            const values = {
                post: post.id,
                like: true
            };
            makeLike(values);
            setLiked(true); // Update local state
        } else {
            // If liked, find the like ID and delete it
            const like = post.likes.find((like) => userId === like.owner);
            if (like) {
                deleteLike(like.id);
            }
            setLiked(false); // Update local state
        }
    };

    return (
        <IconButton
            disableFocusRipple
            disableRipple
            color="inherit"
            className={classes.icon}
            onClick={handleLike}
        >
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            <Typography className={classes.number}>{post.likes_count}</Typography>
        </IconButton>
    );
}

export default connect(null, { makeLike, deleteLike })(Likes);
