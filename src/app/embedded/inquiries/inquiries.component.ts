import {Component, OnInit} from '@angular/core';
import {InquiriesService} from "../../teiler/inquiries.service";
import {Inquiry} from "./inquiries-client.service";
import {EmbeddedTeilerApps} from "../../teiler/teiler-app";
import {createRouterLinkForBase} from "../../route/route-utils";
import {Observable} from "rxjs";

export enum InquiriesTableItemColumn {
  ID = 'Id',
  NAME = 'Name',
  RECEIVED_AT = 'Received at',
  ARCHIVED_AT = 'Archived at',
  ERROR_CODE = 'Error Code'
}

@Component({
  selector: 'inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export abstract class InquiriesComponent implements OnInit {

  inquiriesTableItemColumn: typeof InquiriesTableItemColumn = InquiriesTableItemColumn;
  inquiries: Inquiry[] = [];

  constructor(private inquiriesService: InquiriesService) {
  }

  ngOnInit(): void {
    this.inquiriesService.fetchInquiries().subscribe(inquiries => this.inquiries = inquiries);
  }

  abstract getInquiriesTableItemColumnsToDisplay(): InquiriesTableItemColumn[];

  abstract getTitel(): string;

  private columnGetterMap = new Map<InquiriesTableItemColumn, (item: Inquiry) => string | undefined>([
    [InquiriesTableItemColumn.ID, item => item.id],
    [InquiriesTableItemColumn.NAME, item => item.label],
    [InquiriesTableItemColumn.RECEIVED_AT, item => item.receivedAt],
    [InquiriesTableItemColumn.ARCHIVED_AT, item => item.archivedAt],
    [InquiriesTableItemColumn.ERROR_CODE, item => item.error]
  ]);

  getInquiriesTableItemColumn(item: Inquiry, column: InquiriesTableItemColumn): string | undefined {
    // @ts-ignore
    let getter: (item: InquiriesTableItem) => string = this.columnGetterMap.get(column);
    return getter(item);
  }

  getRouterLink(inquiry: Inquiry): string {
    return '/' + createRouterLinkForBase(EmbeddedTeilerApps.INQUIRY + '/' + inquiry.id);
  }
  reload() {
    window.location.reload();
    // any other execution
    this.ngOnInit()
  }
}
