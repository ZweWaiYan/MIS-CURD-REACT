import moment from 'moment';

export function dateFormatter(date) {
    if (date) {
      return moment(date).local().format("DD/MM/YYYY");
    }
    else {
      return '';
    }
  }