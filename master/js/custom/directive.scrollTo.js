(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('scrollTo', scrollTo);

    scrollTo.$inject = ['$location', '$anchorScroll'];

    function scrollTo ($location, $anchorScroll) {

        return function(scope, element, attrs) {
            element.bind('click', function(event) {
                console.log(attrs.scrollTo);
                $anchorScroll.yOffset = 70;
                //event.stopPropagation();
                //scope.$on('$locationChangeStart', function(ev) {
                //    ev.preventDefault();
                //});
                //var location = attrs.scrollTo;
                $location.hash(attrs.scrollTo);
                $anchorScroll();
            });
        };

    }

})();


