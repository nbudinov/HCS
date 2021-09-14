module.exports = (function (db) {
	return {
		handleError,
		createError,
		createErrorsArr,
		createErrors
	};

	function handleError(err, res, customErrMsg = "") {
		if (err instanceof db.Sequelize.ForeignKeyConstraintError) {
			let defaultErr = err.fields && err.fields[0] ? err.fields[0] : "";

			errors = this.createErrorsArr([
				customErrMsg.length > 0 ? customErrMsg : "Foreign key error: " + defaultErr
			]);
			res.status(400).json({
				error: { errors: errors }
			});
		} else if (err == null) {
			errors = this.createErrorsArr([customErrMsg]);
			res.status(400).json({
				error: { errors: errors }
			});
		} else {
			res.status(400).json({ error: err });
		}
	}

	function createError(message) {
		return {
			message: message
		}
	}

	function createErrorsArr(messages) {
		let errArr = [];
		messages.map(m => {
			errArr.push({
				message: m
			});
		})

		return errArr;
	}

	function createErrors(messages) {
		let errArr = [];
		messages.map(m => {
			errArr.push({
				message: m
			});
		})

		return {
			"error": {
				"errors": errArr
			}
		};
	}

})