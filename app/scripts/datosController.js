'use strict';
var angularObj = {
    app: null,
    initAngular: function (api, freshState) {
        angularObj.app = angular.module('myAplicacion', ['ngMaterial', 'md.data.table', 'ngMaterialDatePicker']);

        angularObj.app.controller('accesoDatosController', ['$scope', '$http', '$mdSelect', function ($scope, $http, $mdSelect) {
            $scope.selected = [];
            $scope.resultReporteFechas = [];
            $scope.deviceId = [];
            $scope.listaIds = [];
            $scope.dispositivoIngresado = [];
            $scope.resultConsultaVehiculos = [];
            $scope.dispositivoIngresadoInput = document.getElementById("dispositivoIngresado");
            $scope.lstDevice = {};
            $scope.Data = {
                start: new Date(),
                end: new Date()

            };

            api.call("Get", {
                typeName: "Device"
            }, function (result) {
                $scope.lstDeviceGeotab = result;
                $scope.lstDeviceGeotab.forEach(function (device) {
                    $scope.lstDevice.id = device;
                    //console.log(device);
                }); //console.log(device);
            }, function (error) {
                console.error(error);
            });

            // funcion que permite ingresar texto en el search 
            $scope.updateSearch = function updateSearch(e) {
                e.stopPropagation();
            };

            $scope.btnImprimir = function () {
                if ($scope.resultConsultaVehiculos.length === 0) {
                     const toast = swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    toast({
                        type: 'error',
                        title: 'No hay datos que descargar.'
                    });
                } else
                if ($scope.resultConsultaVehiculos.length > 0) {
                     const toast = swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    toast({
                        type: 'success',
                        title: 'Descarga finalizada.'
                    });
                    $("#fechaDevice").table2excel({
                        filename: "DatosVivo_Suntech"
                    });
                }
            }

            $scope.vehiculosReport1 = function () {

                if ($scope.dispositivoIngresado.length === 0) {
                     const toast = swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    toast({
                        type: 'error',
                        title: 'Ingresa deviceId.'
                    });
                } else
                if ($scope.dispositivoIngresado.length > 0) {
                    swal({
                        imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif',
                        showConfirmButton: false,
                        background: 'rgba(100,100,100,0)'
                    });
                    console.log({
                        device: $scope.dispositivoIngresado,
                        start: moment($scope.Data.start).format('YYYY-MM-DD'),
                        end: moment($scope.Data.end).format('YYYY-MM-DD')
                    });
                    //return;
                    var conAjax = $http.post("https://cppa.metricamovil.com/PMFReports/SunTechData", JSON.stringify({
                        device: $scope.dispositivoIngresado,
                        /*start: moment($scope.Data.start).format('YYYY-MM-DD') + " 05:00:00",
                        end: moment($scope.Data.end).add(1, 'd').format('YYYY-MM-DD') + " 05:00:00"*/ //#endregion
                        start: moment($scope.Data.start).add('hours' , 6).format('YYYY-MM-DD HH:mm:ss'),
                        end: moment($scope.Data.end).add('hours' , 6).format('YYYY-MM-DD HH:mm:ss')
                    }), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        swal({
                            imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif',
                            timer: 4000,
                            showConfirmButton: false,
                            background: 'rgba(100,100,100,0)'
                        });
                        $scope.resultConsultaVehiculos = response.data;
                        console.log(response);
                        if ($scope.resultConsultaVehiculos.length === 0) {
                            const toast = swal.mixin({
                                toast: true,
                                position: 'center',
                                showConfirmButton: false,
                                timer: 5000
                            });
                            toast({
                                type: 'error',
                                title: 'No existen registros en el rango de fechas seleccionado.'
                            });
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            }
        }]);
    }
}
