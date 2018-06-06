"use strict";

var FoodInfoItem = function(text) {
	if (text) {
        var obj = JSON.parse(text);
        this.name = obj.name; // 发布者名称
        this.food_type = obj.food_type; // 菜系
        this.food_name = obj.food_name;// 菜品名称
        this.hard_level = obj.hard_level;// 难易程度
        this.image = obj.image;//图片
        this.main_mat = obj.main_mat;// 主料
		this.sub_mat = obj.sub_mat;// 辅料(JSON串)
		this.cook_book = obj.cook_book;//菜谱详情
        this.time = obj.time;//记录时间
		this.like_num = obj.like_num;//点赞数
		this.comm_num = obj.comm_num;//评论数
        this.from = obj.from;
        this.food_info_key = obj.food_info_key;
	} else {
	    this.name = "";
        this.food_type = "";
        this.food_name = "";
        this.hard_level="";
		this.image="";
		this.sub_mat="";
		this.main_mat="";
		this.cook_book="";
		this.time ="";
		this.like_num =0;
		this.comm_num =0;
        this.from = "";
        this.food_info_key = "";
	}
};
var CommentItem = function(text) {//评论
	if (text) {
        var obj = JSON.parse(text);
        this.id = obj.id;//id=from+'_'+时间戳
        this.food_info_key = obj.food_info_key;
        this.content = obj.content;
        this.comment_time = obj.comment_time;
        this.from = obj.from;
        this.comment_key = obj.comment_key;
	} else {
        this.id = "";
        this.food_info_key = "";
        this.content = "";
        this.comment_time = "";
        this.from = "";
        this.comment_key = "";
	}
};
var GoodItem = function(text) {//点赞记录信息
	if (text) {
        var obj = JSON.parse(text);
        this.id = obj.id;//id=from+'_'+时间戳
        this.food_info_key = obj.food_info_key;
        this.number = obj.number;
        this.record_time = obj.record_time;
        this.from = obj.from;
	} else {
        this.id = "";
        this.food_info_key = "";
        this.number = 0;
        this.record_time = "";
        this.from = "";
	}
};



CommentItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};
GoodItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

FoodInfoItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};


