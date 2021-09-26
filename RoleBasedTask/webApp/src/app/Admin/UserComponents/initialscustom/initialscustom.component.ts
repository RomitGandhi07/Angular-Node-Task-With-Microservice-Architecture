import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-initialscustom',
  templateUrl: './initialscustom.component.html',
  styleUrls: ['./initialscustom.component.css']
})
export class InitialscustomComponent {

  constructor() { 
    
  }
 
  param: any;

  
  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  colorOfCanvas=this.getRandomColor();

  agInit(params: any): void {
    this.param = params.data.userName

   }
    getInitials(name:string){
    
      let canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      canvas.width = 24;
      canvas.height = 24;
      document.body.appendChild(canvas);
      let context = canvas.getContext('2d');
      context.fillStyle = this.colorOfCanvas;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "14px Arial";
      context.fillStyle = "#FFFFFF";
        const nameArray = name.split(' ');
        let initials='';
        for(let i=0;i<nameArray.length;i++)
        {
          if(i<=1){
            initials=initials+nameArray[i][0];
          }
         
        }
        if(initials.length > 1){
          context.fillText(initials.toUpperCase(), 2, 18);
        }else{
          context.fillText(initials.toUpperCase(), 5, 18);
        }
  
        const data = canvas.toDataURL();
        document.body.removeChild(canvas);
        return data;
    }
   
  
}