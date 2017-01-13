/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('DataTableController', DataTableController);

    DataTableController.$inject = ['$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$state'];
    function DataTableController($resource, DTOptionsBuilder, DTColumnDefBuilder, $state) {
        var vm = this;
        vm.goToDetail = goToDetail;

        activate();

        ////////////////

        function goToDetail(id) {
            console.log(id);
            $state.go("app.patient-details");
        }

        function activate() {

            // Ajax

            $resource('server/datatable.json').query().$promise.then(function (persons) {
                vm.persons = persons;
            });

            // Changing data

            vm.heroes = [{
                'id': 80,
                'firstName': 'Superman',
                'lastName': 'Yoda',
                'latestUpdate': '10/12/2015'
            }, {
                'id': 70,
                'firstName': 'Ace',
                'lastName': 'Ventura',
                'latestUpdate': '11/12/2015'
            }, {
                'id': 52,
                'firstName': 'Flash',
                'lastName': 'Gordon',
                'latestUpdate': '12/12/2014'
            }, {
                'id': 23,
                'firstName': 'Luke',
                'lastName': 'Skywalker',
                'latestUpdate': '12/12/2014'
            }
            ];

            vm.teamMembers = [{
                'specialty': 'Medical Oncologist',
                'firstName': 'Tom',
                'lastName': 'Smith',
                'status': 'Invited'
            }, {
                'specialty': 'Office Manager',
                'firstName': '',
                'lastName': '',
                'status': 'Unidentified'
            }, {
                'specialty': 'Surgeon',
                'firstName': 'Will',
                'lastName': 'Jones',
                'status': 'Active'
            }, {
                'specialty': 'Pathologist',
                'firstName': 'Beth',
                'lastName': 'Williams',
                'status': 'Active'
            }, {
                'specialty': 'Radiologist',
                'firstName': 'Mark',
                'lastName': 'Thomas',
                'status': 'Active'
            }
            ];

            vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3).notSortable()
            ];
            vm.person2Add = _buildPerson2Add(1);
            vm.addPerson = addPerson;
            vm.modifyPerson = modifyPerson;
            vm.removePerson = removePerson;

            function _buildPerson2Add(id) {
                return {
                    id: id,
                    firstName: 'Foo' + id,
                    lastName: 'Bar' + id
                };
            }

            function addPerson() {
                vm.heroes.push(angular.copy(vm.person2Add));
                vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
            }

            function modifyPerson(index) {
                vm.heroes.splice(index, 1, angular.copy(vm.person2Add));
                vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
            }

            function removePerson(index) {
                vm.heroes.splice(index, 1);
            }

        }
    }
})();
