'use strict';

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var express = require('express');


class LwNodeServer {
    constructor(options) {
        this.port = options.port ? options.port : 12000;
        this.defaultRouter = options.defaultRouter ? options.defaultRouter : '/service/status';
        this.defaultRouterHandler = 'function' === typeof options.defaultRouterHandler ? options.defaultRouterHandler : this.__defaultRouterHandler;
        this.routerMap = options.routerMap ? options.routerMap : [];

        var defaultRouterItem = {
            router: this.defaultRouter,
            handler: this.defaultRouterHandler
        }

        this.routerMap.push(defaultRouterItem);
        //初始化server
        this.appInit();
        //初始化restful api
        this.applyRouter();
    }

    appInit() {
        
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(methodOverride());        

        this.app.use(function handleRequestBodySyntaxError(err, req, res, next) {

            if(err instanceof SyntaxError && 400 === err.status){
                res.status(err.status).json({
                    success: false,
                    error_code: err.status,
                    error_msg: 'Request body is bad json.'
                });
            }
            else {
                next(err);
            }
        });
    }    

    appendRouter(router, routerHandler) {
        if('function' !== typeof routerHandler) {
            throw 'routerHandler must be function.';
        }

        if(!router) {
            throw 'router is invalid.';
        }

        var routerItem = {
            router: router,
            handler: routerHandler
        }

        this.routerMap.push(routerItem);        
        this.app.post(router, routerHandler);
    }

    applyRouter() {
        var that = this;
        this.routerMap.forEach(item => {
            that.app.post(item.router, item.handler);
        });
    }

    __defaultRouterHandler(req, res) {
        var response = {
            success: true,
            error_code: 0,
            error_msg: '',
            result: {
                status: 'OK'
            }
        }

        res.send(response);
    }

    start(callback) {
        var that = this;
        this.app.listen(that.port, function(){
            if('function' === typeof callback) {
                callback();
            }
        });     
        
    }

}

module.exports = LwNodeServer;