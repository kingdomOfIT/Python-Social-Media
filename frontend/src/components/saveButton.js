import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { ListItemText } from "@material-ui/core/ListItemText";
import BookmarkBorderRoundedIcon from "@material-ui/icons/BookmarkBorderRounded";
import { Share, Link } from "react-feather";


function ShareButton() {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        disableFocusRipple
        disableRipple
        color="inherit"
        onClick={handleClickOpen}
      >
        <Share />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <List>

            <Divider />
            <ListItem button onClick={handleClose}>
              <ListItemIcon>
                <BookmarkBorderRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Save Post" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleClose}>
              <ListItemIcon>
                <Link />
              </ListItemIcon>
              <ListItemText primary="Copy link to post" />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default ShareButton;