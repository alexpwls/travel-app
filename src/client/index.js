import { getTrip } from './js/getTrip'

import './styles/main.scss'

document.getElementById('getTripButton').addEventListener('click', getTrip);

export {
    getTrip
}