import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

export const datetimeMixin = {
    methods: {
        formatDateTime: function (datetime, format = 'DD/MM/YYYY') {
            return dayjs(datetime).format(format);
        }
    }
};
