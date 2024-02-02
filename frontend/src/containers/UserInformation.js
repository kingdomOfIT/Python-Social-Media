import React, { Component, useState, useEffect } from 'react'
import moment from "moment"
import { connect } from 'react-redux'
import _ from "lodash"
import { withStyles } from '@material-ui/styles';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios"
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


import AnimatePage from "../components/AnimatePage" 
import UserPost from "./anyUserInfo"
import { updateUserInfo } from "../actions/index"
import { updateUserImage } from '../actions/index'
import { getuserByUserID } from '../actions/auth_actions'
import { getUserPosts } from '../actions/posts_action'
import '../../static/frontend/mystyle.css';
import EditModal from '../components/editModal'
import UserProfileMenu from '../components/userProfileMenu.js'
import CommentModal from '../components/comments/commentModal'

import CommentButton from "../components/comments/commentButton.js";
import ResponsiveDialog from "../components/responsiveDialog.js";

import Card from '@material-ui/core/Card';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Likes from './post_likes'
const styles = {
    card: {
        // Add your card styles here
        backgroundColor: '#19002f',
        color: 'white',
        // Add other styles as needed
    },
    // Add other styles as needed
};


export class UserInfo extends Component {
    constructor(props) {
        super(props)
        const { user } = props.authReducer 
        this.modulRef = React.createRef();
        this.state = {
            originImage : "",
            croppedImageUrl: "",
            module: false,
            src: "",
            crop: {
                unit: "%",
                width: 30,
                aspect: 1 / 1
            },
            user: {
                username: { value: user.username, edit: false, label: "username", id: "username" },
                email: { value: user.email, edit: false, label: "email", id: "email" },
                first_name: { value: user.first_name, edit: false, label: "first name", id: "first_name" },
                last_name: { value: user.last_name, edit: false, label: "last name", id: "last_name" },
                sex: { value: user.profile.sex, edit: false, label: "gender", id: "sex" }
            },
            progress: false,
            open: false,
            isMenuOpen: false,
            isDialogOpen: false
        }
    }

    handleOpenMenu = () => {
    // Open the menu directly without the "Open Menu" button
        this.handleOpenDialog();
    };
    
    handleOpenDialog = () => {
        this.setState({ isDialogOpen: true });
    };
    
    handleCloseDialog = () => {
        this.setState({ isDialogOpen: false });
    };

    componentDidMount() {
        const { location } = this.props;
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id');
        
        if (userId) {
            this.props.getuserByUserID(userId);
            this.props.getUserPosts(userId, () => {});
        }
    }
    

