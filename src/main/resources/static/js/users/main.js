"use strict";
//# sourceURL=main.js
 
// DOM 加载完再执行
$(function() {
	
	var _pageSize; // 存储用于搜索
	
	// 根据用户名、页面索引、页面大小获取用户列表
	function getUsersByName(pageIndex, pageSize) {
		 $.ajax({ 
			 url: "/users", 
			 contentType : 'application/json',
			 data:{
				 "async":true, 
				 "pageIndex":pageIndex,
				 "pageSize":pageSize,
				 "name":$("#searchName").val()
			 },
			 success: function(data){
				 $("#mainContainer").html(data);
		     },
		     error : function() {
		         alert("error");
		     }
		 });
	}
	
	// 分页
	$.tbpage("#mainContainer", function (pageIndex, pageSize) {
		getUersByName(pageIndex, pageSize);
		_pageSize = pageSize;
	});
   
	// 搜索
	$("#searchNameBtn").click(function() {
		getUersByName(0, _pageSize);
	});

	$("#addUser").click(function () {
		$.ajax({
			url: "/users/add",
			success: function (data) {
				$("#userFormContainer").html(data);
            },
			error: function (data) {
				toastr.error("error!");
            }
		});
    });

    $("#rightContainer").on("click", ".blog-edit-user", function () {
        $.ajax({
            url: "/users/edit/" + $(this).attr("userId"),
            success: function (data) {
                $("#userFormContainer").html(data);
            },
            error: function () {
                toastr.error("error!");
            }
        });
    });

    $("#submitEdit").click(function () {
        $.ajax({
            url: "/users",
			type: "POST",
			data: $("#userForm").serialize(),
            success: function (data) {
                $("#userForm")[0].reset();
                if(data.success) {
                	getUsersByName(0, _pageSize);
				} else {
                	toastr.error(data.message);
				}

            },
            error:
                // function(XMLHttpRequest, textStatus, errorThrown){
                //     alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
                // }
				function () {
                    toastr.error("error!");
                }
        });
    });

    $("#rightContainer").on("click", ".blog-delete-user", function () {
    	// 启用权限后,请求如果不包含token会报错.因引入相关包,提交表单会自动带token,但ajax发送delete的请求,要手工添加token
    	var csrfToken = $("meta[name='_csrf']").attr("content");
    	var csrfHeader = $("meta[name='_csrf_header']").attr("content");

        $.ajax({
            url: "/users/" + $(this).attr("userId"),
			type: "DELETE",
			beforeSend: function(request) {
            	request.setRequestHeader(csrfHeader, csrfToken);
			},
            success: function (data) {
                if(data.success) {
                	getUsersByName(0, _pageSize);
				} else {
                	toastr.error(data.message);
				}
            },
            error: function () {
                toastr.error("error!");
            }
        });
    });
	
	
});