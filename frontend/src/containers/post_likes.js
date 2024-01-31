import React from "react"
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Typography from "@material-ui/core/Typography";



import { makeLike, updateLike, deleteLike } from '../actions/index'

const useStyles = makeStyles(theme => ({
        icon : {
            cursor : "pointer"
        }
    })
)

function Likes({ post, userId, makeLike, updateLike, deleteLike }){

    const classes = useStyles()

    // check if the user have like on this post 
    const like = post.likes.find((like) => userId === like.owner)
    console.log("Ovo post: ", post)

    const makeLike2 = (like) => {
        const values = {
            post : post.id,
            like
        }
        makeLike(values)
    }

    const updateLike2 = (likeType) => {
        const values = {
            like: likeType,
        }
        updateLike(values,like.id)
    }

    return (
        <div> 
        { like &&
            <div>
                {like.like && 
                <>
                    <IconButton
                        disableFocusRipple
                        disableRipple
                        color="inherit"
                        className={classes.icon}
                        onClick={() => deleteLike(like.id)}
                    >
                        {like ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        {like ? (
                        <Typography className={`${classes.number} ${classes.optional}`}>
                            {post.likes_count}
                        </Typography>
                        ) : ( <Typography className={classes.number}>{count}</Typography> ) }
                    </IconButton>
                </>
                
                }

                {!like.like &&
                <>
                <IconButton
                    disableFocusRipple
                    disableRipple
                    color="inherit"
                    className={classes.icon}
                    onClick={() => updateLike2(true)}
                >
                    {like ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    {like ? (
                    <Typography className={`${classes.number} ${classes.optional}`}>
                        {post.likes_count}
                    </Typography>
                    ) : ( <Typography className={classes.number}>{post.likes_count}</Typography> ) }
                </IconButton>
            </>
                
                }
            </div>    
        }
        {!like &&
            <>
            <IconButton
                disableFocusRipple
                disableRipple
                color="inherit"
                className={classes.icon}
                onClick={() => makeLike2(true)}
            >
                {like ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                {like ? (
                <Typography className={`${classes.number} ${classes.optional}`}>
                    {post.likes_count}
                </Typography>
                ) : ( <Typography className={classes.number}>{post.likes_count}</Typography> ) }
            </IconButton>
        </>
        } 
        </div>
    )
}

export default connect(null, { makeLike, updateLike, deleteLike})(Likes)