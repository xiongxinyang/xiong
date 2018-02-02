var dGridObj = {};
var initOptions=[];
(function($){

     initOptions = [
       /* {	// 轨迹表格配置:去掉油位(60),电子速度 (km/h)(120),详细信息(150),补偿数据(80),
            tableId:'gridbox',
            header:'序号,车牌号,车牌颜色,机构名称,纬度,经度,GPS速度(km/h),方向,里程(KM),时间,位置',
            colTypes:'ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro',
            initWidths:'60,80,80,150,80,80,100,80,80,150,350',
            align:'left,left,left,left,left,left,left,left,left,left,left',
            addressInfo:[{idx:10,lng:5,lat:4}]
        }*/
         {	// 轨迹表格配置:去掉油位(60),电子速度 (km/h)(120),详细信息(150),补偿数据(80),
             tableId:'gridbox',
             header:'序号,车牌号,纬度,经度,GPS速度(km/h),方向,时间',
             colTypes:'ro,ro,ro,ro,ro,ro,ro',
             initWidths:'60,80,80,80,150,80,150',
             align:'left,left,left,left,left,left,left',
             addressInfo:[{idx:10,lng:5,lat:4}]
         }
        ,{	// 行驶段表格配置:去掉油位变化(100),启动地点(400),途经地点(400),停止地点(400)
            tableId:'runTrackTable2',
            header:'序号,启动时间,停止时间,开车里程数(km),停车里程数(km),累计里程数(km),行驶时长,行驶里程数(km),启动经度,启动纬度,停止经度,停止纬度',
            colTypes:'ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro',
            initWidths:'60,150,150,135,135,135,135,135,80,80,80,80',
            align:'left,left,left,left,left,left,left,left,left,left,left,left',
            addressInfo:[{idx:13,lng:16,lat:17},{idx:15,lng:18,lat:19}],
            wayIndex:14
        }
        ,{
        	// 停车表格配置:
            tableId:'stopTrackTable2',
            header:'序号,车牌号,车牌颜色,停车开始时间,停车结束时间,停车时长,里程(KM),位置',
            colTypes:'ro,ro,ro,ro,ro,ro,ro,ro',
            initWidths:'60,120,120,200,200,120,120,400',
            align:'left,left,left,left,left,left,left,left',
            addressInfo:[{idx:7,lng:8,lat:9}]
        }
       ,{
    	    // 盲区表格配置
            tableId:'blindAreaTable2',
            header:'序号,开始时间,结束时间,盲时时长,盲时经度,盲时纬度,位置',
            colTypes:'ro,ro,ro,ro,ro,ro,ro',
            initWidths:'80,160,160,160,160,160,300',
            align:'left,left,left,left,left,left,left',
            addressInfo:[{idx:6,lng:7,lat:8}]
        }
        ,{
        	// 图片表格配置
            tableId:'imagesTable2',
            header:'序号,车辆序号,车牌号,车牌颜色,定位时间,经度,纬度,图片路径',
            colTypes:'ro,ro,ro,ro,ro,ro,ro,ro',
            initWidths:'80,120,120,120,140,150,150,300',
            align:'left,left,left,left,left,left,left,left'
        }
        ,{
        	// 报警表格配置
            tableId:'alarmTable2',
            header:'序号,报警时间,报警类型,报警来源,经度,纬度,位置,海拔(米),GPS速度(km/h),电子速度 (km/h),GPS里程,脉冲里程,报警次数',
            colTypes:'ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro',
            initWidths:'60,140,120,120,120,150,200,150,150,150,150,150,150',
            align:'left,left,left,left,left,left,left,left,left,left,left,left,left',
            addressInfo:[{idx:6,lng:13,lat:14}]
        }
        ,{
        	// 区域表格配置
            tableId:'areaCarTable2',
            header:'序号,车牌号,区域名称',
            colTypes:'ro,ro,ro',
            initWidths:'100,150,600',
            align:'left,left,left'
        }
//        
    ];


    $.extend({
        /*
         *id:表格id
         * data:添加的数据
         */
        addGridData:function(id,data){
            var grid = dGridObj[id].grid;
            grid.clearAll();
            if(grid != undefined&& data && data.values){
            	var gridData={
 						rows:data.values()
 				};
                grid.parse(gridData,null,"json");
                dGridObj[id].data = data;
                dGridObj[id].lastShowRowIdx = 0;
                dGridObj[id].prevTop = 0;
                // 解析前30条的地址
            	var loopCount = dGridObj[id].data.size() >= 30 ? 30 : dGridObj[id].data.size();
            	var addressInfo = dGridObj[id].addressInfo;
        	/*	for(var i = 0; i< loopCount; i++){
        			var rowData = dGridObj[id].data.get(i);
        			//gridID,rowId,cellID(地址栏索引),纬度,经度
        			//getAddressNew(id,rowData.id,10,rowData.data[5],rowData.data[4]);
        		/!*	if(rowData != null && dGridObj[id].addressInfo/!* && (i == 0 || rowData.data[6] > 5)*!/){
        				for(var j =0; j < addressInfo.length; j++){
        					getAddressNew(id,rowData.id,addressInfo[j].idx,rowData.data[addressInfo[j].lng],rowData.data[addressInfo[j].lat]);
        				}
        			}*!/
        		}*/
        		dGridObj[id].lastShowRowIdx += loopCount;
            }
        },
        getGridTitles:function(id){
            var result = null;
            var options = null;
            for(var i=0;i<initOptions.length;i++){
                options = initOptions[i];
                if(options.tableId == id){
                    result = options.header;
                    break;
                }
            }
            return result;
        },
        getGridDatas:function(id){
            var result = '';
            var grid = dGridObj[id].grid;
            if(grid != undefined){
            	var idArray = grid.getAllRowIds().split(",");
                for(var i = 0; i < idArray.length; i++){
                    grid.forEachCell(idArray[i],function(cellObj,ind){
                        result += cellObj.getValue() + '#';
                    });
                    result += '&';
                }
            }
            return result;
        },
        initGrid:function(){
            for(var i=0;i<initOptions.length;i++){
                iniTable(initOptions[i],120);
                
            }
        },
        reInitGridById:function(id,optionIndex,height,data){
            	$("#"+initOptions[optionIndex].tableId).height(height);
            	var myGrid = dGridObj[id].grid;
            	if(myGrid)
            		myGrid.destructor();
            	iniTable(initOptions[optionIndex],height);
        		$.addGridData(id,dGridObj[id].data);
        },
        /*
         *id:表格id
         * rowId:选中行id
         */
        selectGridRow:function(id,rowId){
            var grid = dGridObj[id].grid;
            if(grid != undefined){
                var oId = grid.getSelectedRowId();
                grid.selectRowById(rowId,false,true,false);
                grid.showRow(rowId);
            }
        },
        /*
         *id:表格id
         * rowId:行id
         * cellId:列id
         * value:值
         */
        setGridCellValue:function(id,rowId,cellId,value){
            var grid = dGridObj[id].grid;
            if(grid == undefined)return;
            var dataMap = dGridObj[id].data;
            grid.cellById(rowId, cellId).setValue(value);
            var rowData = dataMap.get(rowId);
            rowData.data[cellId] = value;
            dataMap.put(rowId,rowData);
            if(dGridObj[id].wayIndex && cellId == dGridObj[id].wayIndex-1){
            	grid.cellById(rowId, dGridObj[id].wayIndex).setValue(value);
                var rowData = dataMap.get(rowId);
                rowData.data[dGridObj[id].wayIndex] = value;
                dataMap.put(rowId,rowData);
            }
            var rowsTotal = dataMap.size();
            for(var i = rowId+1; i < rowsTotal; i++){
            	rowData = dataMap.get(i);
            	if(rowData.data[rowData.data.length-1] <= 5){            		
            		rowData = dataMap.get(i);
            		rowData.data[cellId] = value;
            		dataMap.put(i,rowData);
            		grid.cellById(i, cellId).setValue(value);
            		if(dGridObj[id].wayIndex && cellId == dGridObj[id].wayIndex-1){
                    	grid.cellById(i, dGridObj[id].wayIndex).setValue(value);
                        var rowData = dataMap.get(i);
                        rowData.data[dGridObj[id].wayIndex] = value;
                        dataMap.put(i,rowData);
                    }
            	}else{
            		break;
            	}
            }
        },
        getGridCell:function(id,rowId,cellId){
            var grid = dGridObj[id].grid;
            if(grid != undefined){
                grid.cellById(rowId, cellId);
            }
        },
        clearAllGridData:function(id){
            var grid = dGridObj[id].grid;
            if(grid != undefined){
                grid.clearAll();
            }
        },
        gridObjectAutoHeight:function(id,height){
           var grid = dGridObj[id].grid;
           if(grid != undefined){
        	   grid.enableAutoHeight(true,height, true); 
           }
       }
        ,
        getCellValue:function(id,rowId,cellId){
        	  var grid = dGridObj[id].grid;
              if(grid != undefined){
                  return grid.cellById(rowId, cellId).getValue();
              }
       }
        ,
        getLastIndex:function(id){
      	  var grid = dGridObj[id].grid;
            if(grid != undefined){
            	var str=grid.getAllRowIds();
            	var strs=str.split(",");
                return strs.length-1;
            }
     },
    getGridObj:function(id){
    	  var grid = dGridObj[id].grid;
          if(grid != undefined){
              return grid;
          }
   }
     ,getGridDataById:function(id){
            var result = '';
            var grid = dGridObj[id].grid;
            if(grid != undefined){
                grid.forEachRow(function(rowId){
                	var rowdata="{ id:"+rowId+",data:[";
                    grid.forEachCell(rowId,function(cellObj,ind){
                    	rowdata+="\""+cellObj.getValue()+"\",";
                    });
                    rowdata=rowdata.substring(0,rowdata.length-1)+"]},"
                    result+=rowdata;
                });
            }
            if(result.length>0){
            	result="{rows:["+result.substring(0,result.length-1)+"]}"
            }
            return result;
        }
    });
})(jQuery);



