import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {InquiriesClientService, Inquiry} from "../inquiries-client.service";
import {ActivatedRoute, Router} from "@angular/router";
// @ts-ignore
import {Data, data} from './data'
import {Dataname, dataname} from "./dataname";
import {InquiryDialogComponent} from "../../pop-ups/inquiry-dialog/inquiry-dialog.component";
import {MatDialog} from "@angular/material/dialog";

export interface data {
  id: Number;
  nameone: string;
  searchfor: string;
  receivedat: string;
  archivedat: string;

}

const ELEMENT_DATA: data[] = [
  {
    id: 0,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '17.09.2020 15:20',
    archivedat: ''
  },
  {
    id: 1,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '18.02.2021 10:01',
    archivedat: ''
  },
  {
    id: 2,
    nameone: 'No way',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '24.02.2021 15:31',
    archivedat: ''
  },
  {
    id: 3,
    nameone: 'Test Dennis',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '03.03.2021 08:46',
    archivedat: ''
  },
  {
    id: 4,
    nameone: 'Test Dennis 2',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '03.03.2021 08:49',
    archivedat: ''
  },
  {
    id: 5,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '12.03.2021 12:11',
    archivedat: ''
  },
  {
    id: 6,
    nameone: 'Schnelltest',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '12.04.2021 10:41',
    archivedat: ''
  },
  {
    id: 7,
    nameone: 'Schnelltest',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '12.04.2021 10:53',
    archivedat: ''
  },
  {
    id: 8,
    nameone: 'Geschlecht = W',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '31.08.2021 16:58',
    archivedat: ''
  },
  {
    id: 9,
    nameone: 'test c4 fhir',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '29.12.2021 11:44',
    archivedat: ''
  },
  {
    id: 10,
    nameone: 'test c4 fhir',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '26.01.2022 13:48',
    archivedat: ''
  },
  {
    id: 11,
    nameone: 'Test-tobias-20220527',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '27.05.2022 13:36',
    archivedat: ''
  },
  {
    id: 12,
    nameone: 'Sarkome',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '28.09.2022 00:30',
    archivedat: ''
  },
  {
    id: 13,
    nameone: 'asdfasdf',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '10.08.2022 11:33',
    archivedat: '08.09.2022 00:30'
  },
  {
    id: 14,
    nameone: 'test6.7.2022',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '06.07.2022 16:39',
    archivedat: '04.08.2022 00:30'
  },
  {
    id: 15,
    nameone: 'Erste Suchanfrage',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '30.03.2022 15:05',
    archivedat: '28.04.2022 00:30'
  },
  {
    id: 16,
    nameone: 'FHIR Test #?',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '22.03.2022 11:01',
    archivedat: '20.04.2022 00:30'
  },
  {
    id: 17,
    nameone: 'Test15.03.2022',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '15.03.2022 15:07',
    archivedat: '13.04.2022 00:30'
  },
  {
    id: 18,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '07.02.2022 15:11',
    archivedat: '08.03.2022 00:30'
  },
  {
    id: 19,
    nameone: 'test 20220110',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '10.01.2022 11:29',
    archivedat: '09.02.2022 00:30'
  },
  {
    id: 20,
    nameone: 'test querry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '05.01.2022 13:52',
    archivedat: '03.02.2022 00:30'
  },
  {
    id: 21,
    nameone: 'All Patients',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '11.03.2021 17:36',
    archivedat: '26.10.2021 00:30'
  },
  {
    id: 22,
    nameone: 'Geschlecht M',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '09.07.2021 09:53',
    archivedat: '07.08.2021 00:30'
  },
  {
    id: 23,
    nameone: 'Test#2',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '30.06.2021 10:28',
    archivedat: '29.07.2021 00:30'
  },
  {
    id: 24,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '30.06.2021 10:29',
    archivedat: '29.07.2021 00:30'
  },
  {
    id: 25,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '28.06.2021 10:57',
    archivedat: '27.07.2021 00:30'
  },
  {
    id: 26,
    nameone: 'Test 123',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '21.05.2021 10:36',
    archivedat: '19.06.2021 00:30'
  },
  {
    id: 27,
    nameone: 'local broker test',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '06.04.2021 10:30',
    archivedat: '05.05.2021 00:30'
  },
  {
    id: 28,
    nameone: 'test-20200806',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '06.08.2020 15:33',
    archivedat: '18.02.2021 09:59'
  },
  {
    id: 29,
    nameone: 'Test Biomaterialmaterial 8.9.2020',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '08.09.2020 13:33',
    archivedat: '07.01.2021 00:30'
  },
  {
    id: 30,
    nameone: 'Test-Mohamed-20201023',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '23.10.2020 14:46',
    archivedat: '21.11.2020 00:30'
  },
  {
    id: 31,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '06.08.2020 15:30',
    archivedat: '04.09.2020 00:30'
  },
  {
    id: 32,
    nameone: 'Unnamed inquiry',
    searchfor: 'Patients Biomaterial Clinical data',
    receivedat: '06.08.2020 15:30',
    archivedat: '04.09.2020 00:30'
  }
]

