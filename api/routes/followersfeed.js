require('dotenv').config();
const express = require('express');
const router = express.Router();
const { IgApiClient } = require('instagram-private-api');

router.post('/', (req, res, next) => {

    const IG_USERNAME = req.body.user_name;
    const IG_PASSWORD = req.body.user_password;
    // const IG_USERNAME = "muntasir_sunny";
    // const IG_PASSWORD = "multiverse@1234";

    const followersfeed = async() => {
        try {

            const ig = new IgApiClient();

            ig.state.generateDevice(IG_USERNAME);
            await ig.simulate.preLoginFlow();
            const auth = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    
            const followersFeed = ig.feed.accountFollowers(auth.pk);
            const wholeResponse = await followersFeed.request();
            console.log(wholeResponse);

            res.status(200).json(wholeResponse);

        } catch (error) {
            console.log(error);
            res.status(422).json({
                message: "ERROR!"
            });
        }
    }
    followersfeed();
});

module.exports = router;
