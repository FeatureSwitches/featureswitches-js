function FeatureSwitches(customer_key, environment_key, default_enabled) {
    this.customer_key = customer_key;
    this.environment_key = environment_key;

    this.default_enabled = default_enabled || false;
    this.api = 'http://localhost:8000/v1/';
}

FeatureSwitches.prototype.is_enabled = function(feature_key, user_identifier, callback) {
    user_identifier = user_identifier || null;

    var xhr = new XMLHttpRequest();
    var endpoint = 'feature/enabled';

    var query = '?feature_key=' + encodeURIComponent(feature_key);

    if (user_identifier != null) {
        query += '&user_identifier=' + encodeURIComponent(user_identifier);
    }

    xhr.open('GET', this.api + endpoint + query, true);
    xhr.setRequestHeader('Authorization', this.customer_key + ':' + this.environment_key);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.success) {
                callback(null, res.enabled);
            } else {
                callback(res.message, null);
            }
        }
    };
    xhr.send(null);
}
