function myFunction(path) {  
    URL = "/Folder";    
    console.log(URL);      
    $.ajax({
        url: URL,
        type: 'GET',
        cache: false,
        data: { 
            fldr: path                    
        },
        dataType: "json",
        success: function (JSON) {  
            resstr = "";
            if(path != ''){
                var cdi = document.getElementById("cd").innerHTML;
                if(path.length > cdi.length ){
                    resstr += '<li class="list-group-item fld" id = "';
                    resstr +=  cdi + '" >..</li>';
                }
                else{
                    cdi = path.substring(0 , path.lastIndexOf("/") );
                    if(cdi == '' && path.length > 1){
                        cdi = '/';
                    }
                    resstr += '<li class="list-group-item fld" id = "';
                    resstr +=  cdi + '" >..</li>';
                }
            }                  
            $.each(JSON.Results, function (inx) {  
                resstr += '<li class="list-group-item';
                if(this.fld){
                    resstr += " fld ";
                    resstr += '" id = "';
                    resstr += this.path + '" >';
                }
                else {
                    resstr += " fl ";
                    resstr += '" id = "';
                    resstr += this.name + '" >';
                }
                
                resstr += this.name + "</li>";                        
            });
            document.getElementById("cnts").innerHTML = resstr;
            document.getElementById("cd").innerHTML = path;
            setCallbacks();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("$.ajax error: " + xhr.status + " " + thrownError);
        }  
    });
}

function myFlFunction(fileName) {             
    
    $.fileDownload(document.getElementById("cd").innerHTML + "/" + fileName)
        .done(function () { alert('File download a success!'); })
        .fail(function () { alert('File download failed!'); });
    
}

function myUploadFile() {          
    var fd = new FormData();   
    var fpath =  document.getElementById("file").files[0]; 
    fd.append( 'cd', document.getElementById("cd").innerHTML );
    fd.append( 'file', fpath );    
    $.ajax({
        url:  "/flupld",
        type: 'POST',  
        data: fd,
        processData: false,
        contentType: false,
        success: function (data) {  
            myFunction(document.getElementById("cd").innerHTML);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("$.ajax error: " + xhr.status + " " + ajaxOptions + thrownError);
        },
        timeout: 5000  
    });
    
}

function myNewFolder() {           
    
    $.ajax({
        url: "/nwfld",
        type: 'POST',
        cache: false,
        data: { 
            nfldr: document.getElementById("path").value,
            fldr: document.getElementById("cd").innerHTML                    
        },
        dataType: "json",
        success: function (data) {  
            myFunction(document.getElementById("cd").innerHTML);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("$.ajax error: " + xhr.status + " " + thrownError);
        }  
    });
    
}

function setCallbacks(){
    var buttons = document.getElementsByClassName("fld");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click',  myFunction.bind(this,buttons[i].id));
    } 
    
    var flbuttons = document.getElementsByClassName("fl");

    for (var i = 0; i < flbuttons.length; i++) {
        flbuttons[i].addEventListener('click',  myFlFunction.bind(this,flbuttons[i].id));
    }    
    
    document.getElementById("file").value = null;

    if(document.getElementById("cd").innerHTML != ''){
        document.getElementById("ufb").disabled = false;
        document.getElementById("nfb").disabled = false;
        document.getElementById("file").disabled = false;

        document.getElementById("ufb").addEventListener('click',  myUploadFile);
        document.getElementById("nfb").addEventListener('click',  myNewFolder);
    }
    else{
        document.getElementById("ufb").disabled = true;
        document.getElementById("nfb").disabled = true;
        document.getElementById("file").disabled = true;
    }
}

window.onload = setCallbacks();