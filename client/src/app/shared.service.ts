import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
declare var jQuery:any;

@Injectable()
export class SharedService {
	sharedObj: any = {userProfile: {}};
	containerContext: any;
	token: string = "";
	
	constructor(private auth: AuthenticationService, private http: HttpClient){
		
	}
	
	getUserProfile(callback){
		var that = this;
		if(!(that.sharedObj["userProfile"].user_id)){
			var userDetail = that.auth.getUserDetails();
			that.call('profile/?user_id='+userDetail.user_id, "get", null, true)
				   .subscribe( data => {							
						that.sharedObj["userProfile"] = data.results[0];
						//ref = data.results[0];
						callback(that.sharedObj.userProfile);
			});
		}
		else{
			//ref = that.sharedObj.userProfile;
			callback(that.sharedObj.userProfile);
		}		
	}
	
	call(entity, method, obj, admin) {
		this.token = this.auth.getToken();
		let url = "";
		if(admin){
			url = 'http://localhost:3000/api/';
		}
		else{
			url = 'http://localhost:3000/api/public/node/';
		}
		let base;

		if (method === 'post') {
		  base = this.http.post(url+entity, obj, { headers: { Authorization: `Bearer ${this.token}` }});
		} 
		else if (method === 'put') {
		  base = this.http.put(url+entity, obj, { headers: { Authorization: `Bearer ${this.token}` }});
		}
		else if (method === 'get') {
		  base = this.http.get(url+entity, { headers: { Authorization: `Bearer ${this.token}` }});
		}
		else if (method === 'delete') {
		  base = this.http.delete(url+entity, { headers: { Authorization: `Bearer ${this.token}` }});
		} 

		const request = base.map((res: any) => {return res;});

		return request;
	}
	
	setBusy(state){
		if(state)
			document.getElementById("loaderContainer").style.display = "block";
		else
			setTimeout(function(){ document.getElementById("loaderContainer").style.display = "none"; }, 2000);			
	}
	
	
	validateFields(form){
        var that = this;
		var status = true;
        //Validate Input Element
        var inputs = form.getElementsByTagName("input");                                       
        jQuery.each(inputs,function(i,v){
                       if(v.required
                            && !(jQuery.trim(v.value)) ){
                             v.style.border= "2px solid red";
                             v.style.boxShadow = "inset 0 1px 8px red";
                             v.removeEventListener("keyup", that.clearHighlight);
                             v.addEventListener("keyup", that.clearHighlight);                                                                            
							 that.openMessageBox("E","Please fill all the required fields.",null);
							 status = false;
                       }
        });
                                            
        //Validate Select Element
        var selects = form.getElementsByTagName("select");
       jQuery.each(selects,function(i,v){
                       if(v.required
                            && !(jQuery.trim(v.value)) ){
                              v.style.border= "2px solid red";
                              v.style.boxShadow = "inset 0 1px 8px red";
                              v.removeEventListener("keyup", that.clearHighlight);
                              v.addEventListener("change", that.clearHighlight);
                              that.openMessageBox("E","Please fill all the required fields.",null);
							  status = false;
                       }
       });
	   return status;
    }
                              
    clearHighlight(ele){
        ele.target.style.border = "";
        ele.target.style.boxShadow = "";
    }
                               
    openMessageBox(type,msg,callback){
        var that = this;
        if(!document.getElementById('global_msg_dialog_container')){
            //Create Dialog Wrapper/Container
            var c = document.createElement('DIV');
            c.setAttribute("id", "global_msg_dialog_container");
                                            
           //Create Dialog Overlay
           var o = document.createElement('DIV');
           o.setAttribute("id", "global_msg_dialog_overlay");
           o.className = 'global_msg_dialog_overlay';
           //jQuery("#global_msg_dialog_overlay").addClass("global_msg_dialog_overlay");
           o.addEventListener("click", that.closeMessageBox);
           c.appendChild(o);
                                                               
           //Create Dialog Content Area
           var d = document.createElement('DIV');
           d.setAttribute("id", "global_msg_dialog");
           d.className = 'global_msg_dialog';
           //jQuery("#global_msg_dialog").addClass("global_msg_dialog");
           c.appendChild(d);
                                                                         
           //Create Dialog Header
           var h = document.createElement('DIV');
           h.className = 'global_msg_dialog_header';
           var i = document.createElement('SPAN');//Header Icon
           h.appendChild(i);
           d.appendChild(h);
		   
		   //Create Dialog Close Button
           var b = document.createElement('BUTTON');
           b.className = "global_msg_dialog__close-btn";
           b.innerHTML = "&times;";
           b.addEventListener("click", that.closeMessageBox);
           h.appendChild(b);
                                                    
          //Create Message Paragraph
			var p = document.createElement('P');
            p.innerHTML = msg;
            p.className = 'global_msg_dialog_text';
            d.appendChild(p);
			
           if(type == "E"){
               i.className= 'global_msg_dialog_error_icon';
               h.innerHTML+= " Error";
           }
           else if(type == "I"){
               i.className= 'global_msg_dialog_info_icon';
               h.innerHTML+= " Information";
           }
		   else if(type == "C"){
               i.className= 'global_msg_dialog_info_icon';
               h.innerHTML+= " Confirmation";
			   
			   var f = document.createElement('DIV');
			   f.className= 'global_msg_dialog_footer';
			   var ok = document.createElement('BUTTON');
			   ok.addEventListener("click", callback);
			   ok.innerHTML+= "Ok";
			   f.appendChild(ok);
			   
			   var cancel = document.createElement('BUTTON');
			   cancel.addEventListener("click", that.closeMessageBox);
			   cancel.innerHTML+= "Cancel";
			   f.appendChild(cancel);
			   
			   d.appendChild(f);
           }                                                            
         
                                            
            document.body.appendChild(c);//Append to Body
        }
     }

     closeMessageBox(){
          if(document.getElementById('global_msg_dialog_container')){
               jQuery("#global_msg_dialog_container").remove();
          }
	 } 

 
}
