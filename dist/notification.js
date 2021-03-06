
var NotifyCenter = null;

var NotificationClass = function(){

	this.notifyActions = Reflux.createActions([]);

	this.checkName = function(notifyName){
		if (Object.prototype.toString.call(notifyName) !== "[object String]"){
			return [false, "notifyName must be a String"];
		}

		if (!NotifyCenter) {
			return [false, "NotifyCenter not been instantiated"];
		}

		return [true, notifyName + " create success"];
	};

	this.createNotify = function(notifyName){
		if (!this.notifyActions[notifyName]) {
			this.notifyActions[notifyName] = Reflux.createAction();
			this.notifyActions[notifyName].observers = [];
			this.notifyActions[notifyName].listen(function(notifyEntity){
				for(var i=0; i<this.observers.length; i++){
					this.observers[i](notifyEntity);
				};
			});
		}
	};
};

NotificationClass.init = function(){

	if (!NotifyCenter) {
		NotifyCenter = new NotificationClass();
	};
	return NotifyCenter;
};

NotificationClass.prototype.post = function(notifyName, param){

	var checkResult = this.checkName(notifyName);
	if (!checkResult[0]) {
		return checkResult;
	}else{
		this.createNotify(notifyName);
		param = param || {};
		this.notifyActions[notifyName](param);
	}
};

NotificationClass.prototype.addObserver = function(notifyName, callback){

	var checkResult = this.checkName(notifyName);
	if (checkResult[0] && callback instanceof Function) {
		this.createNotify(notifyName);
		this.notifyActions[notifyName].observers.push(callback);
	}
};

module.exports = NotificationClass;

