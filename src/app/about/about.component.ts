import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgForOf } from '@angular/common';
import { ResumeService } from '../services/resume.service';

import * as xml2js from 'xml2js';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, NgFor,NgForOf],
  providers: [ResumeService],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  skill: any;
  skills: Array<any>;
  filteredSkillList: any[] = [];

  items: Array<any> = [];

  constructor(private resumeService: ResumeService) { 
  	this.skills = 
        [{name:'Python', id:'Programming Languages'},
         {name:'Java', id:'Programming Languages'},
         {name:'Java Script', id:'Programming Languages'},
         {name:'Express.js', id:'Frameworks'},
         {name:'Angular', id:'Frameworks'}];
  }
  ngOnInit() {
    this.resumeService
    .getResume()
    .subscribe(result => 
      {
        let that = this;
        xml2js.parseString(result, 
          function (err, output) {
            if (err) {
              console.error("Error parsing XML:", err);
              return;
            }
            
            that.items = output.resumeList.experience || [];
            console.log(that.items);
        });
      });
  }
  
  filterResults(text: string) {
    console.log("filterresults")
    if (!text) {
      this.filteredSkillList= this.skills;
      return;
    }
  
    this.filteredSkillList = this.skills.filter(
      skill => skill?.name.toLowerCase().includes(text.toLowerCase())
    );
  }

}
