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
  percentComplete:any

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

  downloadVideo(url: any) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        this.percentComplete = (event.loaded / event.total) * 100;
        console.log('Download Progress:', this.percentComplete.toFixed(2) + '%');
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        this.saveBlob(blob, 'downloadedFile'); // Replace 'downloadedFile' with your desired file name
      } else {
        console.error('Failed to download file. Status:', xhr.status);
      }
    };

    xhr.send();
  }

  private saveBlob(blob: Blob, fileName: string): void {
    const temporaryDownloadLink = document.createElement('a');
    document.body.appendChild(temporaryDownloadLink);

    const objectUrl = window.URL.createObjectURL(blob);
    temporaryDownloadLink.href = objectUrl;
    temporaryDownloadLink.download = fileName;

    temporaryDownloadLink.click();

    document.body.removeChild(temporaryDownloadLink);
    window.URL.revokeObjectURL(objectUrl);
  }


}
