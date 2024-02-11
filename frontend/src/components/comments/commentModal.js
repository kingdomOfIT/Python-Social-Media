import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import { addComment , getComments } from '../../actions/posts_action'
import CommentsList from './CommentsList'


const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform : "translate(-50% ,-50%)",
        width: "95vmin",
        maxHeight : "50%",
        overflowY: 'scroll',
        backgroundColor: "#1c1c1c",
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        color: "#ccc",

    },
    h2: {
        color: "#102016",
        padding: "1rem 0",
        marginBottom: "1.5rem",
        borderBottom: "2px solid white",
        textAlign: "center",
    },
    yellowButton: {
        backgroundColor: '#eafb36',
        color: 'black',
        '&:hover': {
          color: "#eafb36",
          backgroundColor: "transparent"
        },
    },

    textField: {
        margin: '1rem 0',
        '& input': {
          color: '#ffffff'
        },
        '& label': {
          color: '#ffffff',
        },
        '&::placeholder': {
          color: '#ffffff',
        },
    },
  
    button: {
      maxHeight: "30px",
      marginLeft: "10px",
      border: "1px solid #eafb36",
      borderRadius: "12px",
      cursor: "pointer",
      backgroundColor:"#eafb36",
      color: "#0e0e0e",
      textAlign: "center",
      justifyContent: "center"
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    cancel: {
        marginRight: "5px",
    },
    btnDiv: {
        textAlign: "end",
    },
    form: {
        marginTop: 10,
        '& .MuiInputBase-root': {
            color: 'white',
            borderBottom: '1px solid white',
        },
        '& .MuiFormLabel-root': {
            color: 'white',
        },
    },
}));

function CommentModal({open, handleClose, postId, addComment, getComments , comments })
{   
    const classes = useStyles();
    const [values, setValues] = useState({
        content: ""
    })

    const [progress, setProgress] = useState(false)
    const [progress2, setProgress2] = useState(true)
    useEffect(() => {
        if (open) {
            getComments(postId, () => setProgress2(false))
        }
    } ,[open])

    const onInputChange = (e) => {
        setValues({ [e.target.name]: e.target.value })
    }

    const onFormSubmit = (e) => {
        e.preventDefault()
        setProgress(true)
        addComment({...values, post : postId}, () => {
            setProgress(false)
            setValues({ content: "" })
        })
    }

    const onCloseModal = () => {
        handleClose();
        setValues({ content: "" })
        setProgress2(true)
    }

    return (
        <div>
            <Modal
                aria-labelledby="title"
                aria-describedby="description"
                open={open}
                onClose={onCloseModal}
            >
                <div className={classes.paper}>
                    {console.log("second")}
                    <form className={classes.form} id="description" onSubmit = {onFormSubmit}>
                        <TextField
                            required
                            label="Write a comment"
                            type="text"
                            value={values.content}
                            onChange={onInputChange}
                            name='content'
                            fullWidth={true}
                            maxRows="4"
                            multiline = {true}
                            className={classes.textField}
                        />
                        <div className={classes.btnDiv}>
                            <Button className={`${classes.button} ${classes.yellowButton}`}  onClick={onCloseModal} variant="contained">
                                Cancel
                            </Button>
                            <Button type='submit' variant="contained" color="primary"
                                className={`${classes.button} ${classes.yellowButton}`} >
                                Comment
                            </Button>
                            <CircularProgress style={progress ? { display: "inline-block" } : { display: "none" }} />
                        </div>
                    </form>
                    <CommentsList progress = {progress2} comments = {comments} />
                </div>
            </Modal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({ comments : state.commentsReducer })
}

export default connect(mapStateToProps, { addComment, getComments })(CommentModal)