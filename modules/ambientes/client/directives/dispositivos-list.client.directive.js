(function () {
  'use strict';

  // Ambientes controller
  angular
    .module('ambientes')
    .directive('dispositivosList', ['AmbientesService', 'DispositivosService', 'Notify', function(AmbientesService, DispositivosService, Notify) {

      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/ambientes/client/views/list-dispositivos.client.template.html',
        link: function(scope, element, attrs) {

          // quando adicionado um dispositivo, atualiza o ambiente, consequentemente a lista de dispositivos.
          Notify.getMsg('AtualizarAmbiente', function(event, data) {
            scope.vm.ambiente = AmbientesService.get(
              { ambienteId: data.id }
            );
          });

          Notify.getMsg('AtualizarDispositivo', function(event, data) {
            for (var i = scope.vm.ambiente.dispositivos.length - 1; i >= 0; i--) {
              if (scope.vm.ambiente.dispositivos[i]._id === data.id) {
                scope.vm.ambiente.dispositivos[i] = DispositivosService.get({ dispositivoId: data.id });
              }
            }
          });

        }
      };
    }]);

}());
