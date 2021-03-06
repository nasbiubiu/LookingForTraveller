

'use strict';

var dappAddress = "n1pCvXL4KiCTvWcAc6TcX6LrpURRZFuV4oT";
// var dappAddress = "n1skDiY9YgdM5o6fxyjMefd2vXX1kPCSY6j";

var clickZanObj = null;
var zanNum = 0;
var kitShow = function() {
    this.clickZanObj = null;
    this.zanNum = 0;
}
kitShow.prototype = {

    init: function() {
        var self = this;
		var searchKey=UrlParm.parm("key");  
		if(searchKey){
			$("#search_input").val(searchKey);
		}
        self.initkitList();
    },
    initkitList:function(){
        var page={"pageSize":9,"pageNum":1};
        //this.showkitList(page,searchKey);
        this.showkitSum();
    },

    initZan: function() {
        var self = this;
        $(".js_click_zan").click(function() {
            var key = $(this).attr("data-key");
            zanNum = $(this).find("p").text().trim();
            zanNum = parseInt(zanNum);
            var kit_topic = $(this).attr("data-topic");
            var recordTime = getNowFormatDate();
            
            // 提交
            var func = "add_like_to_list";
            var req_arg_item = {
                "kitKey": key,
                "id": kit_topic,
                "recordTime":recordTime
            };
            var req_args = [];
            req_args.push(req_arg_item);
    
            window.postMessage({
                "target": "contentscript",
                "data":{
                    "to" : dappAddress,
                    "value" : "0",
                    "contract" : {
                        "function" : func,
                        "args" : JSON.stringify(req_args),
                    }
                },
                "method": "neb_sendTransaction"
            }, "*");

            clickZanObj = $(this);
        });
    },

    refreshLikeNumAfterClick: function() {
        var curZanNum = zanNum + 1;
        clickZanObj.find("p").html("&nbsp;&nbsp;&nbsp;" + curZanNum);
        zanNum = 0;
    },

    showkitSum:function(){
        var req_args = [];
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_kit_sum",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
    },
    showkitList:function(page,searchKey){
        var req_args = [];
        req_args.push(searchKey,page);
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_kit_by_page",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
    },
    listenWindowMessage: function() {
        var self = this;
        window.addEventListener('message', function(e) {
            if(!!e.data.data.txhash){
                window.setTimeout(self.refreshLikeNumAfterClick, 10000);
            }
            // e.detail contains the transferred data
            if(e.data && e.data.data && e.data.data.neb_call) {
                // 收到返回数据
                if(e.data.data.neb_call.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_call.result);
                    if (obj.type == "kit_list") {
                        self.parsekitInfo(obj);
                    } else if (obj.type == "kit_sum") {
                        self.parsekitSum(obj);
                    } else if (obj.type == "kit_list_like") {
                        self.parsekitlike(obj);
                    } else {
                        console.log("no need attation");
                    }
                    console.log(obj);
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    parsekitlike: function(kit_list) {
        if (kit_list.data.length != 0) {
            for(var i=0;i<kit_list.length;i++){
				$("#image"+i).attr("src",kit_list[i].image);
			}
        } else {
            $("#kit_warning").hide();
            $("#kit_list").empty().show();
            // 显示内容
            var kits = template(document.getElementById('kit_list_t').innerHTML);
            var kits_html = kits({list: kit_list.data});
            $("#kit_list").append(kits_html);
        }

    },
	parsekitInfo: function(kit_list) {
        $("#loading_list").hide();
        $("#kit_list").show();
        $("#list_pagination").show();

        $("#loading_list_fenye").hide();
        $("#list_content").show();
        
        if (kit_list.data.length == 0) {
            $("#kit_list").hide();
            $("#kit_warning").show();
        } else {
            $("#kit_warning").hide();
            $("#kit_list").empty().show();
            // 显示内容
            var kits = template(document.getElementById('kit_list_t').innerHTML);
            var kits_html = kits({list: kit_list.data});
            $("#kit_list").append(kits_html);
        }

        this.initZan();

    },
    parsekitSum: function(obj) {
        paginationObj.init(obj.sum);
        paginationObj.showPagination(); 
    },
}

var kitObj=new kitShow();

function checkNebpay() {
    if(typeof(webExtensionWallet) === "undefined"){
        alert ("程序依赖于Extension wallet，请先安装后再使用，谢谢！")
        // $("#noExtension").removeClass("hide")
    }

    // 环境ok，拉取数据
    kitObj = new kitShow();
    kitObj.listenWindowMessage();
    kitObj.init();
    
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
    month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
    return currentdate;
}



function initPage() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        $("#kit_list").hide();
        $("#list_pagination").hide();
        $("#loading_list").show();

        $("#list_content").hide();
        $("#loading_list_fenye").show();
        
        setTimeout(checkNebpay,1000);
    });
}

initPage();
  
var SHOW_NUM_PER_PAGE = 9;

var Pagination = function() {
    this.list_index = [];
    this.page_size = SHOW_NUM_PER_PAGE;
    this.showGoInput = true;
    this.showGoButton = true;
};

Pagination.prototype = {
    // 初始化
    init: function(totalNum) {
        this.list_index=[];
        for(var i = 1; i <= totalNum; i++) {
            this.list_index.push(i);
        }
    },

    // 显示分页插件
    showPagination: function() {
        var self = this;
        $('#pagination').pagination({
            dataSource: this.list_index,
            pageSize: this.page_size,
            showGoInput: true,
            showGoButton: true,
            callback: function(data, pagination) {
                var click_page_num = pagination.pageNumber;
                var list_offset = data[0];
                self.onChoosePageEvent(click_page_num, list_offset);
            }
        });
    },

    // 选择页事件
    onChoosePageEvent: function(click_page_num, list_offset) {
        console.log("click_page_num = " + click_page_num + "; list_offset=" + list_offset);
        var page={
            "pageSize":this.page_size,
            "pageNum":click_page_num
        };
		var searchKey=UrlParm.parm("key");  
        kitObj.showkitList(page,searchKey);
    },
}

var paginationObj = new Pagination();