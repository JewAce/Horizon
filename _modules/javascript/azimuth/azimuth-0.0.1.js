//-----------------------------------------------------------------------------
//                                            Copyright 2010 - Azimuth 360, LLC
//                                                        @author - Derek Adair
//                                                             @date - 9/3/2010
//-----------------------------------------------------------------------------
(function(window, $){
    window.AZIMUTH = window.$az = (function(){
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        //                                                              PRIVATE
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        var debug = true,
            version = "0.0.1",
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        //                                                               PUBLIC
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        AZIMUTH = {
            debugOn: function(){
              return debug;
            },
            getVersion: function(){
            return version;
            },
            checkType: function( obj, type ){
                if( obj === undefined ){
                    return false;
                }
                if(typeof(obj) !== type ){
                    return false
                } else {
                    return true;
                }
            },
            renderElement: function( config ){
                var htmlStr;

                if( !this.checkType( config, 'object' ) ){
                    if( this.debugOn ){
                        throw new Error("AZ-ERROR: function( config ) - config must be an object");
                    }
                    return htmlStr;
                }

                if(!this.checkType(config.type, 'string')){
                    if( this.debugOn ){
                        throw new Error("AZ-ERROR: element type must be a string");
                    }
                    return htmlStr;
                }

                switch( config.type ){
                    case "ddm":

                        if( config.data.length < 1){
                            return htmlStr;
                        }

                        htmlStr += "<select";
                        if(config.hasOwnPropety('name') && this.checkType(config.name, 'string')){
                            htmlStr += 'name="' + config.name + '" ';
                        }
                        if(config.hasOwnProperty('classSelector') && this.checkType(config.selector, 'string')){
                            htmlStr += 'class="' + config.classSelector + '" ';
                        }
                        if(config.hasOwnProperty('idSelector') && this.checkType(config.idSelector, 'string')){
                            htmlStr += 'id="' + config.idSelector + '" ';
                        }
                        htmlStr += '>';

                        for( var i = 0; i < config.data.length; i++ ){
                            /* LEFT OFF HERE!!! */
                        }

                        htmlStr += '</select>';
                        break;
                    default:
                        if( this.debugOn ){
                            throw new Error("AZ-ERROR: element type not found");
                        }
                        break;
                }
                return htmlStr;
            },
            objectFactory: function( obj ){
                if(obj === undefined && typeof obj !== "string" || typeof obj !== "object"){
                    return {};
                }
                switch( typeof( obj ) ){
                    case 'string':
                            if( this.hasOwnProperty( obj ) ){
                                return this.createObj( this[obj]() );
                            }
                        break;
                    case 'object':
                        ////
                        // return empty object if the type isn't a string
                        //                   OR no option object supplied
                        //
                        // WARNING: Built to fail if no option oboject supplied
                        ////
                        if(typeof(obj.type) !== 'string' ){
                            throw new Error('AZ-ERROR:' + obj.type + ' must be a string');
                            return {};
                        }
                        if(typeof(obj.config) !== 'object' ){
                            throw new Error('AZ-ERROR:' + obj.config + ' must be an object');
                            return {};
                        }
                        if(this.hasOwnProperty(obj.type)){
                            //same thing as $az.createObj( $az.OBJ_NAME( obj.options ) );
                            return this.createObject( this[obj.type]( obj.config ) );
                        } else {
                            if( this.debugOn ){
                                throw new Error('AZ-ERROR: ' + obj.type + ' is not a valid azimuth object');
                            }
                        }

                }

                return {};
            },
            requestObj: function( options ){
                var req = {},
                settings = {
                    ajaxOptions: {
                        type: 'POST',
                        cache: false,
                        async: true,
                        timeout: 5000
                    }
                },
                apiCallList = [],
                xmlStr = "",
                xmlComposed = false,
                responseObj,
                state,
                stateList = [
                    'INITIATING',
                    'INITIATED',
                    'EXECUTED',
                    'REQUEST_FAILED',
                    'READY',
                    'ERROR'
                ],
                stateMessage,
                callback;

                changeState("INITIATING");
                // Public Methods
                req.addApi = function( newModule, newAction, newData ){
                    var newApi = {},
                    alreadyAdded = false;

                    if(apiCallList.length > 0){
                        for(var i = 0; i<apiCallList.length; i++){
                            if( apiCallList[i].action == newAction && apiCallList[i].module == newModule ){
                                alreadyAdded = true;
                                break;
                            }
                        }
                    }
                    if( !alreadyAdded ){
                        if( newData !== undefined ){
                            newApi.dataObj = newData;
                        }
                        newApi.module = newModule;
                        newApi.action = newAction;

                        apiCallList.push( newApi );

                        xmlComposed = false;
                    }
                }

                req.removeApi = function( moduleToRemove, actionToRemove ){
                    var apiRemoved = false;

                    if( apiCallList.length > 0 ){
                        for( var i = 0; i<apiCallList.length; i++){
                            if(apiCallList[i].module == moduleToRemove && apiCallList[i].action == actionToRemove){
                                //remove the api from the requestObj
                                apiRemoved = apiCallList.splice( i, 1 );
                            }
                        }
                    }

                    if( apiRemoved ){
                        xmlComposed = false;
                    }
                }

                req.dataObj = function( newModule, newAction, requestData ){

                    if(!$az.checkType( newModule, 'string')){
                        throw new Error("AZ-ERROR: New Module must be a string");
                    }
                    if(apiCallList.length > 0){
                        for(var i = 0; i<apiCallList.length; i++){
                            if( apiCallList[i].action == newAction && apiCallList[i].module == newModule ){
                                apiCallList[i].dataObj = requestData;
                                xmlComposed = false;
                                break;
                            }
                        }
                    } else {
                        if( $az.debugOn ){
                            throw new Error('AZ-ERROR: No Api Calls in this request object');
                        }
                    }
                }

                req.execute = function(){
                    //TO-DO: must establish what this public method returns
                    if( apiCallList < 1){
                        return {};
                    }

                    if( !xmlComposed ){
                        xmlComposed = composeXML();
                    }

                    if( xmlComposed ){
                        request()
                        return {};
                    } else {
                        return {};
                    }
                }

                req.reportState = function (){
                    $az.log('--------------------' );
                    $az.log('Request Object State' );
                    $az.log('STATE:' + state );
                    if(stateMessage != undefined){
                        $az.log( 'MESSAGE: ' + stateMessage );
                    }
                    $az.log('--')
                    $az.log('apiCallList');
                    $az.log(apiCallList);
                    $az.log('--')
                    $az.log('--------------------' );
                }

                // CONFIGURE REQUEST OBJECT
                if( options !== undefined && typeof options === 'object'){

                    //CONFIGURE API CALLS
                    if( this.checkType( options.apiCallList, 'object')){
                        var newApiCallList = options.apiCallList,
                            validApiCall;
                        for(var api in newApiCallList ){
                            validApiCall = true;

                            if( !this.checkType( newApiCallList[api].module, "string")){
                                if( this.debugOn ){
                                    throw new Error("AZ-ERROR: api.module must be a string")
                                }
                                validApiCall = false;
                            }

                            if( !this.checkType( newApiCallList[api].action, "string" ) ){
                                if( this.debugOn ){
                                    throw new Error("AZ-ERROR: api.action must be a string")
                                }
                                validApiCall = false;
                            }
                            if(newApiCallList[api].hasOwnProperty('dataObj')){
                                if( !this.checkType(newApiCallList[api].dataObj, "object") ){
                                    validApiCall = false;
                                    if( this.debugOn ){
                                        throw new Error("AZ-ERROR: dataObj must be an object");
                                    }
                                }
                            }

                            if( !validApiCall ){
                                if( this.debugOn ){
                                    throw new Error("AZ-ERROR: Not a valid API call");
                                }
                            } else {
                                req.addApi( newApiCallList[api].module, newApiCallList[api].action, newApiCallList[api].dataObj );
                            }
                        }
                    }

                    // SET CALLBACKS
                    if( this.checkType( options.callback, "function" )){
                        callback = options.callback;
                    } else if( this.checkType( options.callback, "object" ) ){


                        if( this.checkType( options.callback.success, "function") && this.checkType( options.callback.fail, "function") ){
                            callback = options.callback;
                        } else if($az.debugOn) {
                            throw new Error("AZ-ERROR: callback object pair invalid");
                        }
                    }

                    if( this.checkType( options.ajaxOptions, "object" ) ){
                        $.extend( settings.ajaxOptions, options.ajaxOptions );
                    }
                }

                // Private Methods
                function changeState( newState ){
                    if( typeof newState !== "string"){
                        return false;
                    }

                    if( stateList.indexOf( newState ) !== -1 ){

                        state = newState;
                        return true;

                    } else {

                        if( this.debugOn ){
                            throw new Error('AZ-ERROR: ' + newState + 'not a valid state');
                        }
                        return false;
                    }
                }

                function request(){
                    var that = req,
                        rsp;


                    $.ajax({
                        url: './_modules/com/Neptune/model/processor.php',
                        type: settings.ajaxOptions.type,
                        cache: settings.ajaxOptions.cache,
                        async: settings.ajaxOptions.async,
                        timeout: settings.ajaxOptions.timeout,
                        dataType: 'xml',
                        data: {
                            query: xmlStr
                        },
                        error: function(){
                            state = "ERROR";
                            stateMessage = "SERVER-ERROR";

                            if( this.debugOn ){
                                that.reportState();
                            }
                        },
                        success: function( responses ){
                            responseObj = parseResponseXML( responses );
                            changeState("EXECUTED");
                            if( !$az.checkType(responseObj, 'object') || $az.UTIL.isEmptyObject( responseObj ) ){
                                changeState("ERROR");
                                stateMessage = "Server supplied no response";
                                if( $az.debugOn ){
                                    that.reportState();
                                    throw new Error("AZ-ERROR: Server supplied no response");
                                }

                                return false;
                            }

                            // Extract data returns from all responses
                            //
                            //
                            // COMMENTING OUT - THIS SHOULD BE FILTERED BEFORE IT GETS TO ME
                            //
                            //for( var ii = 0; ii < responseObj.response.length; ii++ ){
                            //    if(responseObj.response[ii].hasOwnProperty('data')){
                            //        rsp = responseObj.response[ii];
                            //        if( !responseData.hasOwnProperty( rsp.module[0] )){
                            //            responseData[ rsp.module[0] ] = {} ;
                            //        }
                            //
                            //        responseData[ rsp.module[0] ][ rsp.process[0] ] = { data: rsp.data[0], message: rsp.message[0] };
                            //    }
                            //}
                            switch( typeof(callback) ){
                                case "object":
                                    if( state == "EXECUTED" ){
                                        if( responseObj.response[0].result[0] != "FATAL" ){
                                            if($az.checkType( callback.success, "function")){
                                                callback.success.call( that.context, responseObj )
                                            }
                                        } else {
                                            if( $az.checkType( callback.fail, "function" ) ){

                                                callback.fail.call( that.context, responseObj );
                                            }
                                        }

                                    } else if ( $az.debugOn ){

                                        throw new Error("AZ-ERROR: request failed");
                                    }
                                    break;
                                case "function":
                                    callback.call( that.context, responseObj );
                                    break;
                                default:
                                    if($az.debugOn){
                                        throw new Error("AZ-ERROR: Callback is not valid");
                                    }
                                    break;
                            }

                            // response not blatantly false
                            return true;
                        }
                    });
                }

                function composeXML(){
                    if(apiCallList.length < 1){
                        return false;
                    }
                    xmlStr = "<requests>";
                    for( var i = 0; i < apiCallList.length; i++ ){

                        xmlStr += "<request>" +
                        "<module>" + apiCallList[i].module + "</module>" +
                        "<action>" + apiCallList[i].action + "</action>";
                        if(apiCallList[i].hasOwnProperty('dataObj')){
                            xmlStr += "<data>" + composeDFS( apiCallList[i].dataObj ) + "</data>";
                        }

                        xmlStr += "</request>";
                    }
                    xmlStr += "</requests>";

                    return true;
                }

                function composeDFS(obj, parentName){
                    var xmlStr = "",
                    tagName;



                    if( typeof( obj ) != "string" ){

                        for(var prop in obj){

                            if(typeof( prop ) == "number")
                            {
                                tagName = parentName.substr(0, parentName.length - 1);
                            } else {
                                tagName = prop;
                            }
                            xmlStr += ("<" + tagName + ">" + composeDFS( obj[prop], prop ) + "</" + tagName + ">");
                        }

                    }

                    if(!xmlStr.length){
                        xmlStr = $az.UTIL.urlEncode( obj );
                    }

                    return xmlStr;
                }
                function parseResponseXML(response){
                    for(var i=0; i < response.childNodes.length; i++){
                        if (response.childNodes[i].nodeType == 1)
                        {
                            return responseDFS(response.childNodes[i]);
                        }
                    }

                    //return empty obj if there is nothing in the response
                    return {};
                }
                function responseDFS( data ){
                    var obj = {};
                    var dataHasElementChildren = false;

                    for (var i=0; i < data.childNodes.length; i++){
                        if (data.childNodes[i].nodeType == 1){
                            dataHasElementChildren = true;
                        } else if (data.childNodes[i].nodeType != 3) {
                            return;
                        }
                    }

                    if(dataHasElementChildren){
                        for ( var j = 0; j < data.childNodes.length; j++ )
                        {
                            if (data.childNodes[j].nodeType==1)
                            {
                                /*  THIS WILL BE THE NEW PARSING METHOD - [0]'s will no longer be required
                                                         as I will be using objects instead of
                                                         array's

                                                         EXTENSEIVE TESTING NEEDED!!!

                               if(obj[data.childNodes[i].nodeName] == undefined || obj[data.childNodes[i].nodeName] == null){
                                  obj[data.childNodes[i].nodeName] = new Object();
                               }

                               obj[data.childNodes[i].nodeName] = responseDFS(data.childNodes[i]);
                               */

                                if(obj[data.childNodes[j].nodeName] == undefined || obj[data.childNodes[j].nodeName] == null){
                                    obj[data.childNodes[j].nodeName] = [];
                                }

                                obj[data.childNodes[j].nodeName].push(responseDFS(data.childNodes[j]));
                            }
                        }
                    } else {
                        if(data.childNodes[0] != null){
                            obj = data.childNodes[0].nodeValue.urlDecode();
                        } else {
                            obj = "EMPTY";
                        }
                    }

                    return obj;
                }



                changeState("INITIATED");

                return req;
            },
            debugState: function(){
                return this.debug;
            },
            createObject: function ( o ) {
                function F() {}
                F.prototype = o;
                return new F();
            },
            // AZIMUTH utilities
            UTIL: {
                assert: function( pass, msg ){
                    var type = pass ? "PASS" : "FAIL";
                    this.log( type + " | " + msg );
                },
                isEmptyObject: function( obj ) {
                    for ( var name in obj ) {
                        return false;
                    }
                    return true;
                },
                urlEncode: function ( url ) {
                    return encodeURIComponent( url );
                },
                urlDecode: function ( url ) {
                    return decodeURIComponent(url.replace(/\+/g, ' '));
                },
                getUrlVars: function(){
                    var vars = [],
                    hash,
                    hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

                    for(var i = 0; i < hashes.length; i++)
                    {
                        hash = hashes[i].split('=');
                        vars.push( hash[0] );
                        vars[hash[0]] = hash[1];
                    }
                    return vars;
                },
                getUrlVar: function( name ){
                    return this.UTIL.getUrlVars()[name];
                }
            },
            log: function azLog( msg ){
                if( window.console && window.console.log && typeof window.console.log === "function"){
                    if(msg !== undefined){
                        console.log(msg);
                    } else {
                        console.log('AZ-ERROR: message in $az.log must have a value');
                    }
                }
            }
        };
        return AZIMUTH;
    })();
})( window, jQuery );