import {IMyDpOptions} from 'mydatepicker';

export const timepickerOptions: IMyDpOptions = {
  dateFormat: 'dd-mm-yyyy',
  dayLabels: {su: 'D', mo: 'L', tu: 'M', we: 'M', th: 'J', fr: 'V', sa: 'S'},
  monthLabels: {
    1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
  },
  todayBtnTxt: 'Hoy',
  editableDateField: false,
  openSelectorOnInputClick: true
};