export interface daten {
  id: Number;
  name: string;
}

const daten = [
  {
    id: 1,
    name: '04.10.2022 10:04:49 - Reply sent to broker. Got reply 200 '
  },
  {
    id: 2,
    name: '28.09.2022 00:30:00 - Moving inquiry to archive after 28 days '
  },
  {
    id: 3,
    name: '27.09.2022 10:15:25 - Found 261 results. '
  },
  {
    id: 4,
    name: '27.09.2022 10:14:50 - Show raw query / Show stats'
  },
  {
    id: 5,
    name: '27.09.2022 10:14:47 - Posted to Local Datamanagement '
  },
  {
    id: 6,
    name: '27.09.2022 00:30:00 - Moving inquiry to archive after 28 days '
  },
  {
    id: 7,
    name: '26.09.2022 11:20:37 - Found 261 results'
  },
  {
    id: 8,
    name: '26.09.2022 11:20:01 - Show raw query / Show stats'
  },
  {
    id: 9,
    name: '26.09.2022 11:19:57 - Posted to Local Datamanagement '
  },
  {
    id: 10,
    name: '26.09.2022 00:30:00 - Inquiry was archived since the result is no longer available '
  },
  {
    id: 11,
    name: '26.09.2022 00:30:00 - Inquiry was archived since the result is no longer available '
  },
  {
    id: 12,
    name: '26.09.2022 00:30:00 - Inquiry was archived since the result is no longer available '
  },
  {
    id: 13,
    name: '25.09.2022 00:30:00 - Inquiry was archived since the result is no longer available '
  }
]

@Component({
  selector: 'inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit, OnDestroy {

  inquiry: Inquiry = {
    id: '',
    label: '',
    receivedAt: '',
    archivedAt: '',
    error: '',
    description: '',
    contactId: '',
    templateId: '',
    lastExecutedAt: ''
  }
  executionUrl: string | undefined = undefined;

  subscription: Subscription | undefined = undefined;

  dataSource2 = ELEMENT_DATA;
  //table
  displayedColumns: string[] = ['name'];
  dataSource = daten;
//diagramms
  title = 'template';
  panelOpenState = false;


  data1 = [
    {name: "0...9", value: 14},
    {name: "10...19", value: 26},
    {name: "20...29", value: 20},
    {name: "30...39", value: 25},
    {name: "40...49", value: 42},
    {name: "50...59", value: 32},
    {name: "60...69", value: 34},
    {name: "70...79", value: 49},
    {name: "80...89", value: 17},
    {name: "90...99", value: 2},
    {name: "100+", value: 0},
    {name: "Unbekannt", value: 0}

  ]
  data2 = [
    {name: "M", value: 148},
    {name: "W", value: 113}
  ]
  querydata: Dataname = {id: 0, name: ""};
  data: Data | undefined;

  constructor(private route: ActivatedRoute, private inquiriesClientService: InquiriesClientService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.querydata.id = +params['id']; // (+) converts string 'id' to a number
      // @ts-ignore
      this.querydata.name = dataname.find(rootid => rootid.id === this.querydata.id).name;
      this.inquiriesClientService.fetchInquiry(params['id'])?.subscribe(inquiry => this.inquiry = inquiry);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InquiryDialogComponent, {});

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

  postRequest() {
    if (this.inquiry.id != '') {
      this.inquiriesClientService.postRequest(this.inquiry.id, "ccp", "EXCEL")?.subscribe(value => this.executionUrl = value.responseUrl)
    }
  }

  createExport(){
    if (this.executionUrl){
      this.inquiriesClientService.createExport(this.executionUrl);
    }
  }

}
