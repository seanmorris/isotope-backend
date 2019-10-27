export class Config {

}

// Config.backend = '//api.isotope.local.seanmorr.is';
// Config.backend = '//isotope-backend:9997';
// Config.backend = '//localhost';
Config.backend   = `//${location.hostname.replace('frontend', 'backend')}:${location.port}`;
Config.title     = 'isotope';
Config.socketUri = `ws://socket.${location.hostname}:${location.port}`
