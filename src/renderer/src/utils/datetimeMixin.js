import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

export const datetimeMixin = {
    methods: {
        formatDateTime: function (datetime, format = 'DD/MM/YYYY HH:mm') {
            return dayjs(datetime).format(format);
        }
    }
};
