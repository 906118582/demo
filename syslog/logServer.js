/*
 * @Author: your name
 * @Date: 2022-01-13 15:14:16
 * @LastEditTime: 2022-01-14 15:39:13
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \syslog\logServer.js
 */
const SyslogServer = require("syslog-server")
const iconv = require('iconv-lite')
const mongoose = require('mongoose')
const chinaTime = require('china-time');
const server = new SyslogServer()

//连接数据库
mongoose.connect('mongodb://10.14.3.7:27017/USERDATA', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
    })
    //定义集合的模板Schema
    let Log_DataSchema = mongoose.Schema({
        Name:String,
        Ip:{
            type:String,
            default:null
        },
        Level:{
            type:String,
            default:null
        },
        Message:{
            type:String,
            default:null
        },
        Protocol:{
            type:String,
            default:null
        }
    })

    //mongoose在创建model时会自动添加“s”,给model传入第三个参数，同第一个表名即可（大坑）
    let MD_data = mongoose.model('LogData',Log_DataSchema,'LogData') 
    
    //syslog服务端
    server.on("message", (value) => {
        let finalValue = {
            date: value.date,
            host: value.host,
            protocol: value.protocol,
            message: bufferData(value.message)
        }
        addData(finalValue.message)
        console.log(finalValue.message)
    });
    
    server.start()

    //Buffer转成简体中文方法
    function bufferData(data) {
        return iconv.decode(Buffer.from(data),'cp936')
    }

//增加函数
function addData(value){
    let add = new MD_data(value)
    add.save((err) => {
        if(err) {
            console.log(err);
            return;
        }else {
            console.log('添加成功');
        }
    })
}