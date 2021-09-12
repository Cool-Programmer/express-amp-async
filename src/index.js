const ampify = require('ampify')

function expressAMP ({
  override = true,
  staticsPath = `${process.cwd()}/public`
} = {}) {
  function renderAMP (req, res, next) {
    const renderCallback = callback => {
      return async (err, html) => {
        if (err) {
          return next(err)
        }

        const htmlAMP = await ampify(html, { cwd: staticsPath })
        res.send(htmlAMP)
      }
    }

    if (override === false) {
      res.renderAMP = function (view, renderOpts = {}, callback) {
        if (renderOpts) {
          renderOpts.isAMP = true
        }
        this.render(view, renderOpts, renderCallback(callback))
      }
    } else {
      res.oldRenderMethod = res.render
      res.render = function (view, renderOpts, callback) {
        if (renderOpts) {
          renderOpts.isAMP = true
        }
        this.oldRenderMethod(view, renderOpts, renderCallback(callback))
      }
    }

    return next()
  }

  return (renderAMP)
};

module.exports = expressAMP
