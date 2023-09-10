import React, { useState } from 'react';
import { Box, FormGroup, FormControlLabel, FormControl, InputLabel, MenuItem, Select, Switch, Divider, Modal } from '@mui/material';
import './Settings.scss';

const store = window.electron.store;

const Settings = ({ isOpen, onClose, colorTheme, setColorTheme }) => {
  const [appendCreationDate, setAppendCreationDate] = useState(store.get('appendCreationDate'));
  const [convertRelativeToAbsoluteDates, setConvertRelativeToAbsoluteDates] = useState(store.get('convertRelativeToAbsoluteDates'));
  const [notificationsAllowed, setNotificationsAllowed] = useState(store.get('notificationsAllowed'));

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    switch (name) {
      case 'appendCreationDate':
        store.set(name, checked);
        setAppendCreationDate(checked);
        break;
      case 'convertRelativeToAbsoluteDates':
        store.set(name, checked);
        setConvertRelativeToAbsoluteDates(checked);
        break;
      case 'notificationsAllowed':
        store.set(name, checked);
        setNotificationsAllowed(checked);
        break;
      case 'colorTheme':
        store.set(name, event.target.value);
        setColorTheme(event.target.value);
        break;
      default:
        break;
    }
  };  

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
    >
      <Box
      	className="Modal"
      >
        <h3>Settings</h3>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={appendCreationDate} onChange={handleSwitchChange} name="appendCreationDate" />}
            label="Append creation date when todo is created"
          />
          <FormControlLabel
            control={<Switch checked={convertRelativeToAbsoluteDates} onChange={handleSwitchChange} name="convertRelativeToAbsoluteDates" />}
            label="Convert relative dates to absolute dates"
          />
          <FormControlLabel
            control={<Switch checked={notificationsAllowed} onChange={handleSwitchChange} name="notificationsAllowed" />}
            label="Send notification when due date is today or tomorrow"
          />
          <FormControl>
            <InputLabel id="colorTheme">Theme</InputLabel>
            <Select
              labelId="colorTheme"
              id="colorTheme"
              label="Theme"
              value={colorTheme}
              name="colorTheme"
              onChange={handleSwitchChange}
            >
              <MenuItem value="system">Follow system</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>          
        </FormGroup>
      </Box>
    </Modal>
  );
};

export default Settings;
