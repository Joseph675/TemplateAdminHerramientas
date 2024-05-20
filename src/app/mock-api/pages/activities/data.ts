/* eslint-disable */
import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();

export const activities = [
    {
        id          : '493190c9-5b61-4912-afe5-78c21f1044d7',
        icon        : 'heroicons_solid:star',
        description : 'Your submission has been accepted',
        date        : now.minus({minutes: 25}).toISO(), // 25 minutes ago
        extraContent: `<div class="font-bold">Congratulations for your acceptance!</div><br>
                        <div>Hi Brian,<br>Your submission has been accepted and you are ready to move into the next phase. Once you are ready, reach out to me and we will ...</div>`,
    }
];
