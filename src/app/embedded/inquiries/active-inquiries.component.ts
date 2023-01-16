import {Component} from '@angular/core';
import {InquiriesComponent, InquiriesTableItemColumn} from "./inquiries.component";
import {ActiveInquiriesService} from "../../teiler/active-inquiries.service";


@Component({
  selector: 'active-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class ActiveInquiriesComponent extends InquiriesComponent{

  constructor(activeInquiriesService: ActiveInquiriesService) {
    super(activeInquiriesService);
  }

  getInquiriesTableItemColumnsToDisplay(): InquiriesTableItemColumn[]{
    return [
      InquiriesTableItemColumn.ID,
      InquiriesTableItemColumn.NAME,
      InquiriesTableItemColumn.RECEIVED_AT,
    ];
  };

  getTitel(): string {
    return "Aktive Suchanfragen";
  }

}
