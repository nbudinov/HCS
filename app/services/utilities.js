var crypto = require('crypto');

module.exports = (function () {
    return {
        roundPrice,
        getFormattedDate,
        generateOnlyRandomToken,
        cyrToLat,
        appendLeadingZeros
    };

    function roundPrice(price) {
        return Math.round(price*100) / 100
    }

    function getFormattedDate(dateString) {
        var d = new Date(dateString);

        if(!d) {
            return "";
        } else {
            // .${d.getFullYear()}

            var min = d.getMinutes() == 0 ? "00": d.getMinutes();

            return `${d.getDate()}.${d.getMonth()+1} ${d.getHours()}:${min}`;
        }
    }

    function generateOnlyRandomToken(tokenLen = 16) {

        let rand = crypto.randomBytes(Math.ceil(tokenLen/2))
                    .toString('hex') // convert to hexadecimal format
                    .slice(0,tokenLen); //.toUpperCase();

        return rand
    }

    function cyrToLat(word){
        var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

        return word.split('').map(function (char) { 
            return a[char] || char; 
        }).join("");
    }

    function appendLeadingZeros(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    } 
});