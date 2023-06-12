var jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (token) {
        try {
            const decoded = jwt.verify(token, "masai");
            // console.log(decoded,req.body);
            if (decoded) {
                req.body.userID=decoded.userID
                next()
            } else {
                res.status(200).json({ msg: "Wrong token!" })
            }
        } catch (error) {
            res.status(400).json({ msg: "Plase login" })
        }
    }else{
        res.status(200).json({ msg: "Plase provide token" })
    }

}

module.exports = {
    auth
}