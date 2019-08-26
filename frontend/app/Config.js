export class Config {

}

// Config.backend = '//api.isotope.local.seanmorr.is';
// Config.backend = '//isotope-backend:9997';
// Config.backend = '//localhost';
Config.backend   = `//${window.location.host.replace('frontend', 'backend')}`;
Config.title     = 'isotope';
Config.socketUri = `ws://socket.${window.location.hostname}`
