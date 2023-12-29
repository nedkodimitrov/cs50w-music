import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

export default function NotificationsMenu({ showText = false }) {
  const notificationsMenuId = 'primary-search-notifications-menu';

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);
  const [loadNotifications, setLoadNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const navigate = useNavigate();

  const handleNotificationsMenuOpen = async (event) => {
    try {
      setNotificationsAnchorEl(event.currentTarget);
      const response = await axiosInstance.get(`/../notifications/api/unread_list/?mark_as_read=true`);
      setNotifications(response.data.unread_list);
      setUnreadNotificationsCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications.', error);
    }
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
    setLoadNotifications(false);
  };

  const handleLoadNotifications = async () => {
    try {
      setLoadNotifications(true);
      const response = await axiosInstance.get(`/../notifications/api/all_list/?max=100`);
      setNotifications(response.data.all_list);
    } catch (error) {
      console.error('Error fetching notifications.', error);
    }
  };

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const response = await axiosInstance.get(`/../notifications/api/unread_count/`);
        setUnreadNotificationsCount(response.data.unread_count);
      } catch (error) {
        console.error('Error fetching unread notifications count.', error);
      }
    };

    fetchNotificationsCount();
  }, []);

  return (
    <>
      <IconButton
        size="large"
        aria-label={`show ${unreadNotificationsCount} new notifications`}
        color="inherit"
        onClick={handleNotificationsMenuOpen}
      >
        <Badge badgeContent={unreadNotificationsCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={notificationsAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={notificationsMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isNotificationsMenuOpen}
        onClose={handleNotificationsMenuClose}
      >
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => {
              handleNotificationsMenuClose();
              const releaseType = notification.target && notification.target.startsWith("Song") ? "songs" : "albums";
              navigate(`/${releaseType}/${notification.target_object_id}`);
            }}
            style={{
              color: notification.unread ? 'inherit' : 'gray',
              whiteSpace: 'normal',
            }}
          >
            <Typography variant="body1">{notification.verb}</Typography>
          </MenuItem>
        ))}
        <Button onClick={handleLoadNotifications} disabled={loadNotifications}>
          All Notifications
        </Button>
      </Menu>
    </>
  );
}
