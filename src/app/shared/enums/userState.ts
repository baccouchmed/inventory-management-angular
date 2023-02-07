import { RefList } from '../models/ref-list';

export enum UserState {
  newValidCode = 'newValidCode',
  newInvalidCode = 'newInvalidCode',
  old = 'old',
  oldAndDisabled = 'oldAndDisable',
  passwordChange = 'passwordChange',
}

export const listUserState: RefList<UserState>[] = [
  { key: UserState.newValidCode, value: 'newValidCode' },
  { key: UserState.newInvalidCode, value: 'newInvalidCode' },
  { key: UserState.old, value: 'old' },
  { key: UserState.oldAndDisabled, value: 'oldAndDisabled' },
  { key: UserState.passwordChange, value: 'passwordChange' },
];
