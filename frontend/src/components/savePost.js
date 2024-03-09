import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import BookmarkBorderRoundedIcon from "@material-ui/icons/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@material-ui/icons/BookmarkBorderRounded";

import { savePost, deleteSave } from '../actions/index';

const useStyles = makeStyles(theme => ({
    icon: {
        cursor: "pointer"
    }
}));

function Saves({ post, userId, savePost, deleteSave }) {
    const classes = useStyles();

    // State to track if the post is saved by the current user
    const [isSaved, setIsSaved] = useState(false);

    // Effect to update the isSaved state when the component mounts or post changes
    useEffect(() => {
        const savedPost = post.saves.find(save => userId === save.owner);
        setIsSaved(!!savedPost); // Convert savedPost to boolean
    }, [post, userId]);

    // Function to handle save/unsave action
    const handleSave = () => {
        if (!isSaved) {
            // If not saved, save the post
            const values = {
                post: post.id,
                save: true
            };
            savePost(values);
            setIsSaved(true); // Update local state
        } else {
            // If saved, find the save ID and delete it
            const savedPost = post.saves.find(save => userId === save.owner);
            if (savedPost) {
                deleteSave(savedPost.id);
            }
            setIsSaved(false); // Update local state
        }
    };

    return (
        <div>
            <IconButton
                disableFocusRipple
                disableRipple
                color="inherit"
                className={classes.icon}
                onClick={handleSave}
            >
                {isSaved ? <BookmarkBorderRoundedIcon color="error" /> : <BookmarkRoundedIcon />}
            </IconButton>
        </div>
    );
}

export default connect(null, { savePost, deleteSave })(Saves);