function getAddressCallback(address,params){
	if(address&&params.gridboxId)
		$.setGridCellValue(params.gridboxId,params.rowId,params.addrIdx,address);
	else
		$(params.ctrlId).html(address);
	GlobalAddreeCache.put(params.key,address);
} 
// 正式启用高德地图解析地址
function getAddressNew(gridboxId,rowId,addrIdx,lng,lat,ctrlId) {
	var key = lng + "_" + lat;
	if(GlobalAddreeCache.containsKey(key)){
		if(gridboxId)
			$.setGridCellValue(gridboxId,rowId,addrIdx,GlobalAddreeCache.get(key));
		else
			$(ctrlId).html(GlobalAddreeCache.get(key));
		return;
	}
	var params = {gridboxId:gridboxId,rowId:rowId,addrIdx:addrIdx,ctrlId:ctrlId};
	getAddressCN(lat,lng,getAddressCallback,params,ctrlId);
}

//    var index;
function iniTable(obj,height){
    debugger;
    obj=initOptions[0];
//    	$("#"+obj.tableId).css({height:height});
    var grid = new dhtmlXGridObject(obj.tableId);
    grid.setImagePath("../imgs/");//设置grid中引用图片路径，如排序图片，checkbox图片，背景等
    grid.setHeader(obj.header);//列标题
    grid.setInitWidths(obj.initWidths);//各列宽度数字表示像素，弹性用*表示
    grid.setColAlign(obj.align);//设置列数据的水平布局
    grid.setColTypes(obj.colTypes);//设置列数据的数据类型(ch ---- checkbox; ra ---- radio;ro ---- readonly，双击具体某项数据时不可编辑的;txt ---- 显示的是字符串，双击某项数据会弹出编辑页面 )
    grid.setSkin("dhx_skyblue");//指明使用什么皮肤
    grid.init();
    grid.enablePreRendering(30);
    grid.enableSmartRendering(true);  //
//        grid.enableAutoHeight(true,height, true);
    if(!dGridObj[obj.tableId]) dGridObj[obj.tableId] = {};
    dGridObj[obj.tableId].grid = grid;
    dGridObj[obj.tableId].lastShowRowIdx = 0;

    // 有地址，才添加滚动事件
    if(obj.addressInfo){
        grid.attachEvent("onScroll",function(sLeft,sTop){
            if(dGridObj[obj.tableId].prevTop == sTop) return;
            dGridObj[obj.tableId].prevTop = sTop;
            dGridObj[obj.tableId].lastShowRowIdx = dGridObj[obj.tableId].lastShowRowIdx == 0 ? 0 : Math.ceil(sTop / 27);
            // 每次解析30行
            var loopCount = dGridObj[obj.tableId].lastShowRowIdx + 30;
            var rowsCount = dGridObj[obj.tableId].grid.getAllRowIds().split(",").length;
            loopCount = loopCount >= rowsCount ? rowsCount : loopCount;
            for(var i = dGridObj[obj.tableId].lastShowRowIdx; i< loopCount; i++){
                var rowData = dGridObj[obj.tableId].data.get(i);
                // 1、速度[0,5]取前一个地址，如是第一条，正常解析
                if(rowData != null/* && (i == 0 || rowData.data[rowData.data.length-1] > 5)*/){
                    var addressInfo = dGridObj[obj.tableId].addressInfo;
                   /* for(var j = 0; j < addressInfo.length; j++){
                        if(/\s?/.test(rowData[addressInfo[j].idx])){
                            getAddressNew(obj.tableId,i,addressInfo[j].idx,rowData.data[addressInfo[j].lng],rowData.data[addressInfo[j].lat]);
                        }
                    }*/
                }
            }
            dGridObj[obj.tableId].lastShowRowIdx += loopCount;
        });
        dGridObj[obj.tableId].addressInfo = obj.addressInfo;
        if(obj.wayIndex)
            dGridObj[obj.tableId].wayIndex = obj.wayIndex;
    }
    dGridObj[obj.tableId].prevTop = 0;
    $(".hdr").css({"border-collapse":"separate","border-spacing":"0px"});
}