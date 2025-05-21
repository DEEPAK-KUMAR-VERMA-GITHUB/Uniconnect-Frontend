import {Screens} from '../constants/Constants';

export type RootStackParamList = {
  [Screens.Splash]: undefined;
  [Screens.Landing]: undefined;
  [Screens.Login]: undefined;
  [Screens.Option]: undefined;
  [Screens.StudentRegister]: undefined;
  [Screens.FacultyRegister]: undefined;
  [Screens.Home]: undefined;
  [Screens.Notes]: undefined;
  [Screens.PYQs]: undefined;
  [Screens.Assignments]: undefined;
  [Screens.Profile]: undefined;
  [Screens.Notifications]: undefined;
  [Screens.AssignmentSubmit]: undefined;
  [Screens.SubjectNotes]: {
    subjectId: string;
    subjectName: string;
  };
}; 