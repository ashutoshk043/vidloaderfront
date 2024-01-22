import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  showVideoList:boolean=false
  videoDetails:any
  formats:any

  constructor(private http:HttpClient){

  }
  


  fetchVideoDetails(event:ClipboardEvent){
    const pastedValue = event.clipboardData?.getData('text/plain') || '';
    const isValidUrl = /^https?:\/\/\S+$/.test(pastedValue);
    if(!isValidUrl){
      alert("Invalid Url")
    }else{
      //fetch details of video
      this.http.post(`${environment.apiUrl}/getVideoDetails`, {videoUrl:pastedValue}).subscribe({
        next:(res:any)=>{
          this.videoDetails = res.data
          this.formats = res?.data?.videoFormats.sort()
          this.showVideoList = true
          console.log(this.videoDetails)
        }
      })
    }
  }
}
