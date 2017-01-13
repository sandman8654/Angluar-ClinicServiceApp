/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function () {
    'use strict';
    angular
        .module('clinic', [
            'app.core',
            'app.routes',
            'app.elements',
            'app.dashboard',
            'app.charts',
            'app.sidebar',
            'app.navsearch',
            'app.envconfig',
            'app.specimatch',
            'app.patientDetails',                                                                                                      
            'app.account',
            'app.patient',
            'app.conference',
            'app.bootstrapui',
            'app.pages',
            'app.panels',
            'app.forms',
            'app.tables',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.utils',
            'app.invite',
            'app.whiteboard'
        ]);
})();

