import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress';

import { deletePost } from '../actions/posts_action'

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
      color: 'white',
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

  function DeleteModal({ open, handleClose, postTitle, postId, deletePost }) {
    const classes = useStyles();
    
    const [progress, setProgress] = useState(false);

    const cancelDelete = () => {
        handleClose();
    };

    const onDeleteClicked = () => {
        setProgress(true);
        deletePost(postId, () => {
            setProgress(false);
            handleClose();
        });
    };

    return (
        <div>
          <Modal
            aria-labelledby="title"
            aria-describedby="description"
            open={open}
          >
            <div className={classes.paper}>
              <h2 className={classes.title} id="title">
                Please confirm your action
              </h2>
              <Button variant="contained" color="primary" className={classes.button} onClick={onDeleteClicked}>
                Delete
              </Button>
              <Button variant="contained" color="primary" className={classes.button} onClick={cancelDelete}>
                Cancel
              </Button>
              <CircularProgress
                className={classes.circularProgress}
                style={progress ? {} : { display: 'none' }}
              />
            </div>
          </Modal>
        </div>
    );
}

export default connect(null, { deletePost })(DeleteModal);
