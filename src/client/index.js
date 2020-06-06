import { getTrip } from './js/getTrip'
import { geonameAPI } from './js/geonameAPI'

import './styles/main.scss'

document.getElementById('getTripButton').addEventListener('click', getTrip);

export {
    getTrip,
    geonameAPI
}