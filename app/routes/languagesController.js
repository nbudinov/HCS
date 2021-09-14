var errorCreator = require("./../validation/errorsCreator");

module.exports = function(app, db) {
  return {
    getLangs,
    createLang,
    updateLang
  };

  function getLangs(req, res) {
    db.language
      .findAll({
        where: {
          deleted: 0
        }
      })
      .then(langs => {
        var resObj = {};
        langs.map(lang => {
          resObj[lang.code] = Object.assign(
            {},
            {
              id: lang.id,
              name: lang.name,
              code: lang.code,
			        icon_code: lang.icon_code,
              active: lang.active,
              deleted: lang.deleted
            }
          )
        })

        res.json(resObj);
      });
  }

  function createLang(req, res) {

    db.language.findOne({
        where: { code: req.body.code }
      })
      .then(lang => {
        if(lang) {
          res.json(errorCreator.createErrors(["Lang with this code already exists"]))
        } else {
            db.language
                .create(req.body)
                .then(lang => {
                    res.json(lang);
                })
                .catch(err => {
                    res.json({ error: err });
                });
        }
      })
  }

  function updateLang(req, res) {
    let errors = [];
      db.language.findOne({
        where: { id: req.params.id }
      })
      .then(lang => {
        if(lang == null) {
          res.json(errorCreator.createErrors(["No lang with this id found"]))
        } else {
            lang.update(req.body)
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            res.json({"error":err})
          })
        }
      })
      .catch(err => {
        res.json({"error":err});
      })
  }
};
