import React, { useState } from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { updateUserInfo } from "../actions/index"
import { updateUserImage } from "../actions/index"

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: theme.spacing(2),
  },
  optionButton: {
    width: '45%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  profileImage: {
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
}));

function UserProfileMenu({ open, onClose, authReducer, updateUserInfo, updateUserImage }) {

  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState(authReducer.user.first_name);
  const [editedLastName, setEditedLastName] = useState(authReducer.user.last_name);
  const [selectedImage, setSelectedImage] = useState(authReducer.user.profile.image_url);
  const { user } = authReducer
  const [changesMade, setChangesMade] = useState(false);
  // let {authReducer} = this.props;
  const userId = authReducer.user.id;

  const handleFirstNameChange = (e) => {
    setEditedFirstName(e.target.value);
    setChangesMade(true);
  };

  const handleLastNameChange = (e) => {
    setEditedLastName(e.target.value);
    setChangesMade(true);
  };

  const handlePersonalSave = (firstName, lastName) => {

    const updatedUserInfo = {
        first_name: editedFirstName,
        last_name: editedLastName,
        username: authReducer.user.username,
        email: authReducer.user.email,
        sex: authReducer.user.profile.sex
    };


    updateUserInfo(updatedUserInfo, userId, () => {})
    handleCloseDialog()
    // window.location.reload();
  };

  const handleImageChange = (file) => {
    setSelectedImage(file);
  };

  const handleImageSave = () => {

    const form = new FormData()
    form.append('image', selectedImage)

    updateUserImage(form, userId, () => {})

    setChangesMade(false);
    handleCloseDialog()
    // window.location.reload();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleCloseDialog = () => {
    setSelectedOption(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle className={classes.title}>
        {selectedOption ? (
          <Typography variant="subtitle">{selectedOption}</Typography>
        ) : (
          'Edit Your Profile'
        )}
      </DialogTitle>
      <DialogContent className={classes.content}>
        {!selectedOption && (
          <div className={classes.buttonContainer}>
            <Button
              className={classes.optionButton}
              variant="contained"
              color="primary"
              onClick={() => handleOptionClick('Personal Information')}
            >
              Personal Information
            </Button>
            <Button
              className={classes.optionButton}
              variant="contained"
              color="primary"
              onClick={() => handleOptionClick('Profile Picture')}
            >
              Profile Picture
            </Button>
          </div>
        )}

        {selectedOption === 'Personal Information' && (
          <div>
            <TextField
                label="Name"
                fullWidth
                value={editedFirstName}
                onChange={handleFirstNameChange}
                margin="normal"
            />
            <TextField
                label="Surname"
                fullWidth
                value={editedLastName}
                onChange={handleLastNameChange}
                margin="normal"
            />
          </div>
        )}

        {selectedOption === 'Profile Picture' && (
          <div>
            {/* Display current profile picture */}
            <img
              className={classes.profileImage}
              src={authReducer.user.profile.image_url}
              alt="Profile"
            />

            {/* Input for uploading a new profile picture */}
            <input 
                type="file" 
                accept="image/*" 
                className={classes.inputField}
                onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Close
        </Button>
        {selectedOption === 'Personal Information' && (
        <Button variant="contained" color="primary" onClick={() => handlePersonalSave(editedFirstName, editedLastName)}>
            Save
        </Button>
        )}
        {selectedOption === 'Profile Picture' && (
        <Button variant="contained" color="primary" onClick={() => handleImageSave()}>
            Save
        </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};


const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
    };
};

export default connect(mapStateToProps,{updateUserInfo, updateUserImage} )(UserProfileMenu);