    render() {
        const { progress, open } = this.state;
        const { user } = this.props.authReducer;
        const { userId } = this.props.location;
        let { userPostsReducer } = this.props;
        const { classes, loadPosts} = this.props;
        const { modalOpen, editModalOpen, modalPostTitle, selectedUser,
            modalPostId, modalPostContent, commentModalOpen, userInfoOpen}
        = this.state

        // Sort posts by posting date in descending order
        userPostsReducer = userPostsReducer.sort((a, b) => {
            return new Date(b.p_date) - new Date(a.p_date);
        });

        return (
            <Container style={{ paddingTop: '150px', align:"center"}}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6} lg={4}>
                    <Avatar className="avatar" alt="User Profile Picture" src={user.profile.image_path} style={{ width: '150px', height: '150px', marginBottom: '10px'}}/>

                    <Typography variant="h5" component="div" align="center" gutterBottom>
                        {user.first_name} {user.last_name}
                    </Typography>

                    <div align="center" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                        <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>883</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Followers</Typography>
                            </div>

                            <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>823</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Following</Typography>
                            </div>

                            <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>{this.props.userPostsReducer.length}</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Posts</Typography>
                        </div>
                    </div>

                    <Button onClick={this.handleOpenMenu} className="follow-button" variant="contained" color="primary" fullWidth>
                        Follow
                    </Button>

                    {this.state.isDialogOpen && <UserProfileMenu open={this.state.isDialogOpen} onClose={this.handleCloseDialog} />}
                    </Grid>
                </Grid>
                <div className="posts" maxWidth="lg">
                        {this.renderPosts()}
                </div>
                <EditModal
                    open={editModalOpen}
                    handleClose={this.handleModalClose}
                    postTitle={modalPostTitle}
                    postContent = {modalPostContent}
                    postId={modalPostId}
                />

                <CommentModal
                    open={commentModalOpen}
                    handleClose={this.handleModalClose}
                    postId={modalPostId}
                />
                </Container>
          );
        };

    renderPosts(){
        const { classes } = this.props
        let { userPostsReducer } = this.props;
        return userPostsReducer.map(post => {
            const p_date = moment(post.p_date).format('DD/MM/YYYY, HH:mm');
            const PostTime = ({ postDate }) => {
                const [timeAgo, setTimeAgo] = useState('');
              
                useEffect(() => {
                  const calculateTimeAgo = () => {
                    const currentDate = moment();
                    const postCreationDate = moment(postDate, 'DD/MM/YYYY, HH:mm');
                    const duration = moment.duration(currentDate.diff(postCreationDate));
                    
                    if (duration.asDays() > 5) {
                      // If created more than 5 days ago, display full date
                      setTimeAgo(postCreationDate.format('DD/MM/YYYY'));
                    } else if (duration.asHours() >= 24) {
                      // If created more than 24 hours ago, display days ago
                      setTimeAgo(`${Math.floor(duration.asDays())} days ago`);
                    } else if (duration.asMinutes() >= 60) {
                      // If created more than 60 minutes ago, display hours ago
                      setTimeAgo(`${Math.floor(duration.asHours())} hours ago`);
                    } else if (duration.asMinutes() < 1) {
                        
                        setTimeAgo(`Just Now`);
                    } else {
                      // If created less than an hour ago, display minutes ago
                      setTimeAgo(`${Math.floor(duration.asMinutes())} minutes ago`);
                    } 
                  };
              
                  calculateTimeAgo();
                }, [postDate]);
              
                return <span>{timeAgo}</span>;
              };
            return (
                <Card className={classes.card} raised style={{ backgroundColor:"#19002f", color:"white", marginBottom: "10px"}}>
                    <Grid container direction="column">
                        <Grid item>
                            <CardHeader
                            className={classes.header}
                            disableTypography
                            avatar={<Avatar aria-label="Profile Photo" src={post.owner.profile.image_path} onClick={() => this.getUserInfo(post.owner.id)}/>}
                            style={{ padding: '16px 16px 10px 16px' }}
                            title={
                                <div>
                                <Typography
                                    className="ownerName"
                                    variant="title"
                                    display="inline"
                                >
                                {post.owner.first_name} {post.owner.last_name}
                                </Typography>
                                <Typography variant="subtitle1" style={{color:"#808080", fontSize:"16px"}}>
                                    <p><PostTime postDate={p_date} /></p>
                                </Typography>
                            </div>
                            }
                            action={
                                <IconButton
                                aria-label="settings"
                                disableRipple
                                disableTouchRipple
                                style={{ color: 'white' }}
                                >
                                <ResponsiveDialog post={post} userId={this.props.authReducer.user.id}/>
                                </IconButton>
                            }
                            />
                        </Grid>
                        <Grid item>
                            <CardContent className= "postTitle" style={{ paddingBottom: '5px' }}>
                            <Typography
                                variant="title1"
                                gutterBottom
                                className={classes.title}
                            > {post.title}
                            </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item>
                            <CardContent className={classes.content} style={{ paddingBottom: '5px' }}>
                            <Typography
                                variant="body2"
                                gutterBottom
                                className={classes.paragraph}
                            > {post.content}  
                            </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item>
                            <CardActions className={classes.actions}>
                            <Grid container justify="space-around" wrap="nowrap">
                                <Likes
                                post = {post}
                                userId = {this.props.authReducer.user.id}
                                />
                                <Grid item>
                                <CommentButton 
                                    post = {post}
                                    className={classes.icons} 
                                    onClick={() => this.onOpenComments(post.id)}
                                />
                                </Grid>
                            </Grid>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
            )
        })
    }

    renderValues() {
        const { progress } = this.state 
        return _.map(this.state.user, (info) => {
            if (info.edit && info.id === "sex") {
                return (
                    <div>
                        <div className="user-info-input-wrap">
                            <p className="user-info-input-slelect" value="male"
                                onClick={this.onClose}>
                                choose your Gender {progress ? <CircularProgress /> : ""} 
                            </p>
                        </div> 
                        <div className="user-info-input-wrap">
                            <p className="user-info-input-sex" value="male"
                            onClick={this.sexChanged}> Male </p>
                        </div> 
                        <div className="user-info-input-wrap">
                            <p className="user-info-input-sex" value="female"
                            onClick={this.sexChanged}> Female </p>
                        </div>
                    </div>
                )
            }
            else if (info.edit) {
                return (
                    <div className="user-info-input-wrap">
                        <input
                            className="user-info-input"
                            value={info.value}
                            onChange={(e) => this.inputChange(e.target.value, info.id)}
                        />
                        <div className="user-info-btn" onClick={() => this.onCheck(info.id)}>
                            {progress ? <CircularProgress /> : <i className="fa fa-check"></i>}
                        </div>
                        <div className="user-info-btn" onClick={this.onClose}>
                            <i className="fa fa-remove"></i>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="user-information" key={info.id}
                        onClick={this.infoClicked.bind(this, info.id)}>
                        <div className="label">{info.label}</div>
                        <div className="content">{info.value}</div>
                        <div className="edit-icon">
                            <i className="fa fa-pencil"></i>
                        </div>
                    </div>
                )
            }

        })
    }

    renderProfilePic() {
        return(
            <div className="user-image-wrap">
                <Avatar className="avatar" alt="User Profile Picture" src={user.profile.image_path} style={{ width: '150px', height: '150px', marginBottom: '10px'}}/>
                <img src={user.profile.image_path} className="user-image" />
                <div className='change-image-box'>
                    <label htmlFor='change-image-input' className='change-image-label'>
                        <i style = {{ color : "white" }} className='fa fa-camera fa-3x'>
                        </i></label>
                    <input
                        className='radio-input' id='change-image-input' type='file'
                    onChange={(e) => this.ImageChanged(e)}
                    />
                </div>
            </div>
        )
    }
    onOpenComments = (postId) => {
        this.setState({
            commentModalOpen: true, modalPostId: postId
        })
    }


    infoClicked(id) {
        // all the info rendred normal( no input fields )
        this.handleEdit()

        this.setState((preState, props) => {
            const { user } = preState
            return {
                ...preState,
                user: {
                    ...user,
                    [id]: { ...user[id], edit: true }
                },
                progress : false,
            }

        })

    }

    handleModalClose = () => {
        this.setState({ modalOpen: false, editModalOpen: false, commentModalOpen : false })
    }

    inputChange(newValue, id) {
        this.setState((preState, props) => {
            return {
                ...preState,
                user: {
                    ...preState.user,
                    [id]: { ...preState.user[id], value: newValue }
                }
            }

        })
    }

    onCheck(id) {
        const { user } = this.props.authReducer
        const content = {}

        // render the circle waiting
        this.setState({ progress : true})

        for (let key in this.state.user) {
            content[key] = this.state.user[key].value
        }

        // send new user info  to API endpoint
        this.props.updateUserInfo(content, user.id, () => {
            this.setState((preState, props) => {
                const { user } = preState
                return {
                    ...preState,
                    user: {
                        ...user,
                        [id]: { ...user[id], edit: false }
                    }
                }

            })
        } , () => {
            this.setState({ progress : false })
        })
    }

    onClose = () => {
        this.handleEdit()
    }

    handleEdit(){
        // set the edit  of all user info's to false
        this.setState((preState , props) => {
            const { user } = preState 
            const  newUser  = props.authReducer.user

            return {
                ...preState,
                user : {
                    username: { ...user.username, value: newUser.username , edit: false },
                    email: { ...user.email, value: newUser.email, edit: false },
                    first_name: { ...user.first_name, value: newUser.first_name ,edit: false },
                    last_name: { ...user.last_name, value: newUser.last_name ,edit: false },
                    sex: { ...user.sex, value: newUser.profile.sex ,edit: false }
                }
            }
        })
    }

    closeModul(e) {
        const modul = this.refs.modul
        modul.classList.add('hidden')

    }

    updateUserImageFunc = () => {
        const { originImage } = this.state
        const { id } = this.props.authReducer.user
        this.setState({ progress : true})
        const form = new FormData()
        form.append('image', originImage)
        this.props.updateUserImage(form , id ,() => {
            const modul = this.refs.modul
            modul.classList.add('hidden')  
        })

    }





    

    ImageChanged(e) {
        this.handleEdit()
        this.setState({ originImage: e.target.files[0] , progress : false })
        this.refs.modul.classList.remove('hidden')
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState(preState => {
                    return {
                        ...preState,
                        src: reader.result
                    }
                })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }     

    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }
}

const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
        userPostsReducer: state.userPostsReducer || { posts: [] }, // Provide a default value for userPostsReducer
    };
};

export default withStyles(styles)(withRouter(connect(mapStateToProps, { updateUserInfo, updateUserImage, getuserByUserID, getUserPosts })(UserInfo)));
