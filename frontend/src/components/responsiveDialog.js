import React, { useState } from "react";
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

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalPostTitle, setModalPostTitle] = useState("");
  const [modalPostContent, setModalPostContent] = useState("");
  const [modalPostId, setModalPostId] = useState("");

  const handleModalClose = () => {
    setEditModalOpen(false);
  };
  
  const onOpenModal = () => {
    setEditModalOpen(true);
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
              <ListItem button className={classes.listItem} onClick={handleClose}>
                <ListItemIcon disableRipple>
                  <PersonAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Follow @" + post.owner.username} />
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

export default withStyles(styles)(ResponsiveDialog);
