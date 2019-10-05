class AjaxRequest {
    static post(controllerMethod, clientId, clientNetwork, successFunc) {
        var url = window.location.toString() + controllerMethod.toString();
        $.ajax({
            url: url,
            type: 'POST',
            async: true,
            //data: dataModel,
            data: { "id": clientId, "subNetwork": clientNetwork },
            dataType: 'json',
            accept: 'application/json',
            //        contentType: "application/json; charset=utf-8",

            success: function(receivedData) {
                //удаление на клиенте
                successFunc(receivedData);
                //  var $noteContainer = $('#NoteContainer_' + id);
                //  $noteContainer.remove();
                //  processAction(ActionType.Remove, id);
                // var client = "7676";
                // var cl = client + "5665";
            },
            error: function(xhr, status, error) {
                alert(error);
            }
        });
    }

    static put(controllerMethod, oldClientId, newClientId, newClientNetwork, successFunc, clientContainerId) {
        var url = window.location.toString() + controllerMethod.toString();
        $.ajax({
            url: url,
            type: 'PUT',
            async: true,
            //data: dataModel,
            data:
            //        { "id": oldClientId, "subNetwork": oldClientNetwork, },
            {
                "client": { "id": newClientId, "subNetwork": newClientNetwork },
                "oldClientId": oldClientId
            },
            dataType: 'json',
            accept: 'application/json',
            //        contentType: "application/json; charset=utf-8",

            success: function(receivedData) {
                //удаление на клиенте
                successFunc(receivedData, clientContainerId);
                //  var $noteContainer = $('#NoteContainer_' + id);
                //  $noteContainer.remove();
                //  processAction(ActionType.Remove, id);
                // var client = "7676";
                // var cl = client + "5665";
            },
            error: function(xhr, status, error) {
                alert(error);
            }
        });
    }

    static delete(controllerMethod, clientId, clientNetwork, successFunc, clientContainerId) {
        var url = window.location.toString() + controllerMethod.toString();
        $.ajax({
            url: url,
            type: 'DELETE',
            async: true,
            //data: dataModel,
            data: { "id": clientId, "subNetwork": clientNetwork },
            dataType: 'json',
            accept: 'application/json',
            //        contentType: "application/json; charset=utf-8",

            success: function(receivedData) {
                //удаление на клиенте
                successFunc(receivedData, clientContainerId);
                //  var $noteContainer = $('#NoteContainer_' + id);
                //  $noteContainer.remove();
                //  processAction(ActionType.Remove, id);
                // var client = "7676";
                // var cl = client + "5665";
            },
            error: function(xhr, status, error) {
                alert(error);
            }
        });
    }
}