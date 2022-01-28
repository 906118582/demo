const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chinaTime = require('china-time');

mongoose.connect('#', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
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

//express配置post和get

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//域控后端传回接口
app.post('/DomainNameData', (req, res) => {
    // if(req.body.data.type == "add" && req.body.data.password !== "A123456a") {
    //     let tempObj = {
    //         Name:req.body.data.name,
    //         JobNumber:req.body.data.user,
    //         Time:newTime()
    //     }
    //     addData(tempObj);
    //     // imapNodemailer(tempObj.JobNumber).catch(console.error); //运行imapNodemailer函数并回调错误信息
    //     res.send('mongo已接收')
    // }else {
    //     res.send('删除或兼职账号指令我不会执行')
    // }
    console.log(req.data)
    
    
})

//资产页面接口
app.post('/', async (req, res) => {
    let on_off = await findName(req.body.Name)
    if(!on_off) {
        updateData(req.body.Name,req.body)
        //返回成功页面
        res.sendFile('C:\\python\\Python37-32\\Lib\\site-packages\\django\\bin\\cy_yunwei\\templates\\zhihu-sussces-template\\sussces.html')    
    }else{
    //返回失败页面
    res.sendFile('C:\\python\\Python37-32\\Lib\\site-packages\\django\\bin\\cy_yunwei\\templates\\zhihu-404-template\\error.html')
}
});

//查询主机编号为闲置资产函数
 function findHost() { 
   MD_data.find({"HostNumber":'default',},(err,doc) => {
        if(err) {
            console.log(err);
            return;
        }else {
            for(let key of doc) {
                if(key.JobNumber != null || ""){
                    console.log(key.JobNumber)
                    setTimeout(() => {
                        // imapNodemailer(key.JobNumber)
                    },3000)
                }else {
                    console.log('未发现资产为空员工')
                    return
                }
            }
        }
    })
}
//验证数据库是否有表单输入的姓名

async function findName(userName) {
    let off = true
    await MD_data.find({Name:userName}, (err,doc) => {
    for(let key of doc){
        console.log(key.Name)
        if(key.Name){
            off = false
            return
        }else {
            console.log('错误:没有查到此人员')
            return
        }
    }
    })
    return off
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


//更新函数(upsert以更新条件为基础，如果查到相同的Name值，则将对应值整个集合更新，如果查不到对应数据，那么则以更新条件新增一条数据！)
function updateData(value,req){
    MD_data.updateOne({"Name": value},{"$set":req},{upsert:true},(err,doc) => {
        if(err) {
            console.log(err);
            return;
        }else {
            console.log(doc);
        }
    })
}

app.listen(5201, () => {
    console.log('HTTP服务端启动,端口为5201')
})


//当前时间函数
    
function newTime() {
    return chinaTime('YYYY/MM/DD HH:mm')
}

setInterval(() => {
    findHost();
}, 360*60000);
 