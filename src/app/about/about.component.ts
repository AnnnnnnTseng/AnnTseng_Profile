import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { ResumeService } from '../services/resume.service';

// const xml2js = require('xml2js');

// import * as xml2js from 'xml2js';
// import { XMLParser } from 'fast-xml-parser';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, NgFor, NgForOf, CommonModule],
  providers: [ResumeService],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  skill: string = '';


  originalItems: Array<any> = [];
  items: Array<any> = [];
  searchText: string = '';
  searchTriggered: boolean = false; 
  groupedItems: { [key: string]: any[]} = {}
  skillCategories: { [key: string]: any[]} = {}

  constructor(private resumeService: ResumeService) {}
  ngOnInit() {
    this.loadResume();
  }

  loadResume() {
    this.resumeService.getResume().subscribe(result => {
      let that = this;
      const parserOptions = {
        ignoreAttributes: false, // Keep attributes if there are any
        trimValues: true,        // Trim whitespace around values
      };
      // const parser = new XMLParser(parserOptions);
      // XML is structured data, and you need it to be 
      // in a JavaScript object format to work with it more easily in Angular.
      // result : the XML string returned from resume.xml
      // ouput : ouput of parseString function, meaning the js object version of result
      // ouput sample:{
          //   resumeList: {
          //     experience: [
          //       {
          //         type: ["Education"],
          //         title: ["Master of Science in Software Development"],
          //         subtitle: ["Boston University (Boston, MA)"],
          //         detail: ["Selected Courses: Database Design and Implementation..."]
          //       }
          //     ]
          //   }
          // }
      // try {
      //   // Parse the XML string into JSON
      //   const output = parser.parse(result);
      //   console.log('Parsed JSON:', output);
      //   // Access the parsed data directly
      //   that.originalItems = output.resumeList?.experience || [];
      //   console.log('originalItems:', that.originalItems)
      //   that.items = [...that.originalItems]; // Store a copy of original data for potential changes
      //   console.log('items:', that.items)
      //   that.groupItems(); // Group items after loading
      //   that.showSkillTable(); // Show the skill table
      // } catch (err) {
      //   console.error('Error parsing XML:', err);
      // }

      (async () => {
        const { parseString } = await import('xml2js');
      
        parseString(result, function (err, output) {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }
          // console.log("output: ", output);
          // var tmp_originalItems = output.resumeList.experience || [];
          // console.log('old originalItems:', tmp_originalItems)
          // var tmp_items = [...tmp_originalItems]; // Store a copy of original data for potential change
          // console.log('items:', tmp_items)
  
          that.originalItems = output.resumeList.experience || [];
          that.items = [...that.originalItems]; // Store a copy of original data for potential change
          that.groupItems(); // Group items after loading
          that.showSkillTable()
        });
      })();

        // xml2js.parseString(result, function (err, output) {
        //   if (err) {
        //     console.error("Error parsing XML:", err);
        //     return;
        //   }
        //   // console.log("output: ", output);
        //   // var tmp_originalItems = output.resumeList.experience || [];
        //   // console.log('old originalItems:', tmp_originalItems)
        //   // var tmp_items = [...tmp_originalItems]; // Store a copy of original data for potential change
        //   // console.log('items:', tmp_items)
  
        //   that.originalItems = output.resumeList.experience || [];
        //   that.items = [...that.originalItems]; // Store a copy of original data for potential change
        //   that.groupItems(); // Group items after loading
        //   that.showSkillTable()
        // });
    });
  }
  
  filterResults(text: string) {
    // Mark that the search button has been clicked
    this.searchTriggered = true;

    if (!text) {
      this.items = []; // Reset to original if no input
      return;
    }
    // The filtered list is then stored in this.items
    // which updates the view with the matching results.
    this.items = this.originalItems.filter(item => {
      // .filter() iterates over each item in the list
      // the function inside it (the callback) determines 
      // whether an item should be included in the filtered 
      // this.items list based on the search text.
      return (
        // If any of the title, subtitle, or detail fields contain the search text
        // the function returns true, meaning the item passes the filter 
        // and is included in this.items.
        item.type[0]?.toLowerCase().includes(text.toLowerCase()) ||
        item.title[0]?.toLowerCase().includes(text.toLowerCase()) ||
        item.subtitle[0]?.toLowerCase().includes(text.toLowerCase()) ||
        item.detail.some((d: string) => d.toLowerCase().includes(text.toLowerCase()))
      );
    });
  }

  private groupItems() {
    this.groupedItems = {}
    this.originalItems.forEach(item => {
      const type = item.type[0];
      if (!this.groupedItems[type]) {
        this.groupedItems[type] = [];
      }
      this.groupedItems[type].push(item);
    })
  }

  showSkillTable() {
    const skillTypes: any = {
      "Programming Languages": [],
      "Frameworks and Libraries": [],
      "Database and Cloud services": [],
      "Tools and Others": []
    };

    this.originalItems.forEach((item: any) => {
      const resumeCategory = item.type[0];

      if (resumeCategory == "Skills") {
        const skillType = item.title[0];
        const skill = item.detail[0];

        if (skillType in skillTypes) {
          skillTypes[skillType].push(skill)
        }
      }
    })
    this.skillCategories = skillTypes
    // console.log(this.skillCategories);
    // console.log(this.originalItems)
  }
}
