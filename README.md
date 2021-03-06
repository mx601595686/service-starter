# service-starter
标准化 `JavaScript` 程序的结构体系。提供一个通用的启动和关闭程序的方式。兼容 `Docker`。使用 `TypeScript` 编写。

## 安装
```
npm i service-starter && npm i @types/component-emitter -D
```

## 程序结构
一个容器是由一个 `ServiceManager` 和多个 `ServiceModule` 所组成的。

### ServicesManager
一个进程之中只能允许实例化一个`ServiceManager`（[API](src/Base/BaseServiceManager.ts)）。该类负责：
* 按照服务注册的顺序来启动服务
* 响应容器的健康检查
* 按照服务注册相反的顺序来关闭服务
* 打印服务启动和关闭的过程
* 优雅处理程序未捕获异常（发生异常后，先依次停止服务，再退出程序）
* 处理系统退出信号，收到退出信号后，先依次停止服务，再退出程序
* 提供了 `onError` 回调，用户可以自定义运行时错误处理方式

### ServiceModule
规范了一个服务的基本结构（[API](src/Base/ServiceModule.ts)）

### Docker
在该项目docker文件夹下提供了一个[Dockerfile](src/Docker/demo.dockerfile)基础配置模板
