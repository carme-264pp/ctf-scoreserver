var Stream = (function(notification) {
	var es = new EventSource('/stream');
	es.onmessage = function(e) {
		var data = JSON.parse(e.data);
		if (data.type === "challenge") {
			notification.newNotify({title: "新しい問題があります", 
				detail: "新しい問題が追加されました！\n 問題:"
				+ data.abstract
				+ "\n 得点:" 
				+ data.point
			});
			return;
		}
		if (data.type === "announce") {
			notification.newNotify({title: "新しいお知らせがあります", 
				detail: " 件名:" + data.subject
			});
			return;
		}
	}
});
var CtfNotification = (function(arg_status) {
	var status = arg_status;
	var useable = false;
	return {
		enableNotification: function() {
			if (window.webkitNotifications) {
				if (window.webkitNotifications.checkPermission() === 0) {
					status.updateStatusMessage("enable notification.");
					useable = true;
					return;
				}
				window.webkitNotifications.requestPermission(function() {
					if (window.webkitNotifications.checkPermission() === 0) {
						status.updateStatusMessage("disabled notification.", "label-warning");
					}
					useable = true;
					status.updateStatusMessage("enable notification.", "label-success");
				});
				return;
			}
			if (Notification) {
				if (Notification.permission === "denied" ) {
					status.updateStatusMessage("disable notification", "label-warning");
					return;
				}
				Notification.requestPermission(function(p) {
					if (p === "denied") {
						status.updateStatusMessage("disable notification", "label-warning");
						return;
					}
					useable = true;
				});
				return;
			}
			status.updateStatusMessage("not support notification.", "label-warning");
		},
			disableNotification: function() {
				useable = false;
				status.updateStatusMessage("disabled notification.", "label-success");
			},
			newNotify: function(msg) {
				if (!useable) return;
				if (window.webkitNotifications) {
					var notify = window.webkitNotifications.createNotification('', msg.title , msg.detail);
					notify.ondisplay = function() { 
						setTimeout(function() { notify.cancel(); }, 3000);
					}
					notify.show();
					return;
				}
				var notification = new Notification(msg.title, { body: msg.detail});
				notification.onshow = function() { setTimeout(notification.close, 3000);}
				return;
			}
	}
});
var Status = (function() {
	var status = $('#js_msg');
	return {
		updateStatusMessage: function(msg, label_class) {
			status.removeClass()
				.addClass('label').addClass('status-label')
				//.addClass(label_class)
				.html(msg);
		}
	}
});

$(function() {
	var s = Status();
	var n = CtfNotification(s);
	n.enableNotification();
	var es = Stream(n);
	$("#notifyBtn").click(function() {
		n.enableNotification();
	});
});
