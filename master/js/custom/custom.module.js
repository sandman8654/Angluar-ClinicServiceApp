(function() {
    'use strict';

    angular
        .module('custom', [
            // request the the entire framework
            'clinic',
            // or just modules
            'app.core',
            'app.sidebar'
            /*...*/
        ]);
})();