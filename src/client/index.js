import { getTrip } from './js/getTrip'
import { geonameAPI } from './js/geonameAPI'

import './styles/main.scss'

import logoIcon from './media/logo.png';

var logoImg = document.querySelector('.logo');
logoImg.src = logoIcon;

var logoFooterImg = document.querySelector('.logo-footer');
logoFooterImg.src = logoIcon;

document.getElementById('getTripButton').addEventListener('click', getTrip);

export {
    getTrip,
    geonameAPI
}