var FoodShare = function() {
    // 1. 先创建GoldSunStorage对象（用于存储数据）
    // 2. 定义数据结构，该行代码作用：为ApiSample创建一个属性sample_data，该属性是一个list结构，list中存储的是SampleDataItem对象
    LocalContractStorage.defineMapProperty(this, "food_info_list", {
        parse: function (text) {
            return new FoodInfoItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "food_info_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "food_info_list_array");

	 //评论列表
    LocalContractStorage.defineMapProperty(this, "comment_item_list", {
        parse: function (text) {
            return new CommentItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    // 定义一个参数，记录comment_item_list的长度
    LocalContractStorage.defineProperty(this, "comment_item_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "comment_item_list_array");
	
	
    //点赞列表
    LocalContractStorage.defineMapProperty(this, "good_item_list", {
        parse: function (text) {
            return new GoodItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    // 定义一个参数，记录good_item_list的长度
    LocalContractStorage.defineProperty(this, "good_item_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "good_item_list_array");
    // 3. 经过1和2步，数据结构定义完成，下面需要实现接口方法，所有的数据都存放在sample_data中
}
kitSys.prototype = {
    // 初始化方法，在使用ApiSample之前，务必要调用一次(而且只能调用一次)，所有的初始化逻辑都放到这里
    init: function() {
        if (this.food_info_list_size == null) {
            this.food_info_list_size = 0;
        }
		if (this.comment_item_list_size == null) {
            this.comment_item_list_size = 0;
        }
        if (this.good_item_list_size == null) {
            this.good_item_list_size = 0;
        }
    },
    // 添加一个对象到list中的例子
    add_food_info_to_list: function(text) {
        var addResult = {
            success : false,
            message : ""
        };
        var obj = text;
        obj.from = Blockchain.transaction.from;
        var result = this.query_foodinfo_by_key(obj.from+"_"+obj.time_stamp);
        if(result.success){
            addResult.success = false;
            addResult.message = "You have added a food!";
            return addResult;
        }else{
			obj.name = obj.name.trim();//名称
			obj.food_type = obj.food_type.trim();//地址
			obj.food_name = obj.food_name.trim();//攻略题目
			obj.hard_level = obj.hard_level.trim();//入住酒店
			obj.image = obj.image.trim();//图片
			obj.sub_mat = obj.sub_mat.trim();//费用
			obj.main_mat = obj.main_mat.trim();//出行天数
			obj.cook_book = obj.cook_book.trim();//攻略正文
			obj.time = obj.time.trim();//记录时间
			obj.from = obj.from.trim();
            
            if(obj.name===""|| obj.food_type===""||obj.food_name==="" || obj.cook_book === "" || obj.image == ""){
                addResult.success = false;
                addResult.message = "empty name / food_type / food_name / text / image";
                return addResult;
            }
            var food_item = new FoodInfoItem();
            food_item.name = obj.name;
            food_item.food_type = obj.food_type;
            food_item.hard_level = obj.hard_level;
            food_item.sub_mat = obj.sub_mat;
            food_item.main_mat = obj.main_mat;
            food_item.food_name = obj.food_name;
            food_item.cook_book = obj.cook_book;
            food_item.image = obj.image;
            food_item.time = obj.time;
            food_item.from = obj.from;
            food_item.food_info_key = food_item.from+"_"+ obj.time_stamp;
            var index = this.food_info_list_size;
            this.food_info_list_array.put(index,food_item.from+"_"+obj.time_stamp);
            this.food_info_list.put(food_item.from+"_"+obj.time_stamp, food_item);
            this.food_info_list_size +=1;
            addResult.success = true;
            addResult.message = "You successfully added a food!";
            return addResult;
        }
    },
	// 添加一个评论对象到list中的例子
    add_comment_to_list: function(text) {
        var addResult = {
            success : false,
            message : ""
        };
        var obj = text;
        obj.from = Blockchain.transaction.from;
		obj.id = obj.id.trim();
        obj.food_info_key = obj.food_info_key.trim();
        obj.comment_key = obj.from + "_" + obj.time_stamp;
		obj.content = obj.content.trim();
        obj.comment_time = obj.comment_time.trim();

		
		var comment = new CommentItem();
		comment.food_info_key = obj.food_info_key;
		comment.content = obj.content;
		comment.comment_time = obj.comment_time;
        comment.from = obj.from;
        comment.comment_key = obj.comment_key;
		
		var index = this.comment_item_list_size;
		this.comment_item_list_array.put(index, obj.comment_key);
		this.comment_item_list.put(obj.comment_key, comment);
		this.comment_item_list_size +=1;
		addResult.success = true;
		addResult.message = "You successfully added a comment!";
		return addResult;
    },
	

	// 添加一个对象到list中的例子
    add_like_to_list: function(text) {
        var addResult = {
            success : false,
            message : ""
        };
        var obj = text;
        obj.from = Blockchain.transaction.from;
        //这里不做查询  如果存在直接覆盖
		obj.id = obj.id.trim();
		// obj.food_info_key = obj.food_info_key.trim();
		obj.record_time = obj.record_time.trim();
        
        
        var like_cur = this.good_item_list.get(obj.food_info_key);
        if (like_cur) {
            var like_num = like_cur.number;
            like_cur.number = like_num + 1;
            this.good_item_list.put(like_cur.food_info_key, like_cur);
        } else {
            var like = new GoodItem();
            like.id = obj.id;
            like.from = obj.from;
            like.number = 1;
            like.food_info_key = obj.food_info_key;
            like.record_time = obj.record_time;
            var index = this.good_item_list_size;
            this.good_item_list_array.put(index,like.food_info_key);
            this.good_item_list.put(like.food_info_key, like);
            this.good_item_list_size +=1;
        }

		
		addResult.success = true;
		addResult.message = "You successfully added a like!";
		return addResult;
    },
	
    food_info_list_size : function(){
        return this.food_info_list_size;
    },
   
    query_my_food_list: function(){
        var from = "1";//Blockchain.transaction.from;
        return this.query_foodlist_by_id(from);
    },
	// 根据id查找列表
	query_foodlist_by_id : function(from){
        var result = {
            success : false,
            type:"food_list",
            data : []
        };
        from = from.trim();
        if(from===""){
            result.success = false;
            return result;
        }
        var number = this.food_info_list_size;
        var food_item;
        var key;
        for(var i=0;i<number;i++){
            key = this.food_info_list_array.get(i);
            food_item = this.food_info_list.get(key);
            if(food_item&&from==food_item.from){
                result.data.push(food_item);
            }
        }
        if(result.data === ""){
            result.success = false;
        }else if(result.data.length>0){
            result.success = true;
        }else{
			result.success = false;
		}
        return result;
    },
	
	//获取对象
	query_foodinfo_by_key: function(key) {
        var result = {
            success : false,
			type:"food_item_info",
            food_item : ""
        };
        key = key.trim();
        if ( key === "" ) {
            result.success = false;
            result.food_item = "";
            return result;
        }
        var food_item = this.food_info_list.get(key);
        if(food_item){
            result.success = true;
            result.food_item = food_item;
        }else{
            result.success = false;
            result.food_item = "";
        }
        return result;
    },
	//获取对象
	query_like_by_key: function(key) {
        var result = {
            success : false,
			type:"like_info",
            like : ""
        };
        key = key.trim();
        if ( key === "" ) {
            result.success = false;
            result.like = "";
            return result;
        }
		var like=this.good_item_list.get(key);
        if(like){
            result.success = true;
            result.like = like;
        }else{
            result.success = false;
            result.like = "";
        }
        return result;
    },
	query_food_list_by_page : function(searchKey,page){
        var result = {
            success : false,
            type:"food_info_list",
            data : [],
            sum : 0
        };
        var pageNum=1;
        var pageSize=10;
        if(page!=undefined&&page!=null){
            if(page.pageNum!=undefined&&page.pageNum!=null){
                pageNum=page.pageNum;
            }
            if(page.pageSize!=undefined&&page.pageSize!=null){
                pageSize=page.pageSize;
            }
        }
        var number = this.food_info_list_size;
        result.sum = number;
        var key;
        var kit;
		var dataList=[];
		for(var i=0;i<number;i++){
			 key = this.food_info_list_array.get(i);
            food_item = this.food_info_list.get(key);
			var like=this.query_like_by_key(key).like;
			if(''!=like){
				food_item.like_num=like.number;
			}else{
				food_item.like_num=0;
			}
			var page={"pageSize":90000000,"pageNum":1};
			var comm_list=this.query_comment_by_page(key,page).data;
			food_item.comm_num=comm_list.length;
			if(searchKey){
				if(food_item){
					if((food_item.food_name.indexOf(searchKey)!=-1)||(food_item.hard_level.indexOf(searchKey)!=-1)||(food_item.food_type.indexOf(searchKey)!=-1)){
                        var temp = {
                            name: food_item.name,
                            food_name: food_item.food_name,
                            time: food_item.time,
                            like_num: food_item.like_num,
                            comm_num: food_item.comm_num,
                            food_info_key: food_item.food_info_key,
                            from: food_item.from,
                            image: food_item.image,
                            cook_book: "",
                        };
                        if (food_item.cook_book.length < 180) {
                            temp.cook_book = food_item.cook_book;
                        } else {
                            // 截断处理
                            temp.cook_book = food_item.cook_book.substring(0, 180);
                            temp.cook_book = temp.cook_book + "...";
                        }
						dataList.push(temp);
					}
				}
			}else{
				var temp = {
                    name: food_item.name,
                    food_name: food_item.food_name,
                    time: food_item.time,
                    like_num: food_item.like_num,
                    comm_num: food_item.comm_num,
                    food_info_key: food_item.food_info_key,
                    image: food_item.image,
                    from: food_item.from,
                    cook_book: "",
                };
                if (food_item.cook_book.length < 180) {
                    temp.cook_book = food_item.cook_book;
                } else {
                    // 截断处理
                    temp.cook_book = food_item.cook_book.substring(0, 180);
                    temp.cook_book = temp.cook_book + "...";
                }
                dataList.push(temp);
			}
		}
		number=dataList.length;
		dataList=dataList.reverse();
        for(var i=(pageNum-1)*pageSize;i<number&&i<(pageNum*pageSize);i++){
            food_item = dataList[i];
			result.data.push(food_item);
        }
        if(result.data === ""||result.data.length<1){
            result.success = false;
        }else{
            result.success = true;
        }
        return result;
    },
	query_comment_by_page : function(keys,page){
        var result = {
            success : false,
            type:"comment_item_list",
            data : [],
            sum : 0
        };
        var pageNum=1;
        var pageSize=10;
        if(page!=undefined&&page!=null){
            if(page.pageNum!=undefined&&page.pageNum!=null){
                pageNum=page.pageNum;
            }
            if(page.pageSize!=undefined&&page.pageSize!=null){
                pageSize=page.pageSize;
            }
        }
        var number = this.comment_item_list_size;
        result.sum = number;
        var key;
        var comment;
		var dataList=[];
		for(var i=0;i<number;i++){
			key = this.comment_item_list_array.get(i);
            comment = this.comment_item_list.get(key);
			if(comment&&comment.food_info_key==keys){
				dataList.push(comment);
			}
		}
		number=dataList.length;
		dataList=dataList.reverse();
        for(var i=(pageNum-1)*pageSize;i<number&&i<(pageNum*pageSize);i++){
            
			comment = dataList[i];
			result.data.push(comment);
        }
        if(result.data === ""){
            result.success = false;
        }else{
            result.success = true;
        }
        return result;
    },
    query_food_sum : function(){
		var result = {
			success : false,
			type:"food_sum",
			sum : 0
		};
		result.sum = this.food_info_list_size;
		result.success = true;
		return result;
    },
    
	query_comment_sum : function(from){
		var result = {
			success : false,
			type:"comment_sum",
			sum : 0
		};
		var key;
		var comment;
		var num=0;
		var number = this.comment_item_list_size;
		for(var i=0;i<number;i++){
			key = this.comment_item_list_array.get(i);
			comment = this.comment_item_list.get(key);
			if(comment&&comment.food_info_key==from){
				num++;
			}
			
		}
		result.sum = num;
		result.success = true;
		return result;
    },
    
    rewardOther: function(info) {
        // {"address":"", key:""}
        var fromUser = Blockchain.transaction.from,
            value = Blockchain.transaction.value;
        var food_info = this.food_info_list.get(info.key);
        if (food_info) {
            var result = Blockchain.transfer(info.address, value);
            return result
        }

        
    },
};

// window.kitSys = kitSys;
module.exports = FoodShare;