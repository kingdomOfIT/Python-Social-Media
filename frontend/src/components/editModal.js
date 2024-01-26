import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import { editPost } from '../actions/posts_action'


const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vmin',
      backgroundColor: '#19002f',
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      color: '#ccc',
      textAlign: 'center',
    },
    title: {
      padding: '1rem 0',
      marginBottom: '1.5rem',
      borderBottom: '2px solid white',
      color: 'white'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    textField: {
        margin: '1rem 0',
        '& input': {
          color: 'white',
          borderBottom: '2px solid white'
        },
        '& label': {
          color: 'white',
        },
        '&::placeholder': {
          color: 'white',
        },
    },
    button: {
      margin: theme.spacing(2),
      color: 'white',
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
      color: 'white', // Set text color to white
    },
    circularProgress: {
      display: 'inline-block',
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  }));

function EditModal({ open, handleClose, postTitle, postContent, postId, editPost }) {

    const classes = useStyles();
    const [values, setValues] = useState({
        title: postTitle,
        content: postContent
    })
    
    // state to control the progress waiting component
    const [progress , setProgress] = useState(false)

    // change the state each time the component rerender
    useEffect(() => {
        setValues({
            title: postTitle, content: postContent
        })
    }, [postTitle, postContent]);

    const onInputChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const onFormSubmit = (e) => {
        e.preventDefault()
        setProgress(true)
        editPost(values, postId, () => {
            handleClose();
            setProgress(false)
        })
    }

    const onCloseModal = () => {
        handleClose();
        setValues({ title: postTitle, content: postContent })
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
                    <h2 className={classes.title} id="title">Update your post</h2>
                    <form className={classes.form} id="description" onSubmit={onFormSubmit}>
                        <TextField
                            required
                            label="Title"
                            name='title'
                            type="text"
                            value={values.title}
                            onChange={onInputChange}
                            fullWidth={true}
                            className={classes.textField}
                        />
                        <TextField
                            required
                            label="Content"
                            name='content'
                            multiline={true}
                            value={values.content}
                            onChange={onInputChange}
                            margin="normal"
                            fullWidth={true}
                            className={classes.textField}
                        />
                        <div className={classes.btnDiv}>
                            <Button className={classes.cancel} onClick={onCloseModal} variant="contained">
                                Cancel
                            </Button>
                            <Button type='submit' variant="contained" color="primary" className={classes.button}>
                                Update
                                <Icon className={classes.rightIcon}></Icon>
                            </Button>
                            <CircularProgress style={ progress ? {display : "inline-block"} : {display : "none"}}/>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default connect(null, { editPost })(EditModal)