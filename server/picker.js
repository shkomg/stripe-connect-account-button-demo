Picker.route('/stripetoken', function (params, req, res, next) {
    var getTokenResponse = function (query) {
        var config = ServiceConfiguration.configurations.findOne({service: 'stripe'});
        if (!config) {
            throw new ServiceConfiguration.ConfigError("Service not configured");
        };

        var responseContent;

        try {
            // Request an access token
            responseContent = HTTP.post(
                "https://connect.stripe.com/oauth/token", {
                    params: {
                        client_id:     config.appId,
                        client_secret: OAuth.openSecret(config.secret),
                        code:          query.code,
                        grant_type:    'authorization_code',
                        redirect_uri: Meteor.absoluteUrl("_oauth/stripe?close")
                    }
                }).content;

        } catch (err) {
            throw _.extend(new Error("Failed to complete OAuth handshake with stripe. " + err.message),
                {response: err.response});
        }
        // Success!  Extract the stripe access token and key
        // from the response
        var parsedResponse = JSON.parse(responseContent);

        var stripeAccessToken = parsedResponse.access_token;
        var stripeRefreshToken = parsedResponse.refresh_token;
        var stripe_id = parsedResponse.stripe_user_id;
        var stripe_publishable_key = parsedResponse.stripe_publishable_key;

        if (!stripeAccessToken) {
            throw new Error("Failed to complete OAuth handshake with stripe " +
                "-- can't find access token in HTTP response. " + responseContent);
        }
        return {
            accessToken: stripeAccessToken,
            refreshToken: stripeRefreshToken,
            stripe_user_id: stripe_id,
            stripe_publishable_key: stripe_publishable_key
        };
    };

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("<!DOCTYPE html>\n"+'<html><head><script type="text/javascript">function storeAndClose() {window.close();}</script></head><body onload="storeAndClose()"><p id="completedText" style="display:none;">Login completed. <a href="#" onclick="window.close()">Click here</a> to close this window.</p></body></html>','utf-8');

    var str=params.query.state;

    params.query['user_id']=str.slice(str.indexOf('/')+1);
    params.query.state=str.substr(0, str.indexOf('/'));

    if (params.query.user_id) {

        var response = getTokenResponse(params.query); //state scope code
        var accessToken = response.accessToken;
        var refreshToken = response.refreshToken;

        var serviceData = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            stripe_publishable_key: response.stripe_publishable_key,
            stripe_user_id: response.stripe_user_id,
            id: response.stripe_user_id
        };

        var user_id=response.user_id;
        Meteor.users.update({_id:params.query.user_id},{$set:{'services.stripe.process':serviceData}});

    } else {
        console.log('Stripe OAuth with no data - strange!');
    };
});
