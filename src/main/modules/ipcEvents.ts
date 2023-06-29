import { ipcMain, app, IpcMainEvent } from 'electron';
import { mainWindow } from '../main';
import processTodoTxtObjects from './TodoTxtObjects';
import { changeCompleteState } from './TodoTxtObject';
import { writeTodoTxtObjectToFile } from './WriteToFile';
import { activeFile } from '../util';
import store from '../config';

interface File {
  path: string;
  active: boolean;
}

const handleSetActiveFile = async (event: IpcMainEvent, arg: number): Promise<void> => {
  try {
    const files: File[] = store.get('files') || [];
    
    files.forEach((file: File) => {
      file.active = false;
    });
    
    files[arg].active = true;
    store.set('files', files);
    
    console.log(`Active file is set to ${files[arg].path}`);
    
    await processTodoTxtObjects(files[arg].path);
  } catch (error) {
    console.error(error);
    mainWindow?.webContents.send('displayErrorFromMainProcess', error);
  }
};

const handleRequestTodoTxtObjects = async (event: IpcMainEvent): Promise<void> => {
  try {
    const activeFilePath = activeFile()?.path || '';
    await processTodoTxtObjects(activeFilePath);
  } catch (error) {
    console.error(error);
    mainWindow?.webContents.send('displayErrorFromMainProcess', error);
  }
};

const handleWriteTodoToFile = async (event: IpcMainEvent, id: number, string: string): Promise<void> => {
  try {
    const response = await writeTodoTxtObjectToFile(id, string);
    event.reply('successWritingToFile', response);
  } catch (error) {
    event.reply('errorWritingToFile', error);
  }
};

const handleRequestFiles = (event: IpcMainEvent): void => {
  try {
    const files = store.get('files');
    event.reply('receiveFiles', files);
  } catch (error) {
    console.error(error);
    mainWindow?.webContents.send('displayErrorFromMainProcess', error);
  }
};

const handleChangeCompleteState = (event: IpcMainEvent, id: number, state: boolean): void => {
  try {
    changeCompleteState(id, state);
  } catch (error) {
    console.error(error);
    mainWindow?.webContents.send('displayErrorFromMainProcess', error);
  }
};

ipcMain.on('setActiveFile', handleSetActiveFile);
ipcMain.on('requestTodoTxtObjects', handleRequestTodoTxtObjects);
ipcMain.on('requestFiles', handleRequestFiles);
ipcMain.on('changeCompleteState', handleChangeCompleteState);
ipcMain.on('writeTodoToFile', handleWriteTodoToFile);

const removeEventListeners = (): void => {
  ipcMain.off('setActiveFile', handleSetActiveFile);
  ipcMain.off('requestTodoTxtObjects', handleRequestTodoTxtObjects);
  ipcMain.off('requestFiles', handleRequestFiles);
  ipcMain.off('changeCompleteState', handleChangeCompleteState);
  ipcMain.off('writeTodoToFile', handleWriteTodoToFile);
};

app.on('before-quit', removeEventListeners);
