export class Config {

}

// Config.backend = '//api.isotope.local.seanmorr.is';
// Config.backend = '//isotope-backend:9997';
// Config.backend = '//localhost';
Config.backend   = `//${window.location.host}`;
Config.title     = 'isotope';
Config.socketUri = `ws://${window.location.hostname}:9998`