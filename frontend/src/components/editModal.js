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
      backgroundColor: '#1c1c1c',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      color: '#ccc',
      textAlign: 'center',
    },
    title: {
      padding: '1rem 0',
      marginBottom: '1.5rem',
      color: 'white'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    textFieldLabel: {
      color: '#ffffff', // Set label text color to white
    },
    textFieldInput: {
        color: '#ffffff', // Set input text color to white
        borderBottom: '2px solid white'
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
    yellowButton: {
        backgroundColor: '#eafb36',
        color: 'black',
        '&:hover': {
          color: "#eafb36",
          backgroundColor: "transparent"
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
                {console.log("samo <3")}
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
                            InputLabelProps={{
                              className: classes.textFieldLabel // Add this class for label color
                            }}
                            InputProps={{
                                className: classes.textFieldInput // Add this class for input color
                            }}
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
                            InputLabelProps={{
                              className: classes.textFieldLabel // Add this class for label color
                            }}
                            InputProps={{
                                className: classes.textFieldInput // Add this class for input color
                            }}
                            className={classes.textField}
                        />
                        <div className={classes.btnDiv}>
                            <Button className={`${classes.button} ${classes.yellowButton}`} onClick={onCloseModal} variant="contained">
                                Cancel
                            </Button>
                            <Button type='submit' variant="contained" color="primary" className={`${classes.button} ${classes.yellowButton}`}>
                                Update
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