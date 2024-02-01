import React from "react";
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

function Save({ post, userId, savePost, deleteSave }) {
    const classes = useStyles();

    const isSaved = post.saves.some(save => userId === save.owner);

    const performeSave = () => {
        const values = {
            post: post.id,
            save: true
        };
        savePost(values);
    };

    const performeDelete = () => {
        // Assuming you have a way to get the ID of the saved post
        const saveId = post.saves.find(save => userId === save.owner).id;
        deleteSave(saveId);
    };

    return (
        <div>
            <IconButton
                disableFocusRipple
                disableRipple
                color="inherit"
                className={classes.icon}
                onClick={isSaved ? performeDelete : performeSave}
            >
                {isSaved ? <BookmarkBorderRoundedIcon color="error" /> : <BookmarkRoundedIcon />}
            </IconButton>
        </div>
    );
}

export default connect(null, { savePost, deleteSave })(Save);
