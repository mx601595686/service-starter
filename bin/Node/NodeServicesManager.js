"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseServicesManager_1 = require("../common/BaseServicesManager");
const RunningStatus_1 = require("../common/RunningStatus");
const log_formatter_1 = require("log-formatter");
/**
 * 在BaseServicesManager的基础上添加了全局未捕获异常处理，退出信号控制。
 * 通过process.on('message')的方式进行健康检查（发送__ss__healthCheck调用健康检查，
 * { isHealth: boolean, description: string, type='healthCheck' }返回检查结果）。
 *
 * @export
 * @class NodeServicesManager
 * @extends {BaseServicesManager}
 */
class NodeServicesManager extends BaseServicesManager_1.BaseServicesManager {
    constructor(_config = {}) {
        super();
        this._config = _config;
        process.on('unhandledRejection', this.onUnHandledException.bind(this));
        process.on('uncaughtException', this.onUnHandledException.bind(this));
        let forceClose = false; //用于标记是否强制退出程序
        const signalClose = () => {
            if (this.status !== RunningStatus_1.RunningStatus.stopping) {
                if (this.status === RunningStatus_1.RunningStatus.stopped) {
                    process.exit();
                }
                else {
                    this.stop();
                }
            }
            else {
                if (forceClose === false) {
                    log_formatter_1.default.noTime.title.text.gray('正在停止程序，请稍后。。。', '（如果要强制退出，请在3秒钟之内再次点击）');
                    forceClose = true;
                    setTimeout(() => forceClose = false, 3000);
                }
                else {
                    process.exit();
                }
            }
        };
        process.on('SIGTERM', () => {
            if (_config.stopOnHaveSIGTERM !== false) {
                signalClose();
            }
        });
        process.on('SIGINT', () => {
            if (_config.stopOnHaveSIGINT !== false) {
                signalClose();
            }
        });
        if (process.connected) {
            const listener = async (message) => {
                if (message === '__ss__healthCheck') {
                    const result = await this.healthCheck();
                    result.type = 'healthCheck';
                    process.send && process.send(result);
                }
            };
            process.on('message', listener);
            process.once('disconnect', () => {
                process.removeListener('message', listener);
            });
        }
        if (_config.exitAfterStopped !== false)
            this.on('stopped', code => process.exit(code));
    }
    onError(errName, err, service) {
        super.onError(errName, err, service);
        if (this._config.stopOnError === true) {
            if (this.status !== RunningStatus_1.RunningStatus.stopping) {
                if (this.status === RunningStatus_1.RunningStatus.stopped) {
                    process.exit(1);
                }
                else {
                    this.stop(1);
                }
            }
        }
    }
    onUnHandledException(err) {
        super.onUnHandledException(err);
        if (this._config.stopOnUnHandledException !== false) {
            if (this.status !== RunningStatus_1.RunningStatus.stopping) {
                if (this.status === RunningStatus_1.RunningStatus.stopped) {
                    process.exit(1);
                }
                else {
                    this.stop(1);
                }
            }
        }
    }
}
exports.NodeServicesManager = NodeServicesManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5vZGUvTm9kZVNlcnZpY2VzTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVFQUFvRTtBQUVwRSwyREFBd0Q7QUFDeEQsaURBQWdDO0FBRWhDOzs7Ozs7OztHQVFHO0FBQ0gseUJBQWlDLFNBQVEseUNBQW1CO0lBQ3hELFlBQTZCLFVBQXFDLEVBQUU7UUFDaEUsS0FBSyxFQUFFLENBQUM7UUFEaUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0M7UUFHaEUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFdEUsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUssY0FBYztRQUMxQyxNQUFNLFdBQVcsR0FBRztZQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLDZCQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLHVCQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO29CQUNyRSxV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QztnQkFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBakZELGtEQWlGQyIsImZpbGUiOiJOb2RlL05vZGVTZXJ2aWNlc01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOb2RlU2VydmljZXNNYW5hZ2VyQ29uZmlnIH0gZnJvbSAnLi9Ob2RlU2VydmljZXNNYW5hZ2VyQ29uZmlnJztcclxuaW1wb3J0IHsgQmFzZVNlcnZpY2VzTWFuYWdlciB9IGZyb20gJy4uL2NvbW1vbi9CYXNlU2VydmljZXNNYW5hZ2VyJztcclxuaW1wb3J0IHsgQmFzZVNlcnZpY2VNb2R1bGUgfSBmcm9tICcuLi9jb21tb24vQmFzZVNlcnZpY2VNb2R1bGUnO1xyXG5pbXBvcnQgeyBSdW5uaW5nU3RhdHVzIH0gZnJvbSAnLi4vY29tbW9uL1J1bm5pbmdTdGF0dXMnO1xyXG5pbXBvcnQgbG9nIGZyb20gJ2xvZy1mb3JtYXR0ZXInO1xyXG5cclxuLyoqXHJcbiAqIOWcqEJhc2VTZXJ2aWNlc01hbmFnZXLnmoTln7rnoYDkuIrmt7vliqDkuoblhajlsYDmnKrmjZXojrflvILluLjlpITnkIbvvIzpgIDlh7rkv6Hlj7fmjqfliLbjgIJcclxuICog6YCa6L+HcHJvY2Vzcy5vbignbWVzc2FnZScp55qE5pa55byP6L+b6KGM5YGl5bq35qOA5p+l77yI5Y+R6YCBX19zc19faGVhbHRoQ2hlY2vosIPnlKjlgaXlurfmo4Dmn6XvvIxcclxuICogeyBpc0hlYWx0aDogYm9vbGVhbiwgZGVzY3JpcHRpb246IHN0cmluZywgdHlwZT0naGVhbHRoQ2hlY2snIH3ov5Tlm57mo4Dmn6Xnu5PmnpzvvInjgIJcclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIE5vZGVTZXJ2aWNlc01hbmFnZXJcclxuICogQGV4dGVuZHMge0Jhc2VTZXJ2aWNlc01hbmFnZXJ9XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTm9kZVNlcnZpY2VzTWFuYWdlciBleHRlbmRzIEJhc2VTZXJ2aWNlc01hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfY29uZmlnOiBOb2RlU2VydmljZXNNYW5hZ2VyQ29uZmlnID0ge30pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCB0aGlzLm9uVW5IYW5kbGVkRXhjZXB0aW9uLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgdGhpcy5vblVuSGFuZGxlZEV4Y2VwdGlvbi5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcmNlQ2xvc2UgPSBmYWxzZTsgICAgIC8v55So5LqO5qCH6K6w5piv5ZCm5by65Yi26YCA5Ye656iL5bqPXHJcbiAgICAgICAgY29uc3Qgc2lnbmFsQ2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyAhPT0gUnVubmluZ1N0YXR1cy5zdG9wcGluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBSdW5uaW5nU3RhdHVzLnN0b3BwZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2VDbG9zZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2cubm9UaW1lLnRpdGxlLnRleHQuZ3JheSgn5q2j5Zyo5YGc5q2i56iL5bqP77yM6K+356iN5ZCO44CC44CC44CCJywgJ++8iOWmguaenOimgeW8uuWItumAgOWHuu+8jOivt+WcqDPnp5Lpkp/kuYvlhoXlho3mrKHngrnlh7vvvIknKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3JjZUNsb3NlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGZvcmNlQ2xvc2UgPSBmYWxzZSwgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJvY2Vzcy5vbignU0lHVEVSTScsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKF9jb25maWcuc3RvcE9uSGF2ZVNJR1RFUk0gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBzaWduYWxDbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKF9jb25maWcuc3RvcE9uSGF2ZVNJR0lOVCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHNpZ25hbENsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHByb2Nlc3MuY29ubmVjdGVkKSB7IC8v5YGl5bq35qOA5p+lXHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gYXN5bmMgKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdfX3NzX19oZWFsdGhDaGVjaycpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IGF3YWl0IHRoaXMuaGVhbHRoQ2hlY2soKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQudHlwZSA9ICdoZWFsdGhDaGVjayc7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5zZW5kICYmIHByb2Nlc3Muc2VuZChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBwcm9jZXNzLm9uKCdtZXNzYWdlJywgbGlzdGVuZXIpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLm9uY2UoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfY29uZmlnLmV4aXRBZnRlclN0b3BwZWQgIT09IGZhbHNlKVxyXG4gICAgICAgICAgICB0aGlzLm9uKCdzdG9wcGVkJywgY29kZSA9PiBwcm9jZXNzLmV4aXQoY29kZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRXJyb3IoZXJyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkLCBlcnI6IEVycm9yLCBzZXJ2aWNlOiBCYXNlU2VydmljZU1vZHVsZSkge1xyXG4gICAgICAgIHN1cGVyLm9uRXJyb3IoZXJyTmFtZSwgZXJyLCBzZXJ2aWNlKTtcclxuICAgICAgICBpZiAodGhpcy5fY29uZmlnLnN0b3BPbkVycm9yID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyAhPT0gUnVubmluZ1N0YXR1cy5zdG9wcGluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBSdW5uaW5nU3RhdHVzLnN0b3BwZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblVuSGFuZGxlZEV4Y2VwdGlvbihlcnI6IEVycm9yKSB7XHJcbiAgICAgICAgc3VwZXIub25VbkhhbmRsZWRFeGNlcHRpb24oZXJyKTtcclxuICAgICAgICBpZiAodGhpcy5fY29uZmlnLnN0b3BPblVuSGFuZGxlZEV4Y2VwdGlvbiAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzICE9PSBSdW5uaW5nU3RhdHVzLnN0b3BwaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFJ1bm5pbmdTdGF0dXMuc3RvcHBlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
