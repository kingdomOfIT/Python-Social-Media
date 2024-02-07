import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import EditModal from './editModal';
import DeleteModal from './deleteModal';
import commentModal from "./comments/commentModal";
import { useDispatch, useSelector } from 'react-redux';
import { createFollow, deleteFollow, getFollowingUsers } from '../actions/follow_action'; 

const styles = theme => ({
  list: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  listItem: {
    textAlign: "center"
  }
});

function ResponsiveDialog(props) {
  const { classes, post, userId } = props;
  const { following_posts_reducer } = props;
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalPostTitle, setModalPostTitle] = useState("");
  const [modalPostId, setModalPostId] = useState("");
  const dispatch = useDispatch();
  const followingList = following_posts_reducer.following;

  useEffect(() => {
    dispatch(getFollowingUsers({ userId }));
  }, [dispatch, userId]);

  const handleModal = () => {
    setOpen(false);
  }

  const handleModalClose = () => {
    setEditModalOpen(false);
    setModalOpen(false);
  };
  
  const onOpenModal = () => {
    setEditModalOpen(true);
    setOpen(false);
  };

  const onDeletePost = (postTitle, postId) => {
    setModalOpen(true);
    setModalPostTitle(postTitle);
    setModalPostId(postId);
    setOpen(false);
  };

  const onEditPost = (postContent, postTitle, postId) => {
    setEditModalOpen(true);
    setModalPostTitle(postTitle);
    setModalPostContent(postContent);
    setModalPostId(postId);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFollow = () => {
    if (isFollowing(post.owner.id)) {
      dispatch(deleteFollow(userId, post.owner.id));
      handleClose();
      window.location.reload()
    } else {
      dispatch(createFollow({ targetUser: post.owner.id }));
      handleClose();
      window.location.reload()
    }
  };

  const isFollowing = (targetUserId) => {
    if (followingList) {
      for (let i = 0; i < followingList.length; i++) {
        if (followingList[i].id === targetUserId) {
          return true;
        }
      }
    }
    return false;
  };

  if (post.owner.id === userId) {
    return (
      <div>
        <IconButton onClick={handleClickOpen}>
          <ExpandMoreIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <List className={classes.list}>
              <ListItem button className={classes.listItem} onClick={onOpenModal}>
                <ListItemIcon disableRipple>
                  <FlagOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Update Post" />
              </ListItem>{" "}
              <ListItem button className={classes.listItem} onClick={(e) => onDeletePost(post.title ,post.id)}>
                <ListItemIcon disableRipple>
                  <VolumeOffOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Delete Post" />
              </ListItem>{" "}
            </List>
          </DialogContent>
        </Dialog>
        <EditModal
          open={editModalOpen}
          handleClose={handleModalClose}
          postTitle={post.title}
          postContent={post.content}
          postId={post.id}
        />
        <DeleteModal
          open={modalOpen}
          handleClose={handleModalClose}
          postTitle={modalPostTitle} 
          postId={modalPostId}
          />
      </div>
    );
  } else {
    return (
      <div>
        <IconButton onClick={handleClickOpen}>
          <ExpandMoreIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <List className={classes.list}>
            <ListItem button className={classes.listItem} onClick={handleFollow}>
              <ListItemIcon disableRipple>
                {isFollowing(post.owner.id) ? (
                  <VolumeOffOutlinedIcon />
                ) : (
                  <PersonAddOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={isFollowing(post.owner.id) ? "Unfollow @" + post.owner.username : "Follow @" + post.owner.username} />
            </ListItem>
              <Divider />
              <ListItem button className={classes.listItem} onClick={handleClose}>
                <ListItemIcon disableRipple>
                  <VolumeOffOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Mute @" + post.owner.username} />
              </ListItem>
              <Divider />
              <ListItem button className={classes.listItem} onClick={handleClose}>
                <ListItemIcon disableRipple>
                  <FlagOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Report Post" />
              </ListItem>{" "}
            </List>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  following_posts_reducer: state.following_posts_reducer,
});

export default withStyles(styles)((connect(mapStateToProps)(ResponsiveDialog)));
