import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient) { }

  getResume(): Observable<string> {
  	return this.http.get('assets/resume.txt', {responseType: 'text'})
  }

}
