/**
 * This is the client of the websocket
 * It opens the connections with the server to receive whatever messages that is received then notify the AJAX request to retrieve the information
 */
var trigger = "updateContent";

$(document).ready(function(){    
    host = "localhost:8000";
    conn = new WebSocket("ws://"+host+"/");
    conn.onmessage = function(evt) {
        // Make an Ajax call to the server to update the content
        if (evt.data == "update"){
            // Call the trigger function when there is an update
            window[trigger]();
        }
    };

    conn.onerror = function() {
    };

    conn.onclose = function() {
        conn = false;
    };

    conn.onopen = function() { 
        //        alert("You are connected");
        postMessage("You are connected");
    };  
    
    /**
     * Handle keypress Enter of the input inserted-content
     */
    $("#inserted-content").keypress(function(key){
        if (key.which == '13'){
            postMessage("Enter is pressed");
            var newContent = $(this).val();
            if (newContent!=""){
                conn.send("new message");
                // Make an AJAX call to the server to submit the content
                $.ajax({
                    type: "POST",
                    url: "/phpserver/pages/add/"+newContent,
                    data: [],
                    success: function(data){
                        if (data.res == "false"){
                            alert("Message can't be saved on the server");
                        }
                        postMessage("Sent successfully");
                    }
                });
            }
        }
    });
});

function postMessage(msg){
    $("#log").append('<p>'+msg+'</p>')
}

function updateContent()
{
    $.ajax({
        type: "POST",
        url: "/phpserver/pages/get",
        data: [],
        error: function(qXHR, textStatus, errorThrown){
            postMessage("There is an error while sending");
        },
        success: function(data){
            if (data.res == "true"){
                postMessage(data.data);
            }

            postMessage("Update new message");
        }
    });
}