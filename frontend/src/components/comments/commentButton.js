import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { MessageCircle } from "react-feather";
import Typography from "@material-ui/core/Typography";

const styles = {
  icon: {
    marginRight: "35px"
  },
  number: {
    marginLeft: "4px"
  }
};

function CommentButton(props) {
  const { classes, onClick, post } = props;

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <>
      <IconButton
        disableFocusRipple
        disableRipple
        color="inherit"
        className={classes.icon}
        onClick={handleButtonClick}
      >
        <MessageCircle />
        <Typography className={classes.number}>{post.comments_count}</Typography>
      </IconButton>
    </>
  );
}
export default withStyles(styles)(CommentButton);