

module.exports = (function() {
    return {
      isAllowedFile
    };

    function isAllowedFile(mimetype) {
        mimetype = mimetype.toLowerCase();
        if (mimetype == 'image/jpg' || mimetype == 'image/png' || mimetype == 'image/jpeg') {
            return true;
        }

        return false;
    }

})()
  