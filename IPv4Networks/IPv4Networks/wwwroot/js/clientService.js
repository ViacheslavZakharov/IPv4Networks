class ClientService {
    static post(controllerMethod, clientId, clientNetwork, successFunc) {
        var url = window.location.toString() + controllerMethod.toString();
        $.ajax({
            url: url,
            type: 'POST',
            async: true,
            data: { "id": clientId, "subNetwork": clientNetwork },
            dataType: 'json',
            accept: 'application/json',
            success: function(receivedData) {
                successFunc(receivedData);
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
            data:
            {
                "client": { "id": newClientId, "subNetwork": newClientNetwork },
                "oldClientId": oldClientId
            },
            dataType: 'json',
            accept: 'application/json',
            success: function(receivedData) {
                successFunc(receivedData, clientContainerId);
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
            data: { "id": clientId, "subNetwork": clientNetwork },
            dataType: 'json',
            accept: 'application/json',
            success: function(receivedData) {
                successFunc(receivedData, clientContainerId);
            },
            error: function(xhr, status, error) {
                alert(error);
            }
        });
    }
}