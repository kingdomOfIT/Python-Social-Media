import React , { useState } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import { addPost } from '../actions/posts_action'


const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vmin',
      backgroundColor: '#1c1c1c',
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
  

function AddModal({ open, onClose, addPost }){

    const classes = useStyles();

    const [ values , setValues ] = useState({
        title : '',
        content : ''
    })

    // state to control the progress waiting component
    const [progress, setProgress] = useState(false)

    const onInputChange = (e) => {
        setValues({...values , [e.target.name]: e.target.value })
    }

    const onClose2 = (e) => {
        setValues({title : '' , content : ''})
    }

    const onBtnClicked = (e) => {
        e.preventDefault()
        setProgress(true)
        addPost(values , () => {
            onClose();
            onClose2();
            setProgress(false)
        })
    }
    return (
        <div>
          <Modal
            aria-labelledby="title"
            aria-describedby="description"
            open={open}
            onClose={() => {
              onClose();
              onClose2();
            }}
          >
            <div className={classes.paper}>
              <h2 className={classes.title} id="title">
                Crate a new Post
              </h2>
              <form className={classes.form} onSubmit={onBtnClicked}>
                <TextField
                  required
                  className={classes.textField}
                  label="Title"
                  type="text"
                  value={values.title}
                  onChange={onInputChange}
                  name="title"
                  fullWidth
                />
                <TextField
                  required
                  className={classes.textField}
                  name="content"
                  label="Content"
                  value={values.content}
                  onChange={onInputChange}
                  margin="normal"
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                  CREATE 
                  <Icon className={classes.rightIcon}>send</Icon>
                </Button>
                <CircularProgress
                  className={classes.circularProgress}
                  style={progress ? {} : { display: 'none' }}
                />
              </form>
            </div>
          </Modal>
        </div>
      );
}

export default connect(null ,{ addPost })(AddModal)