// See http://brunch.io for documentation.
exports.files = {
  javascripts: {joinTo: 'app.js'},
  stylesheets: {joinTo: 'app.css'}
};

const { exec } = require('child_process');

exports.hooks  = {};

exports.hooks.preCompile = () => {
  console.log(`About to compile ${process.env.STAGE_ENV} ...`);

  if(process.env.STAGE_ENV === 'development')
  {
    exec(
      `cd ../curvature \\
        && npm link \\
        && cd ../frontend \\
        && npm link curvature`
      , (err, stdout, stderr)=>{
        console.log(stdout);
        console.log(stderr);

        return Promise.resolve();
      }
    );
  }

};

exports.plugins = {
  babel: {presets: ['latest']},
  raw: {
    pattern: /\.(html|svg)$/,
    wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.watcher = {
    awaitWriteFinish: true,
    usePolling: true
}
