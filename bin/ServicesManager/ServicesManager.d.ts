/// <reference types="node" />
import events = require('events');
import { RegisteredService } from './RegisteredService';
import { ServiceModule } from "../ServiceModule/ServiceModule";
import { ServicesManagerConfig } from "./ServicesManagerConfig";
/**
 * 服务管理器
 *
 * @export
 * @class ServicesManager
 * @extends {events.EventEmitter}
 */
export declare class ServicesManager extends events.EventEmitter {
    private _isStarted;
    private static _servicesManagerCreated;
    /**
     * ServicesManager 的名称，默认是类名。
     */
    readonly name: string;
    /**
     * 注册的服务列表。(服务只应当通过registerService来进行注册)
     */
    readonly _services: RegisteredService[];
    constructor(config?: ServicesManagerConfig);
    /**
     * 启动所有注册的服务。按照注册的先后顺序来启动服务。先注册的服务先启动。
     * 如果启动过程中某个服务出现异常，则后面的服务则不再被启动，之前启动过了的服务也会被依次关闭（按照从后向前的顺序）。
     * 启动结束后会触发started事件
     *
     * @memberof ServicesManager
     */
    start(): void;
    /**
     * 关闭所有已启动的服务。先注册的服务最后被关闭。当所有服务都被关闭后程序将会被退出。
     * 当所有服务都停止后出发stopped事件
     *
     * @param exitCode 程序退出状态码。 1是系统错误 2是用户ServiceModule的onError发出的‘stop’信号
     */
    stop(exitCode?: number): void;
    /**
     * 注册服务
     *
     * @param {ServiceModule} serviceModule 服务模块实例
     * @memberof ServicesManager
     */
    registerService(serviceModule: ServiceModule): void;
    /**
     * 服务运行过程中的错误处理方法。服务启动或关闭过程中产生的错误不会触发该方法。
     *
     * @param {Error} err
     * @param {ServiceModule} service 发生错误的服务实例
     * @memberof ServicesManager
     */
    onError(err: Error, service: ServiceModule): void;
}