import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import SpeedIcon from '@material-ui/icons/Speed';
import Tooltip from '@material-ui/core/Tooltip';



function DownloadDropdown(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const saveCSV = () => {
    props.createOutputCSV();
  }

  const saveJSON = () => {
    props.createOutputJSON();
  }

  return (
    <React.Fragment>
      <Tooltip title="Download" placement="top" arrow>
        <IconButton
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
        >
            <GetAppIcon />
        </IconButton>
      </Tooltip>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={saveCSV}>CSV</MenuItem>
        <MenuItem onClick={saveJSON}>JSON</MenuItem>
      </StyledMenu>
    </React.Fragment>
  );
}




function OptimizationDropdown(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const short = () => {
    props.shortTripOptimization();
  }
  const shorter = () => {
    props.shorterTripOptimization();
  }

  return (
    <React.Fragment>
      <Tooltip title="Optimization" placement="top" arrow>
        <IconButton
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
        >
            <SpeedIcon />
        </IconButton>
      </Tooltip>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          <MenuItem onClick={handleClose}>None</MenuItem>
          <MenuItem onClick={short}>Short</MenuItem>
          <MenuItem onClick={shorter}>Shorter</MenuItem>
      </StyledMenu>
    </React.Fragment>
  );
}






const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })
  (props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);



export {DownloadDropdown, OptimizationDropdown};