import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { i18n } from '../Settings/LanguageSelector';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import './DatePicker.scss';

const { ipcRenderer } = window.api;

interface Props extends WithTranslation {
  date: string | null;
  settings: Settings;
  textFieldValue: string;
  todoObject: TodoObject | null;
  t: typeof i18n.t;
}

const DatePickerComponent: React.FC<Props> = ({
  date,
  type,
  settings,
  textFieldValue,
  todoObject,
  t,
}) => {
  
  const handleChange = (date: dayjs.Dayjs | null) => {
    try {
      ipcRenderer.send('updateTodoObject', todoObject?.id, textFieldValue, type, dayjs(date).format('YYYY-MM-DD'));
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={settings.language}>
      <DatePicker
        className="datePicker"
        format="YYYY-MM-DD"
        label={t(`todoDialog.datePicker.${type}`)}
        value={date ? dayjs(date) : null}
        onChange={(date) => handleChange(date)}
        data-testid={`data-testid=dialog-picker-date-${type}`}
        InputProps={{"data-testid": `dialog-picker-date-${type}`}}
      />
    </LocalizationProvider>
  );
};

export default withTranslation()(DatePickerComponent);