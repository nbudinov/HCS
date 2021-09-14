module.exports = (function(db) {
    return {
        getPlaces,
    };

    function getPlaces() {
        return  db.place
            .findAll({
                include: [
                    {
                        model: db.ordertype,
                    }
                ]
            })
    }
})