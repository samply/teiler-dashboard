import {Component} from '@angular/core';
import {InquiriesComponent, InquiriesTableItemColumn} from "./inquiries.component";
import {ArchivedInquiriesService} from "../../teiler/archived-inquiries.service";


@Component({
  selector: 'archived-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class ArchivedInquiriesComponent extends InquiriesComponent{

  constructor(archivedInquiriesService: ArchivedInquiriesService) {
    super(archivedInquiriesService);
  }

  getInquiriesTableItemColumnsToDisplay(): InquiriesTableItemColumn[]{
    return [
      InquiriesTableItemColumn.ID,
      InquiriesTableItemColumn.NAME,
      InquiriesTableItemColumn.RECEIVED_AT,
      InquiriesTableItemColumn.ARCHIVED_AT
    ];
  };


}
